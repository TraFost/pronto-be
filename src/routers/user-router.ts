import { Router, Request, Response } from "express";
import { userRules } from "@/rules/user-rules";
import { UserService } from "@/services/user-service";
import { processRequest } from "@/utils/validation-handler";
import { ENDPOINTS } from "@/constants/endpoints";

interface RequestWithUser extends Request {
	id: number;
}

const userService = new UserService();

export const userRouter = Router();

userRouter.post(
	ENDPOINTS.REGISTER,
	userRules.forRegister,
	async (req: Request, res: Response) =>
		await processRequest(req, res, userService.register.bind(userService))
);

userRouter.post(
	ENDPOINTS.LOGIN,
	userRules.forLogin,
	async (req: Request, res: Response) =>
		await processRequest(req, res, userService.login.bind(userService))
);

userRouter.get(
	ENDPOINTS.ME,
	async (req: RequestWithUser, res: Response) =>
		await processRequest(req, res, () => userService.getUserById(req))
);

userRouter.get(
	ENDPOINTS.ALL,
	async (_, res: Response) =>
		await processRequest(_, res, userService.getAllUsers.bind(userService))
);
