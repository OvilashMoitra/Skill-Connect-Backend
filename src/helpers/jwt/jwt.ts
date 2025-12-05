import jwt from 'jsonwebtoken';


export type IJWTData = {
  _id: string;
  email: string;
  role: string
};

export type IJWTPayload = {
  data: IJWTData;
  iat: number;
  exp: number;
};






const generateJWTToken = async (
  payload: IJWTData,
  expiresIn: string,
  secretKey: string,
) => {
  const token = await jwt.sign(
    {
      data: payload,
    },
    secretKey,
    { expiresIn: expiresIn },
  );
  return token;
};

const decodeJWTToken = async (token: string, secret: string) => {
  return await jwt.verify(token, secret);
};

export const jwtHelperFunction = {
  generateJWTToken,
  decodeJWTToken,
};
