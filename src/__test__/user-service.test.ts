import bcrypt from "bcrypt";

import { UserService } from "@/services/user-service";
import { User } from "@/models/user";

jest.mock("@/models/user", () => ({
	User: {
		create: jest.fn(),
		findOne: jest.fn(),
		findAll: jest.fn(),
		findByPk: jest.fn(),
	},
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("UserService", () => {
	let userService: UserService;

	beforeEach(() => {
		userService = new UserService();
	});

	describe("register", () => {
		it("should hash the password and create a user", async () => {
			const email = "test@example.com";
			const password = "password123";
			const hashedPassword = "hashedpassword123";

			// Mock bcrypt.hash to return a hashed password
			(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

			// Mock User.create to return the created user
			const createdUser = { id: 1, email, password: hashedPassword };
			(User.create as jest.Mock).mockResolvedValue(createdUser);

			const result = await userService.register({ email, password });

			// Check that bcrypt.hash was called with the correct arguments
			expect(bcrypt.hash).toHaveBeenCalledWith(
				password,
				userService["_saltRounds"]
			);

			// Check that User.create was called with the correct arguments
			expect(User.create).toHaveBeenCalledWith({
				email,
				password: hashedPassword,
			});

			// Check that the result is the created user
			expect(result).toEqual(createdUser);
		});

		it("should throw an error if User.create fails", async () => {
			const email = "test@example.com";
			const password = "password123";

			// Mock bcrypt.hash to return a hashed password
			(bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword123");

			// Mock User.create to throw an error
			(User.create as jest.Mock).mockRejectedValue(new Error("Create failed"));

			await expect(userService.register({ email, password })).rejects.toThrow(
				"Create failed"
			);
		});
	});

	// describe("login", () => {
	// 	it("should return a token if the email and password are correct", async () => {
	// 		const email = "test@example.com";
	// 		const password = "password123";
	// 		const hashedPassword = "hashedpassword123";
	// 		const user = { id: 1, email, password: hashedPassword };

	// 		// Mock User.findOne to return the user
	// 		(User.findOne as jest.Mock).mockResolvedValue(user);

	// 		// Mock bcrypt.compare to return true
	// 		(bcrypt.compare as jest.Mock).mockResolvedValue(true);

	// 		// Mock jwt.sign to return a token
	// 		(jwt.sign as jest.Mock).mockReturnValue("token123");

	// 		const result = await userService.login({ email });

	// 		expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
	// 		expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
	// 		expect(jwt.sign).toHaveBeenCalledWith(
	// 			{ id: user.id, email: user.email },
	// 			userService["_jwtSecret"],
	// 			{ expiresIn: "1h" }
	// 		);
	// 		expect(result).toEqual({ token: "token123" });
	// 	});

	// 	it("should throw an error if the user is not found", async () => {
	// 		const email = "test@example.com";
	// 		const password = "password123";

	// 		(User.findOne as jest.Mock).mockResolvedValue(null);

	// 		await expect(userService.login({ email })).rejects.toThrow(
	// 			"User not found"
	// 		);
	// 	});

	// 	it("should throw an error if the password is incorrect", async () => {
	// 		const email = "test@example.com";
	// 		const password = "password123";
	// 		const hashedPassword = "hashedpassword123";
	// 		const user = { id: 1, email, password: hashedPassword };

	// 		(User.findOne as jest.Mock).mockResolvedValue(user);
	// 		(bcrypt.compare as jest.Mock).mockResolvedValue(false);

	// 		await expect(userService.login({ email })).rejects.toThrow(
	// 			"Invalid password"
	// 		);
	// 	});
	// });

	// describe("getUserById", () => {
	// 	it("should return a user if found", async () => {
	// 		const id = 1;
	// 		const user = { id, email: "user@example.com", password: "password" };
	// 		(User.findByPk as jest.Mock).mockResolvedValue(user);

	// 		const result = await userService.getUserById({ query: { id } } as any);

	// 		expect(User.findByPk).toHaveBeenCalledWith(id);
	// 		expect(result).toEqual(user);
	// 	});

	// 	it("should throw an error if the user is not found", async () => {
	// 		const id = 1;

	// 		(User.findByPk as jest.Mock).mockResolvedValue(null);

	// 		await expect(
	// 			userService.getUserById({ query: { id } } as any)
	// 		).rejects.toThrow("User not found");
	// 	});
	// });

	describe("getAllUsers", () => {
		it("should return all users", async () => {
			const users = [
				{ id: 1, email: "user1@example.com", password: "password1" },
			];
			(User.findAll as jest.Mock).mockResolvedValue(users);

			const result = await userService.getAllUsers();

			expect(User.findAll).toHaveBeenCalled();
			expect(result).toEqual(users);
		});
	});
});
