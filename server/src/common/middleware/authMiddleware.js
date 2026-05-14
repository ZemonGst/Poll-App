import jwt from "jsonwebtoken";

import User from "../../modules/auth/models/User.js";

import UnauthorizedError from "../errors/UnauthorizedError.js";

import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(

  async (req, res, next) => {

    let token;

    const authHeader =
      req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {

      token = authHeader.split(" ")[1];
    }

    if (!token) {

      throw new UnauthorizedError(
        "Not authorized"
      );
    }

    let decoded;

    try {

      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    } catch (error) {

      throw new UnauthorizedError(
        "Not authorized"
      );
    }

    const user = await User.findById(
      decoded.id
    );

    if (!user) {

      throw new UnauthorizedError(
        "User not found"
      );
    }

    req.user = user;

    next();
  }
);
