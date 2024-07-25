import { Router, Request, Response } from "express";

import { userRules } from "../rules/user-rules";
import { UserService } from "../services/user-service";
import { processRequest } from "../utils/validation-handler";
import { ENDPOINTS } from "../constants/endpoints";

interface RequestWithUser extends Request {
	id: number;
}

export const userRouter = Router();

const { getAllUsers, getUserById, login, register } = new UserService();

userRouter.post(
	ENDPOINTS.REGISTER,
	userRules.forRegister,
	async (req: Request, res: Response) =>
		await processRequest(req, res, register)
);

userRouter.post(
	ENDPOINTS.LOGIN,
	userRules.forLogin,
	async (req: Request, res: Response) => {
		await processRequest(req, res, login);
	}
);

userRouter.get(
	ENDPOINTS.ME,
	async (req: RequestWithUser, res: Response) =>
		await processRequest(req, res, () => getUserById(req))
);

userRouter.get(
	ENDPOINTS.ALL,
	async (_, res: Response) => await processRequest(_, res, getAllUsers)
);
