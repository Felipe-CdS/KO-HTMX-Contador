import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("tax_tables")
class TaxTable {

	@PrimaryColumn()
	readonly table_id: string;

	@Column()
	number_identifier: Number;

	@Column()
	tax_name: string;

	@Column({type: 'jsonb' })
	rows: ITaxRow[];

	@Column({type: 'jsonb' })
	repartition_table: IRepartitionTable[];

	constructor(){
		if(!this.table_id){
			this.table_id = uuid();
		}
	}
}

interface ITaxRow {
	range: number,
	min_value: number,
	max_value: number,
	tax_percentage: number,
	discount_value: number
}

interface IRepartitionTable {
	range: number,
	IRPJ: number,
	CSLL: number,
	COFINS: number,
	PIS_PASEP: number,
	CPP: number,	
	ISS: number
}

interface ITaxTable {
	number_identifier: Number,
	tax_name: string,
	rows: ITaxRow[],
	repartition_table: IRepartitionTable[]
}

export { TaxTable, ITaxTable, ITaxRow, IRepartitionTable }