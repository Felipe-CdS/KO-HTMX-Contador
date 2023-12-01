import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { User } from "./User";
import { v4 as uuid } from "uuid";

@Entity("month_expenses")
class MonthExpenses {

	@PrimaryColumn()
	@Exclude()
	readonly month_expenses_id: string;

	@JoinColumn({name: "fk_user_id"})
    @ManyToOne( () => User, {eager:true})
	fk_user_id: User;

	@Column()
	month: number;

    @Column()
    year: number;

	constructor(){
		if(!this.month_expenses_id)
			this.month_expenses_id = uuid();
	}
}

export { MonthExpenses }