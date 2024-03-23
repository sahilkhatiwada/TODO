import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Formik } from "formik";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import CustomSnackbar from "../components/CustomSnackbar";
import $axios from "../lib/axios.instance";

const Register = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const registerUser = async (values) => {
    try {
      const data = await $axios.post("/user/register", values);

      navigate("/login");
      setOpen(true);
      setMessage(response?.data?.message);
      setSeverity("success");
    } catch (error) {
      setOpen(true);
      setMessage(error.response.data.message);
      setSeverity("error");
    }
  };
  return (
    <>
      <CustomSnackbar
        open={open}
        setOpen={setOpen}
        message={message}
        severity={severity}
      />
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          gender: "female",
        }}
        validationSchema={Yup.object({
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
          gender: Yup.string()
            .trim()
            .oneOf(["male", "female", "preferNotToSay"]),
        })}
        onSubmit={async (values) => {
          await registerUser(values);
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, setFieldValue }) => (
          <form
            onSubmit={handleSubmit}
            style={{
              boxShadow:
                " rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
              width: "500px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <Typography variant="h4">Sign Up</Typography>
            <FormControl>
              <TextField
                label="First name"
                variant="outlined"
                {...getFieldProps("firstName")}
              />

              {touched.firstName && errors.firstName ? (
                <div>{errors.firstName}</div>
              ) : null}
            </FormControl>

            <FormControl>
              <TextField
                label="Last name"
                variant="outlined"
                {...getFieldProps("lastName")}
              />

              {touched.lastName && errors.lastName ? (
                <div>{errors.lastName}</div>
              ) : null}
            </FormControl>

            <FormControl>
              <TextField
                label="Email"
                variant="outlined"
                {...getFieldProps("email")}
              />

              {touched.email && errors.email ? <div>{errors.email}</div> : null}
            </FormControl>

            <FormControl variant="outlined">
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                {...getFieldProps("password")}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />

              {touched.password && errors.password ? (
                <div>{errors.password}</div>
              ) : null}
            </FormControl>

            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  onChange={() => {
                    setFieldValue("gender", "female");
                  }}
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                  onChange={() => {
                    setFieldValue("gender", "male");
                  }}
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Prefer Not To Say"
                  onChange={() => {
                    setFieldValue("gender", "preferNotToSay");
                  }}
                />
              </RadioGroup>
            </FormControl>

            <Button type="submit" color="success" variant="contained">
              Submit
            </Button>
            <Link to="/login">
              <Typography>Already registered? Login</Typography>
            </Link>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Register;
