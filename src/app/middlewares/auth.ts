import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';



const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      // Handle both "Bearer <token>" and plain token formats
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser; // role  , userid

      // role diye guard korar jnno
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role.toLowerCase())) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
