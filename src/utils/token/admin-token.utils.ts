import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRATION = '1h';
export interface Token {
    id : string;
    expiresIn : string
}

export const verifyAdminToken = async (
    token: string
  ): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET as jwt.Secret, (err, payload) => {
        if (err) return reject(err);
  
        resolve(payload as Token);
      });
    });
  };
  