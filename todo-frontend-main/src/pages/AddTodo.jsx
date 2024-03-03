import { Button, FormControl, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Formik } from "formik";
import React from "react";
import { useMutation } from "react-query";
import * as Yup from "yup";
import $axios from "../lib/axios.instance";
import { useNavigate } from "react-router-dom";

const AddTodo = () => {
  const navigate = useNavigate();

  const { isLoading, isError, error, data, mutate } = useMutation({
    mutationKey: ["add-todo"],
    mutationFn: async (values) => {
      return await $axios.post("/todo/add", values);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  console.log({ data, isLoading, isError });

  // TODO: dayjs library
  const currentDate = dayjs().startOf("day");
  return (
    <Formik
      initialValues={{ title: "", description: "", date: "" }}
      validationSchema={Yup.object({
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
      })}
      onSubmit={(values) => {
        mutate(values);
      }}
    >
      {({ getFieldProps, handleSubmit, errors, touched, setFieldValue }) => (
        <form
          onSubmit={handleSubmit}
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
            padding: "2rem",
            minWidth: "25vw",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h4">Add Todo</Typography>
          <FormControl fullWidth>
            <TextField
              label="Title"
              variant="outlined"
              {...getFieldProps("title")}
            />

            {touched.title && errors.title ? <div>{errors.title}</div> : null}
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Description"
              variant="outlined"
              {...getFieldProps("description")}
            />

            {touched.description && errors.description ? (
              <div>{errors.description}</div>
            ) : null}
          </FormControl>

          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                onChange={(value) => {
                  const dateValue = dayjs(value).format("YYYY-MM-DD");
                  setFieldValue("date", dateValue);
                }}
              />
            </LocalizationProvider>

            {touched.date && errors.date ? <div>{errors.date}</div> : null}
          </FormControl>

          <Button type="submit" color="success" variant="contained" fullWidth>
            Add todo
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default AddTodo;
