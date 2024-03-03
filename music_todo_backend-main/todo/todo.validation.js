import * as Yup from "yup";
import dayjs from "dayjs";

const currentDate = dayjs();

export const todoValidationSchema = Yup.object({
  title: Yup.string()
    .max(20, "Title must be at max 20 characters.")
    .trim()
    .required("Title is required."),

  description: Yup.string()
    .required("Description is required.")
    .trim()
    .max(55, "Description must be at most 55 characters."),

  date: Yup.date()
    .min(currentDate, "Date cannot be past dates.")
    .required("Date is required."),
});

export const getTodoListValidationSchema = Yup.object({
  page: Yup.number("Page must be a number.") // todo
    .min(1, "Page must at least 1.")
    .integer("Page must be a integer value.")
    .default(1),

  limit: Yup.number()
    .min(1, "Limit must at least 1.")
    .integer("Limit must be a integer value.")
    .default(1),
});
