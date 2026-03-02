import { session } from "../models/session.model";
import jwt from "jsonwebtoken"
import { apiError } from "../utils/apiError";
import { Request,Response,NextFunction } from "express";

interface JwtPayload {
  userID: string
  sessionID: string
}
export interface AuthRequest extends Request {
  USER?: JwtPayload
}


export const verifyJWT = async (req: AuthRequest,res: Response,next: NextFunction): Promise<void> => {
  try {
    const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) throw new apiError(400, "token missing")

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload

    const existingSession = await session.findById(decoded.sessionID)

    if (!existingSession || !existingSession.valid)
      throw new apiError(400, "session expired")

    req.USER = {
      userID: decoded.userID,
      sessionID: decoded.sessionID
    }

    next()
  } catch (err) {
    next(err)
  }
}