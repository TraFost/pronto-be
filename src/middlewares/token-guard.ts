import { IncomingHttpHeaders } from "http";
import { Request, Response, NextFunction } from "express";

import { UserService } from "@/services/user-service";

const userService = new UserService();

function getTokenFromHeaders(headers: IncomingHttpHeaders) {
	// const header = headers.authorization as string;
	// console.log(header, "heador");
	// if (!headers) return res.status(403).send({ message: "No access" });
	// return header.split(" ")[1];
}

export async function tokenGuard(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.headers.authorization.split(" ")[1];

	if (!token) {
		return res.status(403).send({ message: "No access" });
	}

	userService.verifyToken(token);
	next();
}

// export const tokenGuard = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	const token =
// 		getTokenFromHeaders(req.headers) || req.query.token || req.body.token || "";

// 	const verifyToken = userService.verifyToken(token);

// 	console.log(verifyToken, "ok`");

// 	if (verifyToken === null) {
// 		return res.status(403).send({ message: "No access" });
// 	}

// 	next();
// };
