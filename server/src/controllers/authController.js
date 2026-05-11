import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../responses/ApiResponse.js";

import {
  registerUserService,
  loginUserService,
  getCurrentUserService,
  createAuthResponse,
  logoutUserService
} from "../services/authService.js";

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

export const googleAuthSuccess = asyncHandler(async (req, res) => {
  const authData = createAuthResponse(req.user);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Google login successful",
      authData
    )
  );
});

export const logoutUser =  asyncHandler(async (req, res) => { await logoutUserService();
   return res.status(200).json(

      new ApiResponse(
        200,
        "Logout successful",
        null
      )
    );
  });
 