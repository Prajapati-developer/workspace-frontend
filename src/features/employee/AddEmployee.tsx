import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUpdateUserProfileMutation } from "../../store/api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddEmployeeMutation,
  useLazyGetEmployeeByIdQuery,
} from "../../store/api/employeeApi";
import { Button, Form, Spinner } from "react-bootstrap";
import DepartmentSelectDropdown from "./DepartmentSelectDropdown";
import { errorToast, successToast } from "../../common/utill/tostUtill";
import { IUser } from "../../model/userModel";
import ErrorText from "../../common/components/ErrorText";
import { ToastContainer } from "react-toastify";
import { getAuthDetails } from "../../store/slice/AuthSlice";
import { ROLE } from "../../common/constants";
import Loader from "../../common/components/Loader";

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
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
    data = { ...data, company: workspaceId, role: ROLE.EMPLOYEE };

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
      {id && (
        <Button onClick={() => navigate("/employee/add")}>Add Employee</Button>
      )}

      <Form onSubmit={handleSubmit((data) => onSubmit(data))} className="w-50">
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
              isInvalid: !!errors.department,
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
      </Form>
      <ToastContainer></ToastContainer>
    </>
  );
};
export default AddEmployee;
