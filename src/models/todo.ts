import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/instances/sequelize";

export class Todo extends Model {
	public id!: number;
	public title!: string;
	public description!: string;
	public completed!: boolean;
	public tag!: string;
	public priority: "low" | "medium" | "high" = "low";
	public dueDate!: Date;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Todo.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		completed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		tag: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		priority: {
			type: DataTypes.ENUM("low", "medium", "high"),
			defaultValue: "medium",
		},
		dueDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: "todos",
	}
);
