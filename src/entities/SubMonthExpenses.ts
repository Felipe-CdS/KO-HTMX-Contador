import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { v4 as uuid } from "uuid";
import { MonthExpenses } from "./MonthExpenses";

@Entity("sub_month_expenses")
class SubMonthExpenses {

	@PrimaryColumn()
	readonly sub_expense_id: string;

	@JoinColumn({name: "fk_month_expense_id"})
    @ManyToOne( () => MonthExpenses, {eager:true})
	fk_month_expense_id:MonthExpenses;

	@Column()
	quantity: number;

    @Column()
	unit_value: number;

    @Column()
    description: string;

    @Column()
    created_at: Date;

	constructor(){
		if(!this.sub_expense_id)
			this.sub_expense_id = uuid();
	}
}

interface ISubMonthExpenses {
    quantity: number,
	unit_value: number,
    description: string,
    created_at: Date
}

export { SubMonthExpenses, ISubMonthExpenses }