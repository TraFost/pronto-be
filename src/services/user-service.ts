import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User, UserAttributes, UserCreationAttributes } from "../models/user";
import { Request } from "express";

const SALT_ROUNDS = 12;

export class UserService {
	// !! Commented out because im binding the methods when i pass them as a callback in the router.
	// constructor() {
	// 	// why do we need to bind these methods? because im using each of them as a callback.
	// 	// if i don't bind them, (this) reference will lose context. so i bind them to the instance of the class.
	// 	// so whenever any function uses this (reference), it will refer to the instance of the class.
	// 	this.register = this.register.bind(this);
	// 	this.login = this.login.bind(this);
	// 	this.verifyToken = this.verifyToken.bind(this);
	// 	this.getUserById = this.getUserById.bind(this);
	// 	this.getAllUsers = this.getAllUsers.bind(this);
	// }

	private readonly _saltRounds = SALT_ROUNDS;
	private readonly _jwtSecret = process.env.JWT_SECRET;

	static get userAttributes() {
		return ["id", "email"];
	}

	private static _user: User | null = null;

	static get user() {
		return UserService._user;
	}

	async register({ email, password }: UserCreationAttributes) {
		const hashedPassword = await bcrypt.hash(password, this._saltRounds);

		const user = await User.create({ email, password: hashedPassword });
		return user;
	}

	async login({ email }: Pick<UserAttributes, "email">) {
		const user = await User.findOne({ where: { email } });
		if (!user) throw new Error("User not found");
		const { id } = user;
		const token = jwt.sign({ id, email: user.email }, this._jwtSecret);
		return { token };
	}

	verifyToken(token: string): Promise<boolean> {
		return new Promise((resolve) => {
			jwt.verify(token, this._jwtSecret, async (err, decoded) => {
				if (err) {
					resolve(false);
					return;
				}

				const userId = decoded["id"];
				UserService._user = await User.findByPk(userId);
				resolve(!!UserService._user);
			});
		});
	}

	getUserById({ query, params, body }: Request) {
		const { id: userId } = query || params || body;

		return User.findByPk(userId, {
			attributes: UserService.userAttributes,
		}) as Promise<User | null>;
	}

	getAllUsers() {
		return User.findAll({
			attributes: UserService.userAttributes,
		}) as Promise<User[]>;
	}
}
