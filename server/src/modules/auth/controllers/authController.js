import asyncHandler from "../../../common/utils/asyncHandler.js";
import ApiResponse from "../../../common/responses/ApiResponse.js";

import {
  registerUserService,
  loginUserService,
  getCurrentUserService,
  createAuthResponse,
  logoutUserService
} from "../services/authService.js";
import generateToken from "../../../common/utils/generateToken.js";

export const registerLocalUser = asyncHandler(async (req, res) => {
  const user = await registerUserService(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      user
    )
  );
});

export const loginLocalUser = asyncHandler(async (req, res) => {
  const authData = await loginUserService(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Login successful",
      authData
    )
  );
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.user);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Current user fetched successfully",
      user
    )
  );
});

export const googleAuthSuccess = (req, res) => {
  const token = generateToken({ id: req.user._id });
  res.redirect('http://localhost:5173/auth/callback?token=' + token);
};

export const logoutUser =  asyncHandler(async (req, res) => { await logoutUserService();
   return res.status(200).json(

      new ApiResponse(
        200,
        "Logout successful",
        null
      )
    );
  });
