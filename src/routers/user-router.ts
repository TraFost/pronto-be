import { Router } from "express";
import { matchedData, validationResult } from "express-validator";

import { userRules } from "../rules/user-rules";
import { UserService } from "../services/user-service";
import { UserAddModel } from "../models/user";

export const userRouter = Router();

const userService = new UserService();

userRouter.post("/register", userRules["forRegister"], (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) return res.status(422).json(errors.array());

	const payload = matchedData(req) as UserAddModel;
	const user = userService.register(payload);

	return user.then((u) => res.json(u));
});

userRouter.post("/login", userRules["forLogin"], (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) return res.status(422).json(errors.array());

	const payload = matchedData(req) as UserAddModel;
	const token = userService.login(payload);

	return token.then((t) => res.json(t));
});

userRouter.get("/me", (req: any, res) => {
	const user = userService.getUserById(req.user.id);

	return user.then((u) => res.json(u));
});

userRouter.get("/all", (_, res) => {
	const users = userService.getAllUsers();

	return users.then((u) => res.json(u));
});
