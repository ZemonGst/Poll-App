import User from "../models/User.js";

import bcrypt from "bcryptjs";

import generateToken from "../../../common/utils/generateToken.js";

import BadRequestError from "../../../common/errors/BadRequestError.js";

import UnauthorizedError from "../../../common/errors/UnauthorizedError.js";

import { userDto } from "../dto/user.dto.js";

export const hashPassword = async (
  password
) => {

  const salt =
    await bcrypt.genSalt(10);

  return await bcrypt.hash(
    password,
    salt
  );
};

export const comparePassword = async (
    enteredPassword,
    hashedPassword
  ) => {

    return await bcrypt.compare(
      enteredPassword,
      hashedPassword
    );
  };

export const registerUserService = async ({
    name,
    email,
    password,
  }) => {

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      throw new BadRequestError(
        "User already exists"
      );
    }

    const hashedPassword =
      await hashPassword(password);

    const user = await User.create({

      name,

      email,

      password: hashedPassword,

      provider: "local",

      isVerified: false,
    });

    return userDto(user);
  };

export const loginUserService = async ({
    email,
    password,
  }) => {

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {

      throw new UnauthorizedError(
        "Invalid email or password"
      );
    }

    const isPasswordCorrect =
      await comparePassword(
        password,
        user.password
      );

    if (!isPasswordCorrect) {

      throw new UnauthorizedError(
        "Invalid email or password"
      );
    }

    const token = generateToken({
      id: user._id,
    });

    return {

      token,

      user: userDto(user),
    };
  };

export const getCurrentUserService = async (user) => {

    return userDto(user);
  };

export const findOrCreateGoogleUser = async (profile) => {

    let user = await User.findOne({

      email:
        profile.emails[0].value,
    });

    if (!user) {

      user = await User.create({

        name: profile.displayName,

        email:
          profile.emails[0].value,

        avatar:
          profile.photos[0].value,

        provider: "google",

        providerId: profile.id,

        isVerified: true,
      });
    }

    return user;
  };

export const createAuthResponse = (user) => {
  const token = generateToken({
    id: user._id,
  });

  return {
    token,
    user: userDto(user),
  };
};

export const logoutUserService = async () => {

    return null;
  };
