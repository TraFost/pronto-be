import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../instances/sequelize";

export interface UserAttributes {
	id: number;
	email: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UserAddModel {
	email: string;
	password: string;
}

export interface UserCreationAttributes
	extends Optional<UserAttributes, "id"> {}

export class User
	extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes
{
	public id!: number;
	public email!: string;
	public password!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		password: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
	},
	{
		tableName: "users",
		sequelize,
	}
);
