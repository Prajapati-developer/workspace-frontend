import { useForm } from "react-hook-form";
import { useSignInMutation } from "../store/api/authApi";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../store/slice/UserSlice";
import { Button, Form, Spinner } from "react-bootstrap";
import ErrorText from "../common/components/ErrorText";
import { errorToast, successToast } from "../common/utill/tostUtill";
import { ILogin } from "../model/loginModel";
import { setWorkSpaceData } from "../store/slice/WorkspaceSlice";
import { ROLE } from "../common/constants";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useSignInMutation();

  const dispatch = useDispatch();

  const onSubmit = async (data: ILogin) => {
    let response;
    try {
      response = await login(data).unwrap();

      if (response.success) {
        dispatch(setUserProfile(response));
        if (response?.workspace?.id && response?.role === ROLE.ADMIN) {
          dispatch(setWorkSpaceData(response.workspace));
        }

        successToast(response.message, {
          onClose: () => {
            navigate("/dashboard");
          },
        });
      }
    } catch (er) {
      console.log("error", er);
      if (er && er.data && er.data.message) errorToast(er.data.message);
    }
    console.log("response", response);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  return (
    <div className="login-page">
      <h1>Sign In</h1>
      <Form onSubmit={handleSubmit((data) => onSubmit(data))} className="w-50">
        <Form.Group controlId="formEmail" className="my-4">
          <Form.Label>Email or Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Email or Name"
            {...register("email", {
              required: "Email or Name is required",
            })}
            isInvalid={!!errors.email}
          />
          {errors.email && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.email.message}</ErrorText>
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
            isInvalid={!!errors.password}
          />

          {errors.password && (
            <Form.Control.Feedback type="invalid">
              <ErrorText>{errors.password.message}</ErrorText>
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {isLoading ? (
          <Button className="d-block m-auto" variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Checking Credentials..
          </Button>
        ) : (
          <Button variant="primary" className="d-block m-auto" type="submit">
            Sign In
          </Button>
        )}
      </Form>
      <ToastContainer />
    </div>
  );
};
export default Login;
