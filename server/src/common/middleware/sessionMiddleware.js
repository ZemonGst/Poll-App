import session from "express-session";

const sessionMiddleware = session({

  secret:
    process.env.JWT_SECRET,

  resave: false,

  saveUninitialized: true,

  cookie: {

    secure: false,

    maxAge:
      1000 * 60 * 60 * 24,
  },
});

export default sessionMiddleware;
