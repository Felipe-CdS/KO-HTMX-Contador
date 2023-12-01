import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const dbSource = new DataSource({
    type: "postgres",
    database: "railway",
    url: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL_ENV === 'production' ? { rejectUnauthorized: false } : false,
    entities: [User, process.env.ENTITIES_FOLDER as string],
    logging: false,
    synchronize: false,
})
