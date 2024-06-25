import { useForm } from "react-hook-form";
import { useSignInMutation } from "../store/api/authApi";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../store/slice/UserSlice";

import { errorToast, successToast } from "../common/utill/tostUtill";
import { ILogin } from "../model/loginModel";
import { setWorkSpaceData } from "../store/slice/WorkspaceSlice";
import { ROLE } from "../common/constants";
import {
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading, isError }] = useSignInMutation();

  const dispatch = useDispatch();
  useEffect(() => {
    if (isError) {
      errorToast("Something went wrong!!!");
    }
  }, [isError]);

  const onSubmit = async (data: ILogin) => {
    const response = await login(data).unwrap();

    dispatch(setUserProfile(response));
    if (response?.workspace?.id && response?.role === ROLE.ADMIN) {
      dispatch(setWorkSpaceData(response.workspace));
    }

    successToast(response.message, {
      onClose: () => {
        navigate("/dashboard");
      },
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  return (
    <div className="login-page">
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" style={{ margin: "20px 0" }}>
          Sign In
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Username or Email"
                {...register("email", {
                  required: "Email or Name is required",
                })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                className="variant-1"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                className="variant-1"
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              {isLoading ? (
                <Button disabled>
                  Checking Credentials..
                  <CircularProgress size={12} />
                </Button>
              ) : (
                <Button type="submit" variant="contained" color="primary">
                  Login
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        <ToastContainer />
      </Container>
    </div>
  );
};
export default Login;
