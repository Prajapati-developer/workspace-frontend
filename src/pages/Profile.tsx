import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserProfile } from "../store/slice/UserSlice";
import { useForm } from "react-hook-form";
import { IUser } from "../model/userModel";
import { useUpdateUserProfileMutation } from "../store/api/userApi";
import { errorToast, successToast } from "../common/utill/tostUtill";
import { ToastContainer } from "react-toastify";
import { useLazyGetEmployeeByIdQuery } from "../store/api/employeeApi";
import { getAuthDetails } from "../store/slice/AuthSlice";
import { ROLE } from "../common/constants";
import Loader from "../common/components/Loader";
import {
  CircularProgress,
  Container,
  Grid,
  TextField,
  Button,
  CardMedia,
  Card,
  CardContent,
  Typography,
  FormHelperText,
} from "@mui/material";

const Profile: React.FC = () => {
  const initialData: IUser = {
    name: "",
    email: "",
    password: "",
    dob: "",
    joiningDate: "",
    mobile: undefined,
    profilePicture: "",
    role: "",
    status: "",
  };

  const profileData = useSelector(getUserProfile);

  const [formData, setFormData] = useState({
    ...initialData,
    ...profileData,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({ defaultValues: formData });
  const [imageError, setImageError] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setImageError(false);
    setFormData({ ...formData, [name]: value });
  };
  const { userId } = useSelector(getAuthDetails);
  const [
    editEmployeeDetail,
    { isLoading: isUpdateQueryLoader, isError: isUpdateProfileError },
  ] = useUpdateUserProfileMutation();
  const [getUserProfileById, { data, isLoading, isError }] =
    useLazyGetEmployeeByIdQuery();

  useEffect(() => {
    if (userId) {
      getUserProfileById(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (data) {
      reset(data.employee);
      setFormData(data.employee);
    }
  }, [data]);

  useEffect(() => {
    if (isUpdateProfileError) {
      errorToast("Something went Wrong");
    }
  }, [isUpdateProfileError]);
  if (isError) {
    return <h1>Something went Wrong!!!!</h1>;
  }

  if (isLoading || !data) {
    return <Loader />;
  }

  const onSubmit = async (data: IUser) => {
    if (userId) {
      try {
        await editEmployeeDetail({ ...formData, ...data }).unwrap();
        successToast("Profile Updated SuccessFully!");
      } catch (error) {
        console.error("error", error);
        errorToast("Something Went Wrong !!!");
      }
    }
  };

  return (
    <>
      {(formData.role == ROLE.ADMIN || formData.role == ROLE.SUPER_ADMIN) && (
        <p className="text-center">
          Note :As of now for Admin and Super Admin email & password field is
          not editable as backend logic is not implemented
        </p>
      )}
      <Container sx={{ paddingTop: 10, paddingBottom: 20 }}>
        <Grid container spacing={2} justifyContent={"center"}>
          <Grid item lg={3} xs={12}>
            <Card sx={{ maxWidth: 350, marginRight: 5 }}>
              <CardMedia
                component="img"
                alt={formData.name}
                height="200"
                image={
                  formData.profilePicture
                    ? !imageError
                      ? formData.profilePicture
                      : "../../../src/assets/icon-user-default.png"
                    : "../../../src/assets/icon-user-default.png"
                }
                // src={formData.profilePicture}
                onError={() => setImageError(true)}
                // src={formData.profilePicture}
              />
              <CardContent>
                <Typography gutterBottom variant="subtitle2" component="div">
                  Role:{" "}
                  {formData.role === ROLE.SUPER_ADMIN
                    ? "Super Admin"
                    : formData.role === ROLE.ADMIN
                    ? "Admin"
                    : "Employee"}
                </Typography>
                <Typography gutterBottom variant="subtitle2" component="div">
                  Status:
                  {formData.status === "A" ? "Activated" : "Deactivated"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={9} md={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="h4"
                    align="center"
                    style={{ margin: "20px 0 40px" }}
                  >
                    Manage Your Profile
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    {...register("name", {
                      required: " Name is required",
                    })}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                    className="variant-1"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
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
                    disabled={
                      formData.role == ROLE.ADMIN ||
                      formData.role == ROLE.SUPER_ADMIN
                    }
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="email"
                    label="  Email"
                    {...register("email", {
                      required: "Email  is required",
                    })}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                    className="variant-1"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={
                      formData.role == ROLE.ADMIN ||
                      formData.role == ROLE.SUPER_ADMIN
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...register("mobile", {
                      required: "Phone Number is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Please enter a valid 10-digit Phone number",
                      },
                    })}
                    value={formData.mobile}
                    error={!!errors.mobile}
                    helperText={errors.mobile ? errors.mobile.message : ""}
                    className="variant-1"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    fullWidth
                    {...register("dob", {
                      required: "Date of Birth is required",
                    })}
                    error={!!errors.dob}
                    helperText={errors.dob ? errors.dob.message : ""}
                    className="variant-1"
                    value={
                      formData.dob
                        ? new Date(formData.dob).toISOString().split("T")[0]
                        : formData.dob
                    }
                    onChange={handleChange}
                  />
                  <FormHelperText>Date Of Birth </FormHelperText>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    fullWidth
                    label="Profile IMG Url"
                    {...register("dob", {
                      required: "Date of Birth is required",
                    })}
                    error={!!errors.profilePicture}
                    helperText={
                      errors.profilePicture ? errors.profilePicture.message : ""
                    }
                    className="variant-1"
                    {...register("profilePicture", {
                      required: "Profile Img URL is required",
                      pattern: {
                        value: /^(http|https):\/\/[^ "]+$/,
                        message: "Enter a valid URL",
                      },
                    })}
                    value={formData.profilePicture}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  {isUpdateQueryLoader ? (
                    <Button disabled>
                      Updating.....
                      <CircularProgress size={12} />
                    </Button>
                  ) : (
                    <Button type="submit" variant="contained" color="primary">
                      Update Profile
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>

        <ToastContainer></ToastContainer>
      </Container>
    </>
  );
};
export default Profile;
