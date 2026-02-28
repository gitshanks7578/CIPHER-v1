import express from "express"
import {register} from "../controllers/auth.controller"

const authrouter = express.Router()
authrouter.post("/register",register)

export default authrouter