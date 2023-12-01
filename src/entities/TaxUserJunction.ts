import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid} from "uuid";
import { TaxTable } from "./TaxTable";
import { User } from "./User";

@Entity("users_tax_junction")
class TaxUserJunction {

	@PrimaryColumn()
	readonly junction_id: string;

	@JoinColumn({name: "fk_user_id"})
    @ManyToOne( () => User, {eager:true})
	fk_user_id: User;

	@JoinColumn({name: "fk_table_id"})
    @ManyToOne( () => TaxTable, {eager:true})
	fk_table_id: TaxTable;

	constructor(){
		if(!this.junction_id){
			this.junction_id = uuid();
		}
	}
}

export { TaxUserJunction };