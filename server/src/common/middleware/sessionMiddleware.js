import session from "express-session";

const sessionMiddleware = session({

  secret:
    process.env.JWT_SECRET,

  resave: false,

  saveUninitialized: true,

  cookie: {

    secure: process.env.NODE_ENV === "production",

    maxAge:
      1000 * 60 * 60 * 24,
  },
});

export default sessionMiddleware;
