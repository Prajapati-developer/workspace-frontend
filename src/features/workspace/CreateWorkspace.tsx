import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useCreateWorkspaceMutation,
  useUpdateWorkspaceDataMutation,
  workspaceApi,
} from "../../store/api/workspaceApi";
import { successToast } from "../../common/utill/tostUtill";
import ErrorText from "../../common/components/ErrorText";
import { ToastContainer } from "react-toastify";
import { IWorkspace } from "../../model/workspaceModel";
import Loader from "../../common/components/Loader";
const initialState: IWorkspace = {
  logo: "",
  name: "",
  email: "",
  password: "",
  address: "",
  status: "A",
  id: undefined,
  mobile: undefined,
  role: "",
};
const CreateWorkspace: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IWorkspace>();
  const location = useLocation();
  const stateData = location.state;

  const [formData, setFormData] = useState<IWorkspace>(
    stateData ? { ...stateData?.data } : initialState
  );

  const [editWorkspace, { isLoading: isUpdateQueryLoader }] =
    useUpdateWorkspaceDataMutation();
  const [createWorkspace, { isLoading: isAddQueryLoader }] =
    useCreateWorkspaceMutation();
  const [
    getInitialData,
    { isLoading: isInitialDataLoading, data: initialDataRes },
  ] = workspaceApi.endpoints.getWorkspaceDataById.useLazyQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name == "status") {
      value = e.target.checked ? "A" : "D";
    }

    setFormData({ ...formData, [name]: value });
  };

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getInitialData(parseInt(id));
    }
  }, []);

  useEffect(() => {
    if (initialDataRes && id) {
      setFormData(initialDataRes);
      reset(initialDataRes);
    }
  }, [initialDataRes]);

  const navigate = useNavigate();
  const onSubmit = async (data: IWorkspace) => {
    let response;
    try {
      if (id) {
        //edit
        response = await editWorkspace({
          ...data,
          ...formData,
        }).unwrap();

        response.message &&
          successToast(response.message, {
            onClose: () => {
              navigate("/workspace");
            },
          });
      } else {
        //create
        response = await createWorkspace({
          ...data,
          ...formData,
        }).unwrap();
        response.message &&
          successToast(response.message, {
            onClose: () => {
              navigate("/workspace");
            },
          });
      }
    } catch (error) {
      console.error("something went wrong!", error);
    }
  };

  if (isInitialDataLoading) {
    return <Loader />;
  }
  return (
    <>
      <div>
        <h1 className="text-center mb-6">
          {id ? "Edit Workspace" : "Create Workspace"}
        </h1>
        <Button onClick={() => navigate("/workspace")}>Back</Button>
      </div>

      <Form onSubmit={handleSubmit((data) => onSubmit(data))} className="w-50">
        <Form.Group controlId="formName" className="my-4">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            placeholder="Enter Name"
            {...register("name", {
              required: " Name is required",
              // pattern: {
              //   value: /^[A-Z0-9 ]$/i,
              //   message: "Invalid Name",
              // },
            })}
            onChange={handleChange}
            isInvalid={!!errors.name}
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
            value={formData.password}
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
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
            isInvalid={!!errors.email}
            onChange={handleChange}
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

        <Form.Group controlId="formLogo" className="my-4">
          <Form.Label>Logo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Logo IMG Url"
            {...register("logo", {
              required: "Logo  URL is required",
              // pattern: {
              //   value: /^(http|https):\/\/[^ "]+$/,
              //   message: "Enter a valid URL",
              // },
            })}
            onChange={handleChange}
            value={formData.logo}
            isInvalid={!!errors.logo}
          />

          {errors.logo && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.logo.message}</ErrorText>
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="formAddress" className="my-4">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Address"
            {...register("address", {
              required: "Address is required",
            })}
            value={formData.address}
            isInvalid={!!errors.address}
            onChange={handleChange}
          />

          {errors.address && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.address.message}</ErrorText>
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="formAddress" className="my-4">
          <Form.Label>Status</Form.Label>

          <Form.Check
            type="switch"
            name="status"
            checked={formData.status == "A" ? true : false}
            onChange={handleChange}
          />

          {errors.address && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.address.message}</ErrorText>
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
            {id
              ? "Updating  Workspace..........."
              : "Creating Workspace ........."}
          </Button>
        ) : (
          <Button variant="primary" className="d-block m-auto" type="submit">
            {id ? "Update Workspace" : "Add Workspace"}
          </Button>
        )}
      </Form>
      <ToastContainer />
    </>
  );
};
export default CreateWorkspace;
