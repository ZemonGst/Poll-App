import jwt from "jsonwebtoken";

import User from "../../modules/auth/models/User.js";

/**
 * Optional Authentication Middleware
 *
 * If a valid Bearer token is present, attaches req.user.
 * If no token or invalid token, continues without req.user.
 * This allows routes to support both authenticated and anonymous access.
 */
const optionalAuth = async (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(
        decoded.id
      );

      if (user) {

        req.user = user;
      }
    }

  } catch (error) {

    // Token invalid or expired — continue as anonymous
    req.user = undefined;
  }

  next();
};

export default optionalAuth;
