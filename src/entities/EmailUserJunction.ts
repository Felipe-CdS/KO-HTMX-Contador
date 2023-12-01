import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid} from "uuid";
import { User } from "./User";

@Entity("user_emails")
class EmailUserJunction {

	@PrimaryColumn()
	readonly email_id: string;

    @Column()
    email: string;

	@JoinColumn({name: "fk_user_id"})
    @ManyToOne( () => User, {eager:true})
	fk_user_id: User;

	constructor(){
		if(!this.email_id){
			this.email_id = uuid();
		}
	}
}

export { EmailUserJunction };