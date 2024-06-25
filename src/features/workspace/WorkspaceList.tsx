import { Badge, Image } from "react-bootstrap";
import {
  useDeleteWorkspaceMutation,
  useGetWorkspaceQuery,
  useUpdateWorkspaceStatusMutation,
  workspaceApi,
} from "../../store/api/workspaceApi";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setWorkSpaceData } from "../../store/slice/WorkspaceSlice";
import { errorToast, successToast } from "../../common/utill/tostUtill";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../store/api/authApi";
import { useEffect, useState } from "react";
import Loader from "../../common/components/Loader";
import { IWorkspace } from "../../model/workspaceModel";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const WorkspaceList = () => {
  const { data: workspaceData, isLoading } = useGetWorkspaceQuery();
  const [updateStatus] = useUpdateWorkspaceStatusMutation();
  const [deleteWorkspace] = useDeleteWorkspaceMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [getInitialData] =
    workspaceApi.endpoints.getWorkspaceDataById.useLazyQuery();
  const [login] = useSignInMutation();

  const [workspaceImgErrorLoading, setWorkspaceImgErrorLoading] = useState<
    boolean[]
  >([]);
  useEffect(() => {
    if (workspaceData) {
      setWorkspaceImgErrorLoading(new Array(workspaceData.length).fill(false));
      setAnchorEl(new Array(workspaceData.length).fill(null));
    }
  }, [workspaceData]);

  const [anchorEl, setAnchorEl] = useState<(HTMLElement | null)[]>([]);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    rowIndex: number
  ) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[rowIndex] = event.currentTarget;
    setAnchorEl(newAnchorEl);
  };
  const handleClose = (rowIndex: number) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[rowIndex] = null;
    setAnchorEl(newAnchorEl);
  };
  if (isLoading) {
    return <Loader />;
  }

  const onChangeStatus = async (id: number, status: string) => {
    status = status == "A" ? "D" : "A";
    try {
      const response = await updateStatus({ status, id }).unwrap();
      dispatch(setWorkSpaceData(response));

      successToast(
        response.status == "A"
          ? "Workspace Activated Successfully!"
          : "Workspace Deactivated Successfully!"
      );
    } catch (e) {
      console.error("error", e);
    }
  };

  const onDelete = async (id: number) => {
    try {
      void (await deleteWorkspace(id).unwrap());
      successToast("Workspace Deleted Successfully!");
    } catch (error) {
      console.error("error", error);
    }
  };

  const onEdit = (data: IWorkspace) => {
    navigate(`edit/${data.id}`, { state: { data } });
  };
  const onBypassLogin = async (idNo: number) => {
    const response = await getInitialData(idNo).unwrap();
    try {
      const loginRes = await login({
        email: response.email,
        password: response.password,
      }).unwrap();

      if (loginRes.success) {
        dispatch(setWorkSpaceData(response));
        navigate(`/dashboard`);
      } else {
        errorToast(loginRes.message);
      }
    } catch (e) {
      errorToast(e?.data?.message);
    }
  };
  const handleError = (index: number) => {
    setWorkspaceImgErrorLoading((prevItems: boolean[]) => {
      const newItems: boolean[] = [...prevItems];
      newItems[index] = true;
      return newItems;
    });
  };

  return (
    <>
      <Paper
        sx={{ width: "100%" }}
        style={{ margin: "20px 0 40px", padding: "20px " }}
      >
        <Button
          className="d-block ms-auto mb-4"
          variant="outlined"
          onClick={() => navigate("create")}
        >
          Create Workspace
        </Button>

        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader>
            <TableHead>
              <TableCell>Workspace Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell style={{ width: "300px" }}>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell className="text-center">Action</TableCell>
            </TableHead>
            <TableBody>
              {workspaceData &&
                workspaceData?.map((row: IWorkspace, rowIndex: number) => (
                  <TableRow hover key={rowIndex}>
                    <TableCell>
                      <div className="d-flex align-items-center">
                        <div className="w-25 me-4 ">
                          {row.logo && !workspaceImgErrorLoading[rowIndex] ? (
                            <Image
                              src={row.logo}
                              roundedCircle
                              onError={() => {
                                handleError(rowIndex);
                              }}
                              fluid
                              style={{ height: "auto", width: "100px" }}
                            />
                          ) : (
                            <Image
                              src={"../src/assets/defaultCompanyLogo.png"}
                              roundedCircle
                              fluid
                              style={{ height: "auto", width: "100px" }}
                            />
                          )}
                        </div>
                        {row.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.email} {row.id}
                    </TableCell>
                    <TableCell>{row.mobile ? row.mobile : "-"}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>
                      {row.status == "A" ? (
                        <Badge
                          bg="success"
                          onClick={() =>
                            row.id && onChangeStatus(row.id, row.status)
                          }
                          className="cursor-pointer"
                        >
                          Activate
                        </Badge>
                      ) : (
                        <Badge
                          bg="danger"
                          onClick={() =>
                            row.id && onChangeStatus(row.id, row.status)
                          }
                          className="cursor-pointer"
                        >
                          Deactivate
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell key={rowIndex}>
                      <IconButton
                        aria-label="more"
                        aria-controls={`menu-${rowIndex}`}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, rowIndex)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id={`menu-${rowIndex}`}
                        anchorEl={anchorEl[rowIndex]}
                        keepMounted
                        open={Boolean(anchorEl[rowIndex])}
                        onClose={() => handleClose(rowIndex)}
                      >
                        <MenuItem
                          onClick={() => {
                            onEdit(row);
                            handleClose(rowIndex);
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleClose(rowIndex);
                            row.id && onDelete(row.id);
                          }}
                        >
                          Delete
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            handleClose(rowIndex);
                            row.id && onBypassLogin(row.id);
                          }}
                        >
                          Login
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <ToastContainer />
      </Paper>
    </>
  );
};
export default WorkspaceList;
