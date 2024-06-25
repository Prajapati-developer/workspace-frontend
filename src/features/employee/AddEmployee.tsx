import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUpdateUserProfileMutation } from "../../store/api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddEmployeeMutation,
  useLazyGetEmployeeByIdQuery,
} from "../../store/api/employeeApi";
import { Form, Spinner } from "react-bootstrap";
import DepartmentSelectDropdown from "./DepartmentSelectDropdown";
import { errorToast, successToast } from "../../common/utill/tostUtill";
import { IUser } from "../../model/userModel";
import ErrorText from "../../common/components/ErrorText";
import { ToastContainer } from "react-toastify";
import { getAuthDetails } from "../../store/slice/AuthSlice";
import { ROLE } from "../../common/constants";
import Loader from "../../common/components/Loader";
import {
  Card,
  CardMedia,
  CircularProgress,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
  Typography,
  Button,
  FormHelperText,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const AddEmployee = () => {
  const initialData: IUser = {
    name: "",
    email: "",
    password: "",
    dob: "",
    department: 0,
    joiningDate: "",
    mobile: undefined,
    profilePicture: "",
    role: "",
    status: "",
    company: 0,
  };

  const { id } = useParams();
  const [imageError, setImageError] = useState(false);
  const [getEmployeeDetail, { data, isLoading: isEmployeeDetailLoading }] =
    useLazyGetEmployeeByIdQuery();

  const [formData, setFormData] = useState(initialData);
  const { workspaceId } = useSelector(getAuthDetails);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({ defaultValues: formData });
  useEffect(() => {
    if (data) {
      reset(data.employee);
      setFormData(data.employee);
    }
  }, [data]);

  useEffect(() => {
    if (id) {
      getEmployeeDetail(id);
    } else {
      setFormData(initialData);
    }
  }, [id]);

  const handleChange = (
    e: any
    // | React.ChangeEvent<HTMLInputElement>
    // | React.ChangeEvent<HTMLSelectElement>
    // | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name == "status") {
      value = e.target.checked ? "A" : "D";
    }
    if (name == "department" && value == "") {
      setFormData({ ...formData, department: 0 });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };
  const [
    editEmployeeDetail,
    { isLoading: isUpdateQueryLoader, isError: updateQueryError },
  ] = useUpdateUserProfileMutation();
  const [addEmployee, { isLoading: isAddQueryLoader, isError: addQueryError }] =
    useAddEmployeeMutation();
  const navigate = useNavigate();
  if (isEmployeeDetailLoading) {
    return <Loader />;
  }
  if (updateQueryError || addQueryError) {
    return <h1>Something Went Wrong !!</h1>;
  }

  const onSubmit = async (data: IUser) => {
    data = {
      ...data,
      company: workspaceId,
      role: formData.role || ROLE.EMPLOYEE,
    };

    if (id) {
      try {
        await editEmployeeDetail({ ...formData, ...data }).unwrap();
        successToast("Employee Profile Updated Successfully!", {
          onClose: () => {
            navigate(`/workspace/${workspaceId}/employees`);
          },
        });
      } catch (error) {
        console.error("error", error);
        errorToast("Something Went Wrong !!!");
      }
    } else {
      try {
        await addEmployee({ ...data }).unwrap();
        successToast("Employee Added Successfully!", {
          onClose: () => {
            navigate(`/workspace/${workspaceId}/employees`);
          },
        });
      } catch (error) {
        console.error("error", error);
        errorToast("Something Went Wrong ..");
      }
    }
  };

  return (
    <>
      <Container sx={{ paddingTop: 10, paddingBottom: 20 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item lg={3} md={12}>
            {" "}
            <div className="logo-img">
              <Card>
                <CardMedia
                  component="img"
                  alt={formData.profilePicture}
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
                />
              </Card>
            </div>
          </Grid>
          <Grid item lg={9} md={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {" "}
                <Grid item xs={12}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {" "}
                    <Typography
                      variant="h4"
                      align="center"
                      style={{ margin: "20px 0 40px" }}
                    >
                      {id
                        ? `Update ${formData.name} Employee Details`
                        : "Add Employee"}
                    </Typography>
                    {/* <Button variant="text" onClick={() => navigate("/")}>
                      <ArrowBackIosIcon />
                      Back
                    </Button> */}
                  </div>
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
                    type="password"
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    className="variant-1"
                    value={formData.password}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="email"
                    fullWidth
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                    className="variant-1"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    error={!!errors.mobile}
                    helperText={errors.mobile ? errors.mobile.message : ""}
                    className="variant-1"
                    type="tel"
                    {...register("mobile", {
                      required: "Phone Number is required",
                    })}
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    error={!!errors.dob}
                    helperText={errors.dob ? errors.dob.message : ""}
                    className="variant-1"
                    value={
                      formData.dob
                        ? new Date(formData.dob).toISOString().split("T")[0]
                        : formData.dob
                    }
                    {...register("dob", {
                      required: "Date of Birth is required",
                    })}
                    onChange={handleChange}
                  />
                  <FormHelperText>Date Of Birth </FormHelperText>
                </Grid>
                <Grid item xs={6}>
                  <DepartmentSelectDropdown
                    name="department"
                    errors={errors}
                    onSelect={handleChange}
                    selectedOption={formData.department}
                    otherProps={{
                      ...register("department", {
                        required: "Department is required",
                      }),
                    }}
                  ></DepartmentSelectDropdown>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Profile IMG URL"
                    error={!!errors.profilePicture}
                    helperText={
                      errors.profilePicture ? errors.profilePicture.message : ""
                    }
                    className="variant-1"
                    placeholder="Profile IMG Url"
                    {...register("profilePicture", {
                      required: "Profile Img URL is required",
                    })}
                    onChange={handleChange}
                    value={formData.profilePicture}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.status == "A" ? true : false}
                          onChange={handleChange}
                          name="status"
                        />
                      }
                      label={`status ${
                        formData.status == "A" ? "Activated" : "Deactivated"
                      }`}
                    />
                  </FormGroup>
                  {/* <Switch
                    onChange={handleChange}
                    // label="Status"
                    // defaultChecked
                  /> */}
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  {isUpdateQueryLoader || isAddQueryLoader ? (
                    <Button disabled>
                      {id
                        ? "Updating  Employee Details..........."
                        : "Adding New Employee ........."}
                      <CircularProgress size={12} />
                    </Button>
                  ) : (
                    <Button type="submit" variant="contained" color="primary">
                      {id ? "Update Employee Details" : "Add Employee"}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
      {/* {id && (
        <Button onClick={() => navigate("/employee/add")}>Add Employee</Button>
      )} */}

      {/* <Form onSubmit={handleSubmit((data) => onSubmit(data))} className="w-50">
        <Form.Group controlId="formName" className="my-4">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            placeholder="Enter  Name"
            {...register("name", {
              required: " Name is required",
              // pattern: {
              //   // value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              //   message: "Invalid email address",
              // },
            })}
            isInvalid={!!errors.name}
            onChange={handleChange}
          />
          {errors.name && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.name.message}</ErrorText>
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group controlId="formPassword" className="my-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
            value={formData.password}
            isInvalid={!!errors.password}
            onChange={handleChange}
          />

          {errors.password && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.password.message}</ErrorText>
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="formEmail" className="my-4">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
            })}
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />

          {errors.email && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.email.message}</ErrorText>
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group controlId="formMobile" className="my-4">
          <Form.Label>Mobile</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Mobile"
            {...register("mobile", {
              required: "Mobile is required",
            })}
            value={formData.mobile}
            isInvalid={!!errors.mobile}
            onChange={handleChange}
          />

          {errors.mobile && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.mobile.message}</ErrorText>
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="formDob" className="my-4">
          <Form.Label>Date Of Birth</Form.Label>
          <Form.Control
            type="date"
            placeholder="Date of Birth"
            {...register("dob", {
              required: "Date of Birth is required",
            })}
            onChange={handleChange}
            isInvalid={!!errors.dob}
          />

          {errors.dob && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.dob.message}</ErrorText>
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="formProfilePicture" className="my-4">
          <Form.Label>Profile IMG Url</Form.Label>
          <Form.Control
            type="text"
            placeholder="Profile IMG Url"
            {...register("profilePicture", {
              required: "Profile Img URL is required",
              pattern: {
                value: /^(http|https):\/\/[^ "]+$/,
                message: "Enter a valid URL",
              },
            })}
            value={formData.profilePicture}
            onChange={handleChange}
            isInvalid={!!errors.profilePicture}
          />

          {errors.profilePicture && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.profilePicture.message}</ErrorText>
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="formRole" className="my-4">
          <Form.Label>Role</Form.Label>
          <Form.Control type="text" value={ROLE.EMPLOYEE} disabled />
        </Form.Group>

        <Form.Group controlId="formRole" className="my-4">
          <Form.Label>Department</Form.Label>
          <DepartmentSelectDropdown
            name="department"
            onSelect={handleChange}
            selectedOption={formData.department}
            otherProps={{
              ...register("department", {
                required: "Department is required",
              }),
            }}
          ></DepartmentSelectDropdown>

          {errors.department && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.department.message}</ErrorText>
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {isUpdateQueryLoader || isAddQueryLoader ? (
          <Button className="d-block m-auto" variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            {id ? "Updating Employee Profile" : "Adding Employee"}
          </Button>
        ) : (
          <Button variant="primary" className="d-block m-auto" type="submit">
            {id ? "Update " : "Add"}
          </Button>
        )}
      </Form> */}
      <ToastContainer></ToastContainer>
    </>
  );
};
export default AddEmployee;
