import express from "express"
import {register,loginEntry,verifyChallenge,logout} from "../controllers/auth.controller"
import { verifyJWT } from "../middlewares/verifyJWT"
const authrouter = express.Router()
authrouter.post("/register",register)
authrouter.post("/loginEntry",loginEntry)
authrouter.post("/verifyChallenge",verifyChallenge)
authrouter.post("/logout",verifyJWT,logout)

export default authrouter