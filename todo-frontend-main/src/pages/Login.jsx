import { Button, FormControl, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import $axios from "../lib/axios.instance";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async (values) => {
    try {
      const response = await $axios.post("/user/login", values);

      localStorage.setItem("accessToken", response?.data?.accessToken);
      localStorage.setItem("firstName", response?.data?.user?.firstName);

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };
  return (
    <>
      {error && (
        <Typography variant="h6" sx={{ color: "red" }}>
          {error}
        </Typography>
      )}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address.")
            .required("Email is required."),
          password: Yup.string().required("Password is required."),
        })}
        onSubmit={async (values) => {
          await loginUser(values);
        }}
      >
        {({ getFieldProps, touched, errors, handleSubmit }) => (
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
            <Typography variant="h4">Sign in</Typography>
            <FormControl fullWidth>
              <TextField
                label="Email"
                variant="outlined"
                {...getFieldProps("email")}
              />

              {touched.email && errors.email ? <div>{errors.email}</div> : null}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Password"
                variant="outlined"
                {...getFieldProps("password")}
              />

              {touched.password && errors.password ? (
                <div>{errors.password}</div>
              ) : null}
            </FormControl>
            <Button type="submit" variant="contained" color="success" fullWidth>
              Login
            </Button>
            <Link to="/register">
              <Typography>New here? Register</Typography>
            </Link>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;
