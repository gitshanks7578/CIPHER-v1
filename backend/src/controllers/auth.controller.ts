import { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/apiError";
import { user } from "../models/user.model";
import { session } from "../models/session.model";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { refreshToken } from "../models/refreshtoken.model";
// import jwt from "jsonwebtoken"
import { AuthRequest } from "../middlewares/verifyJWT";
import {
  generateRefreshToken,
  generateAccessToken,
} from "../utils/tokenGenerator";



//WORST BUG I FACED
const normalizePublicKey = (rawKey: string) => {
  const cleaned = rawKey.replace(/\\n/g, "\n").replace(/\r/g, "").trim();

  if (/-----BEGIN [^-]*PUBLIC KEY-----/.test(cleaned)) {
    return cleaned;
  }

  const derBody = cleaned.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const wrappedBody = derBody.match(/.{1,64}/g)?.join("\n") ?? derBody;

  return `-----BEGIN PUBLIC KEY-----\n${wrappedBody}\n-----END PUBLIC KEY-----`;
};


export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, publicKey } = req.body;

    if (!username || !email || !password || !publicKey) {
      throw new apiError(400, "Missing required fields");
    }

    // Check if user exists
    const existingUser = await user.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new apiError(400, "Username or email already exists");
    }

    // Create user
    const newUser = new user({
      username,
      email,
      password,
      publicKey,
      isActive: true,
    });

    await newUser.save();

    // Respond
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        publicKey: newUser.publicKey,
        pfpUrl: newUser.pfpUrl,
      },
    });
  } catch (error) {
    next(
      error instanceof apiError
        ? error
        : new apiError(500, "Internal server error"),
    );
  }
};

export const loginEntry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      throw new apiError(400, "Username and password required");

    const existinguser = await user.findOne({ username });
    if (!existinguser) throw new apiError(404, "User not found");

    const isMatch = await existinguser.comparePassword(password);
    if (!isMatch) throw new apiError(401, "Invalid password");

    const challenge = crypto.randomBytes(32).toString("hex");

    const tempSession = await session.create({
      userId: existinguser._id,
      challenge,
      createdAt: new Date(),
    });
    await tempSession.save();

    return res.status(200).json({ challenge });
  } catch (err) {
    if (err instanceof apiError) throw err;
    // console.error("Login challenge error:", err);
    throw new apiError(500, `Server error`);
  }
};

export const verifyChallenge = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { username, challenge, signature } = req.body;
    if (!username || !challenge || !signature)
      throw new apiError(
        400,
        "Username, challenge, and signature are required",
      );

    const existingUser = await user.findOne({ username });
    if (!existingUser) throw new apiError(404, "User not found");

    const tempSession = await session.findOne({
      userId: existingUser._id,
      challenge,
    });
    if (!tempSession) throw new apiError(400, "Challenge not found or expired");


let pubKeyObj: crypto.KeyObject;

// const pubKeyObj = crypto.createPublicKey(cleanPubKey);
try {
  pubKeyObj = crypto.createPublicKey(normalizePublicKey(existingUser.publicKey));
} catch {
  throw new apiError(400, "Stored public key is not a valid PEM key");
}

const isValid = crypto.verify(
  "sha256",
  Buffer.from(challenge),
  { key: pubKeyObj, padding: crypto.constants.RSA_PKCS1_PADDING },
  Buffer.from(signature, "hex")
);
    if (!isValid) throw new apiError(401, "Invalid signature");
 
    await session.findByIdAndDelete(tempSession._id);

    const newSession = await session.create({
      userId: existingUser._id,
      deviceInfo: req.headers["user-agent"],
      valid: true,
    });
    await newSession.save();

    //tokens
    const refreshtoken = generateRefreshToken({
      sessionID: newSession._id.toString(),
    });

    const accessToken = generateAccessToken({
      sessionID: newSession._id.toString(),
      userId: existingUser._id.toString(),
    });
    const refreshTokenExpiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7,
    ); // 7 days
    const newRefreshTokenDoc = await refreshToken.create({
      sessionId: newSession._id,
      tokenHash: refreshtoken,
      expiresAt: refreshTokenExpiresAt,
    });
    await newRefreshTokenDoc.save();


       res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({
      message: "Login successful",
      tokens: { accessToken, refreshtoken },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new apiError(500, "internal server error");
    }
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.USER?.sessionID)
      throw new apiError(401, "Unauthorized")

    const sessionID = req.USER.sessionID


    await session.findByIdAndUpdate(sessionID, { valid: false })

    
    await refreshToken.deleteMany({ sessionId: sessionID })

  
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    })

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    })

    res.status(200).json({ message: "Logout successful" })
  } catch (err) {
    next(err)
  }
}