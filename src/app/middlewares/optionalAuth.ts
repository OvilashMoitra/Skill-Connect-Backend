import { NextFunction, Request, Response } from 'express';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { jwtHelpers } from '../../helpers/jwtHelpers';

const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      try {
        const verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
        req.user = verifiedUser;
      } catch (error) {
        // Token is invalid, continue without user
        req.user = undefined;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

export default optionalAuth;

