import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = process.env.DB_NAME;
const username = process.env.DB_USER;
const port = process.env.DB_PORT;

export const sequelize = new Sequelize(db, username, "", {
	dialect: "mysql",
	port: parseInt(port),
});

sequelize.authenticate();
