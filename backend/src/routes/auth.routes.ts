import express from "express"
import {register,loginEntry,verifyChallenge} from "../controllers/auth.controller"

const authrouter = express.Router()
authrouter.post("/register",register)
authrouter.post("/loginEntry",loginEntry)
authrouter.post("/verifyChallenge",verifyChallenge)

export default authrouter