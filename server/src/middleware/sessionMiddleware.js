import session from "express-session";

const sessionMiddleware = session({

  secret: process.env.JWT_SECRET,

  resave: false,

  saveUninitialized: false,
});

export default sessionMiddleware;