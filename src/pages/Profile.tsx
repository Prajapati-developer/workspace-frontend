import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserProfile } from "../store/slice/UserSlice";
import { useForm } from "react-hook-form";
import { IUser } from "../model/userModel";
import { useUpdateUserProfileMutation } from "../store/api/userApi";
import { errorToast, successToast } from "../common/utill/tostUtill";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import ErrorText from "../common/components/ErrorText";
import { ToastContainer } from "react-toastify";
import { useLazyGetEmployeeByIdQuery } from "../store/api/employeeApi";
import { getAuthDetails } from "../store/slice/AuthSlice";
import { ROLE } from "../common/constants";
import Loader from "../common/components/Loader";

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };
  const { userId } = useSelector(getAuthDetails);
  const [editEmployeeDetail, { isLoading: isUpdateQueryLoader }] =
    useUpdateUserProfileMutation();
  const [getUserProfileById, { data, isLoading, isError, error }] =
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

  if (isError) {
    console.error("error", error);
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
      <Row>
        <Col className="col-2">
          <img src={formData.profilePicture}></img>
        </Col>
        <Col>
          {" "}
          <Form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="w-50"
          >
            <Form.Group controlId="formName" className="my-4">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                placeholder="Enter  Name"
                {...register("name", {
                  required: " Name is required",
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
                disabled={
                  formData.role == ROLE.ADMIN ||
                  formData.role == ROLE.SUPER_ADMIN
                }
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
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                value={formData.email}
                isInvalid={!!errors.email}
                onChange={handleChange}
                disabled={
                  formData.role == ROLE.ADMIN ||
                  formData.role == ROLE.SUPER_ADMIN
                }
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
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
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
                isInvalid={!!errors.dob}
                value={
                  formData.dob
                    ? new Date(formData.dob).toISOString().split("T")[0]
                    : formData.dob
                }
                onChange={handleChange}
              />

              {errors.dob && (
                <Form.Control.Feedback type="invalid">
                  <ErrorText>{errors.dob.message}</ErrorText>
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group controlId="formProfilePicture" className="my-4">
              <Form.Label>Profile</Form.Label>
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
                isInvalid={!!errors.profilePicture}
                onChange={handleChange}
              />

              {errors.profilePicture && (
                <Form.Control.Feedback type="invalid">
                  <ErrorText>{errors.profilePicture.message}</ErrorText>
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group controlId="formRole" className="my-4">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                value={formData.role}
                disabled
                placeholder="Role"
                // {...register("role", {
                //   required: "Role  is required",
                // })}
                // isInvalid={!!errors.role}
              />

              {/* {errors.role && (
                <Form.Control.Feedback type="invalid">
                  <ErrorText>{errors.role.message}</ErrorText>
                </Form.Control.Feedback>
              )} */}
            </Form.Group>
            {formData.company && formData.role !== ROLE.SUPER_ADMIN && (
              <Form.Group controlId="formWorkspace" className="my-4">
                <Form.Label>Workspace Name</Form.Label>

                <Form.Control
                  type="text"
                  value={formData.workspaceName}
                  disabled
                  placeholder="Workspace Name"
                  {...register("workspaceName", {
                    required: "Workspace Name  is required",
                  })}
                  isInvalid={!!errors.workspaceName}
                />

                {errors.workspaceName && (
                  <Form.Control.Feedback type="invalid">
                    <ErrorText>{errors.workspaceName.message}</ErrorText>
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}
            {formData.department && formData.role !== ROLE.SUPER_ADMIN && (
              <Form.Group controlId="formDepartment" className="my-4">
                <Form.Label>Department Name</Form.Label>

                <Form.Control
                  type="text"
                  value={formData.departmentName}
                  disabled
                  placeholder="Department"
                  {...register("departmentName", {
                    required: "Department  is required",
                  })}
                  isInvalid={!!errors.departmentName}
                />

                {errors.departmentName && (
                  <Form.Control.Feedback type="invalid">
                    <ErrorText>{errors.departmentName.message}</ErrorText>
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}

            <Form.Group controlId="formRole" className="my-4">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                value={formData.status == "A" ? "Activate" : "Deactivate"}
                disabled
                placeholder="status"
                // {...register("status", {
                //   required: "Status  is required",
                // })}
                // isInvalid={!!errors.status}
              />

              {/* {errors.status && (
                <Form.Control.Feedback type="invalid">
                  <ErrorText>{errors.status.message}</ErrorText>
                </Form.Control.Feedback>
              )} */}
            </Form.Group>

            {isUpdateQueryLoader ? (
              <Button className="d-block m-auto" variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                {"Updating Profile"}
              </Button>
            ) : (
              <Button
                variant="primary"
                className="d-block m-auto"
                type="submit"
              >
                Update
              </Button>
            )}
          </Form>
        </Col>

        <ToastContainer />
      </Row>
    </>
  );
};
export default Profile;
