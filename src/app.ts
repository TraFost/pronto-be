import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { userRouter } from "@/routers/user-router";
import { tokenGuard } from "@/middlewares/token-guard";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", userRouter);

app.use(tokenGuard);

app.use("*", (_req, res) => {
	res.status(404).send("Not Found");
});

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
