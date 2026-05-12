export const userDto = (user) => {

  return {

    id: user._id,

    name: user.name,

    email: user.email,

    avatar: user.avatar,

    provider: user.provider,

    isVerified: user.isVerified,

    createdAt: user.createdAt,
  };
};
