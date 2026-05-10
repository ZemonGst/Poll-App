import User from "../models/User.js";

import { hashPassword, comparePassword} from "../services/authService.js";

import asyncHandler from "../utils/asyncHandler.js";

import BadRequestError from "../errors/BadRequestError.js";
import ApiResponse from "../responses/ApiResponse.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";


import generateToken from "../utils/generateToken.js";






export const registerLocalUser = asyncHandler(
  async (req, res) => {

    const { name, email, password } = req.body;





    const existingUser = await User.findOne({ email });





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





    return res.status(201).json(

      new ApiResponse(
        201,

        "User registered successfully",

        {
          id: user._id,

          name: user.name,

          email: user.email,
        }
      )
    );
  }
);

export const loginLocalUser = asyncHandler(
  async (req, res) => {

    const { email, password } = req.body;





    const user = await User.findOne({ email })
      .select("+password");





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





    return res.status(200).json(

      new ApiResponse(
        200,

        "Login successful",

        {
          token,

          user: {
            id: user._id,

            name: user.name,

            email: user.email,
          },
        }
      )
    );
  }
);