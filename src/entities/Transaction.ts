import {
    Column,
    Entity,
    Equal,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { TaxTable } from "./TaxTable";
import { User } from "./User";
import { v4 as uuid } from "uuid";
import { buildTransactionResponse } from "../common/MiscMethods";
import { dbSource } from "../database";

@Entity("transactions")
class Transaction {
    @PrimaryColumn()
    @Exclude()
    readonly transaction_id: string;

    @JoinColumn({ name: "fk_user_id" })
    @ManyToOne(() => User, { eager: true })
    fk_user_id: User;

    @JoinColumn({ name: "fk_tax_id" })
    @ManyToOne(() => TaxTable, { eager: true })
    fk_tax_id: TaxTable;

    @Column()
    transaction_date: Date;

    @Column()
    API_numero_declaracao: string;

    @Column()
    API_PGDASD_declaracao: string;

    @Column()
    API_PGDASD_recibo: string;

    constructor() {
        if (!this.transaction_id) this.transaction_id = uuid();
    }

    async calcDASTotal(): Promise<number> {
        let tx_data = await buildTransactionResponse(this);
        let aliquotaEfetiva = tx_data.effective_tax_percentage;
        let aliquotaTabelaReparticao = tx_data.repartition_table_iss_percentage;
        let issPorcentagemCorreta = aliquotaEfetiva * aliquotaTabelaReparticao;
        let aliquotaCalc =
            tx_data.effective_tax_percentage * tx_data.comission_total;
        let baseRetidaTotal = 0;
        let baseNaoRetidaTotal = 0;

        tx_data.comission_entries.map((elem) => {
            let issElementoPercent = elem.iss_value / elem.commission_value;

            if (issElementoPercent < issPorcentagemCorreta) {
                baseRetidaTotal += elem.iss_value / issPorcentagemCorreta;
                baseNaoRetidaTotal +=
                    elem.commission_value - elem.iss_value / issPorcentagemCorreta;
            } else {
                baseRetidaTotal += elem.commission_value;
            }
        });

        return Number(aliquotaCalc - baseRetidaTotal * issPorcentagemCorreta);
    }

    async getISSRetido(): Promise<number> {
        let tx_data = await buildTransactionResponse(this);
        let aliquotaEfetiva = tx_data.effective_tax_percentage;
        let aliquotaTabelaReparticao = tx_data.repartition_table_iss_percentage;
        let issPorcentagemCorreta = aliquotaEfetiva * aliquotaTabelaReparticao;
        let baseRetidaTotal = 0;
        let baseNaoRetidaTotal = 0;

        tx_data.comission_entries.map((elem) => {
            let issElementoPercent = elem.iss_value / elem.commission_value;

            if (issElementoPercent < issPorcentagemCorreta) {
                baseRetidaTotal += elem.iss_value / issPorcentagemCorreta;
                baseNaoRetidaTotal +=
                    elem.commission_value - elem.iss_value / issPorcentagemCorreta;
            } else {
                baseRetidaTotal += elem.commission_value;
            }
        });

        return Number(baseRetidaTotal * issPorcentagemCorreta);
    }

    async calcDASParts(): Promise<IDASParts[]> {
        const taxTableRepository = dbSource.getRepository(TaxTable);

        var return_holder = [];
        let tx_data = await buildTransactionResponse(this);
        let DASTotal = await this.calcDASTotal();
        let baseRetida = await this.getISSRetido();
        var taxTable = await taxTableRepository.findOne({
            where: { number_identifier: Equal(tx_data.tax_identifier) },
        });
        var repartitionTable = null;

        for (let i = 0; i < taxTable.rows.length; i++) {
            let elem = taxTable.rows[i];
            if (tx_data.rbt_12 <= elem.max_value && tx_data.rbt_12 > elem.min_value) {
                repartitionTable = taxTable.repartition_table[i];
                break;
            }
        }

        Object.keys(repartitionTable).forEach((key) => {
            if (key == "range") return;

            let percentage = repartitionTable[key] * tx_data.effective_tax_percentage;

            let codigoTributo = tributos[key];

            if (key == "ISS") {
                return_holder.push({
                    codigoTributo,
                    valor: Number(
                        (tx_data.comission_total * percentage - baseRetida).toFixed(2),
                    ),
                });
                return;
            }

            return_holder.push({
                codigoTributo,
                valor: Number((tx_data.comission_total * percentage).toFixed(2)),
            });
        });

        return return_holder;
    }

    getFormattedDate(): number {
        let data_concat = "";
        let elem_year = new Date(this.transaction_date).getFullYear();
        let elem_month = new Date(this.transaction_date).getMonth() + 1;

        if (elem_month < 10) {
            data_concat = elem_year.toString() + "0" + elem_month.toString();
        } else {
            data_concat = elem_year.toString() + elem_month.toString();
        }
        return Number(data_concat);
    }
}

interface ICommissionEntry {
    insurer_name: String;
    comission_value: number;
    iss_value: number;
}

interface IDASParts {
    codigoTributo: number;
    value: number;
}

const tributos = {
    IRPJ: 1001,
    CSLL: 1002,
    COFINS: 1004,
    PIS_PASEP: 1005,
    CPP: 1006,
    ICMS: 1007,
    IPI: 1008,
    ISS: 1010,
};

export { Transaction, ICommissionEntry };
