import express from "express"
import cookieParser from "cookie-parser"
import authrouter from "./routes/auth.routes.js"
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/auth",authrouter)

export default app;