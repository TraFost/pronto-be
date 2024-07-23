import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User, UserAttributes, UserCreationAttributes } from "../models/user";

export class UserService {
	private readonly _saltRounds = 12;
	private readonly _jwtSecret = "0.rfyj3n9nzh";

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

	getUserById(id: number) {
		return User.findByPk(id, {
			attributes: UserService.userAttributes,
		}) as Promise<User>;
	}

	getAllUsers() {
		return User.findAll({
			attributes: UserService.userAttributes,
		}) as Promise<User[]>;
	}
}
