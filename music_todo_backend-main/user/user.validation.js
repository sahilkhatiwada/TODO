import * as Yup from "yup";

export const registerUserValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required.")
    .trim()
    .max(55, "First name must be at most 55 characters."),
  lastName: Yup.string()
    .required("Last name is required.")
    .trim()
    .max(55, "Last name must be at most 55 characters."),
  email: Yup.string()
    .email()
    .required("Email is required.")
    .trim()
    .max(60, "Email must be at most 60 characters.")
    .lowercase(),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters.")
    .max(16, "Password must be at max 16 characters.")
    .required(),
  gender: Yup.string().trim().oneOf(["male", "female", "preferNotToSay"]),
});

export const emailValidationSchema = Yup.string()
  .email("Must be a valid email.")
  .required()
  .trim()
  .lowercase();
