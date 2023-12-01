import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { v4 as uuid } from "uuid";
import { Transaction } from "./Transaction";
import { Insurer } from "./Insurer";

@Entity("subtransactions")
class SubTransaction {

	@PrimaryColumn()
	@Exclude()
	readonly subtransaction_id: string;

	@JoinColumn({name: "fk_transaction_id"})
	@ManyToOne( () => Transaction, {eager:true})
	fk_transaction_id: Transaction;

	@JoinColumn({name: "fk_insurer_id"})
	@ManyToOne( () => Insurer, {eager:true})
	fk_insurer_id: Insurer;

	@Column()
	iss_value: number;

	@Column()
	comission_value: number;

	constructor(){
		if(!this.subtransaction_id)
			this.subtransaction_id = uuid();
	}
}

interface ISubTransaction {
	transaction_id: String;
	insurer_id: String;
	iss_value: number;
	comission_value: number;
}

export { SubTransaction, ISubTransaction }