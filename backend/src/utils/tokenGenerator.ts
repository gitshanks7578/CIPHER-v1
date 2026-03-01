import jwt from "jsonwebtoken";



export const generateRefreshToken = ( sessionID : object): string => {
  return jwt.sign(
    { sessionID },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" } // adjust as needed
  );
};


interface AccessTokenPayload {
  sessionID: string;
  userId: string;
}

export const generateAccessToken = ({ sessionID, userId }: AccessTokenPayload): string => {
  return jwt.sign(
    { sessionID, userId },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "7d" } // adjust expiration as needed
  );
};