import { Entity, PrimaryColumn, Column, BeforeInsert, UpdateDateColumn } from "typeorm";
import { Exclude, instanceToPlain } from "class-transformer";
import { v4 as uuid } from "uuid";
import { hash, compare } from "bcryptjs";

@Entity("users")
class User {

    @PrimaryColumn("varchar")
    @Exclude({ toPlainOnly: true })
    readonly user_id: string;

    @Column("varchar")
    username: string;

    @Column("varchar")
    cnpj_number: string;

    @Column("varchar")
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column("varchar")
    email: string;

    @Column("boolean")
    @Exclude({ toPlainOnly: true })
    admin: boolean;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ type: 'jsonb' })
    api_data: IAPI_data;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 12);
    }

    static async comparePassword(candidatePassword: string, hashedPassword: string) {
        return await compare(candidatePassword, hashedPassword);
    }

    toJSON() {
        return instanceToPlain(this);
    }

    constructor() {
        if (!this.user_id) {
            this.user_id = uuid();
        }
    }
}

interface IUser {
    username: string;
    cnpj_number: string;
    email: string;
    admin?: boolean;
    tax_types: number[];
}

interface IAPI_data {
    ni: String;
    tipoEstabelecimento: String;
    nomeEmpresarial: String;
    nomeFantasia: String;
    situacaoCadastral: {
        codigo: String;
        data: String;
        motivo: String
    },
    naturezaJuridica: {
        codigo: String;
        descricao: String
    },
    dataAbertura: String;
    cnaePrincipal: {
        codigo: String;
        descricao: String
    },
    cnaeSecundarias: [
        {
            codigo: String;
            descricao: String
        }
    ],
    endereco: {
        tipoLogradouro: String;
        logradouro: String;
        numero: String;
        complemento: String;
        cep: String;
        bairro: String;
        municipio: {
            codigo: String;
            descricao: String
        },
        uf: String;
        pais: {
            codigo: String;
            descricao: String
        }
    },
    municipioJurisdicao: {
        codigo: String;
        descricao: String
    },
    telefones: [
        {
            ddd: String;
            numero: String
        }
    ],
    correioEletronico: String;
    capitalSocial: String;
    porte: String;
    situacaoEspecial: String;
    dataSituacaoEspecial: String
}

export { User, IUser }
