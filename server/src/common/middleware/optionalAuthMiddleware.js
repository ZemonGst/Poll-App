import jwt from "jsonwebtoken";

import User from "../../modules/auth/models/User.js";


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

    req.user = undefined;
  }

  next();
};

export default optionalAuth;
