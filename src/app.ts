import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { userRouter } from "./routers/user-router";
import { tokenGuard } from "./middlewares/token-guard";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", userRouter);

// Unprotected Get
app.get("/some-resource", (req, res, next) => {
	res.json("Hello World");
});

app.use(tokenGuard());

// Protected Get
app.get("/some-protected-resource", (req, res, next) => {
	res.json("Protected Hello World");
});

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
