import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";

export const handleValidationErrors = (req: Request, res: Response) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
};

export const processRequest = async <T>(
	req: Request,
	res: Response,
	action: (payload: T) => Promise<any>
) => {
	if (handleValidationErrors(req, res)) return;

	const payload = matchedData(req) as T;

	try {
		const result = await action(payload);

		return res.json(result);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
