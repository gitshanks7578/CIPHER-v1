import { session } from "../models/session.model";
import jwt from "jsonwebtoken"
import { apiError } from "../utils/apiError";
import { Request,Response,NextFunction } from "express";

export const verifyJWT = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const token = req?.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token) 
            throw new apiError(400,"token missing")
        // return res.status(200).json({message : `${token}`})
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const existingSession = await session.findById(decoded.sessionID)
        if(!existingSession || !existingSession.valid)
            throw new apiError(400,"session expired")

        req.USER = {
            userID : decoded.userID,
            sessionID : decoded.sessionID,
            role : decoded.role,
        }

        // return apiResponse(res,{},"verifyjwt success",200)
        next()
        
    } catch (err) {
        next(err)
    }
}