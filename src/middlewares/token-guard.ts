import { IncomingHttpHeaders } from "http";
import { Request, Response, NextFunction } from "express";

import { UserService } from "@/services/user-service";

const userService = new UserService();

function getTokenFromHeaders(headers: IncomingHttpHeaders) {
	const header = headers.authorization as string;

	if (!header) return header;

	return header.split(" ")[1];
}

export const tokenGuard =
	async () => (req: Request, res: Response, next: NextFunction) => {
		const token =
			getTokenFromHeaders(req.headers) ||
			req.query.token ||
			req.body.token ||
			"";

		try {
			userService.verifyToken(token);

			next();
		} catch (error) {
			return res.status(403).send({ message: "No access" });
		}
	};
