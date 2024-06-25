import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useCreateWorkspaceMutation,
  useUpdateWorkspaceDataMutation,
  workspaceApi,
} from "../../store/api/workspaceApi";
import { successToast } from "../../common/utill/tostUtill";
import { ToastContainer } from "react-toastify";
import { IWorkspace } from "../../model/workspaceModel";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Loader from "../../common/components/Loader";
import {
  Button,
  CardMedia,
  CircularProgress,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
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
    if (name == "logo") {
      setImageError(false);
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
  const [imageError, setImageError] = useState(false);
  if (isInitialDataLoading) {
    return <Loader />;
  }
  return (
    <>
      <Container sx={{ paddingTop: 10, paddingBottom: 20 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item lg={3} md={12}>
            <div className="logo-img">
              <Card>
                <CardMedia
                  component="img"
                  alt={formData.name}
                  height="200"
                  image={
                    formData.logo
                      ? !imageError
                        ? formData.logo
                        : "../../../src/assets/defaultCompanyLogo.png"
                      : "../../../src/assets/defaultCompanyLogo.png"
                  }
                  onError={() => setImageError(true)}
                />
              </Card>
            </div>
          </Grid>
          <Grid item lg={9} md={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {" "}
                    <Typography
                      variant="h4"
                      align="center"
                      style={{ margin: "20px 0 40px" }}
                    >
                      {id
                        ? `Update ${formData.name} Workspace`
                        : "Add Workspace"}
                    </Typography>
                    <Button
                      variant="text"
                      onClick={() => navigate("/workspace")}
                    >
                      <IconButton>
                        <ArrowBackIosIcon />
                      </IconButton>
                      Back
                    </Button>
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Logo IMG URL"
                    error={!!errors.logo}
                    helperText={errors.logo ? errors.logo.message : ""}
                    className="variant-1"
                    placeholder="Logo IMG Url"
                    {...register("logo", {
                      required: "Logo URL is required",
                    })}
                    onChange={handleChange}
                    value={formData.logo}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    error={!!errors.address}
                    helperText={errors.address ? errors.address.message : ""}
                    className="variant-1"
                    placeholder="Address"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    minRows={3}
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
                        ? "Updating  Workspace..........."
                        : "Creating Workspace ........."}
                      <CircularProgress size={12} />
                    </Button>
                  ) : (
                    <Button type="submit" variant="contained" color="primary">
                      {id ? "Update Workspace" : "Add Workspace"}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
      <ToastContainer />
    </>
  );
};
export default CreateWorkspace;
