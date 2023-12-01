import { Entity, PrimaryColumn, Column, BeforeInsert, UpdateDateColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Exclude, instanceToPlain } from "class-transformer";
import { v4 as uuid } from "uuid";
import { User } from "./User";
import { Transaction } from "./Transaction";

@Entity("generated_das")
class GeneratedDAS {

	@PrimaryColumn()
	readonly das_id: string;

	@Column()
	das_number: string;

    @Column()
	das_month: number;

	@Column()
	das_year: number;

    @Column({type: 'jsonb' })
    das_response: IGeneratedDASResponse;

	@JoinColumn({name: "fk_from_user"})
	@OneToOne( () => User, {eager:true})
	fk_from_user: User;

    @JoinColumn({name: "fk_from_transaction"})
	@OneToOne( () => Transaction, {eager:true})
	fk_from_transaction: Transaction;

    @CreateDateColumn()
    created_at: Date;

	toJSON() {
		return instanceToPlain(this);
	}

	constructor(){
		if(!this.das_id){
			this.das_id = uuid();
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

interface IGeneratedDASResponse {

}

export { GeneratedDAS }
