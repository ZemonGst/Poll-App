export const toLoginDTO = (formData) => ({
  email: formData.email,
  password: formData.password,
});

export const toRegisterDTO = (formData) => ({
  name: formData.name,
  email: formData.email,
  password: formData.password,
});
