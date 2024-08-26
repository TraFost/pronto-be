import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User, UserAttributes, UserCreationAttributes } from "@/models/user";
import { Request } from "express";

const SALT_ROUNDS = 12;

export class UserService {
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
		const token = jwt.sign({ id, email: user.email }, this._jwtSecret, {
			expiresIn: "30d",
		});
		return { token };
	}

	verifyToken(token: string) {
		return jwt.verify(token, this._jwtSecret);
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
