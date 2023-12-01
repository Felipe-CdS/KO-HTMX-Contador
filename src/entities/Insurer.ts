import { Entity, PrimaryColumn, Column } from "typeorm";
import { Exclude } from "class-transformer";
import { v4 as uuid } from "uuid";

@Entity("insurers")
class Insurer {

	@PrimaryColumn()
	@Exclude({ toPlainOnly: true })
	readonly insurer_id: string;

	@Column()
	insurer_name: string;

	constructor(){
		if(!this.insurer_id){
			this.insurer_id = uuid();
		}
	}
}

export { Insurer }