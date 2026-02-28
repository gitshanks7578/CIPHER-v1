import { Request,Response,NextFunction } from "express"
import { apiError } from "../utils/apiError"
import { user } from "../models/user.model";

import crypto from "crypto";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken"
export const register = async(req:Request,res:Response,next:NextFunction) =>{
     try {
  
    
  } catch (error) {
    next(error instanceof apiError ? error : new apiError(500, "Internal server error"));
  }
}