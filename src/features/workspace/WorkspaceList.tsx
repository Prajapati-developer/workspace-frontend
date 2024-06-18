import { Badge, Button, Image, Table } from "react-bootstrap";
import {
  useDeleteWorkspaceMutation,
  useGetWorkspaceQuery,
  useUpdateWorkspaceStatusMutation,
  workspaceApi,
} from "../../store/api/workspaceApi";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setWorkSpaceData } from "../../store/slice/WorkspaceSlice";
import { successToast } from "../../common/utill/tostUtill";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../store/api/authApi";
import { useEffect, useState } from "react";
import Loader from "../../common/components/Loader";
import { IWorkspace } from "../../model/workspaceModel";

const WorkspaceList = () => {
  const { data: workspaceData, isLoading } = useGetWorkspaceQuery();
  const [updateStatus] = useUpdateWorkspaceStatusMutation();
  const [deleteWorkspace] = useDeleteWorkspaceMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [getInitialData] =
    workspaceApi.endpoints.getWorkspaceDataById.useLazyQuery();
  const [login] = useSignInMutation();
  // const [errorLoading, setErrorLoading] = useState(false);
  const [workspaceImgErrorLoading, setWorkspaceImgErrorLoading] = useState<
    boolean[]
  >([]);
  useEffect(() => {
    if (workspaceData) {
      setWorkspaceImgErrorLoading(new Array(workspaceData.length).fill(false));
    }
  }, [workspaceData]);
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
  const onBypassLogin = async (id: number) => {
    const response = await getInitialData(id).unwrap();
    login({
      email: response.email,
      password: response.password,
    });
    dispatch(setWorkSpaceData(response));

    navigate(`/dashboard`);
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
      <Button
        onClick={() => navigate("create")}
        className=" d-block ms-auto mb-4"
      >
        Create Workspace
      </Button>
      <Table striped bordered hover variant="" responsive>
        <thead>
          <tr>
            <th>Workspace Name</th>
            <th> Email</th>
            <th> Phone No</th>
            <th> Address</th>
            <th>Status</th>
            <th colSpan={3} className="text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {workspaceData &&
            workspaceData?.map((row: IWorkspace, rowIndex: number) => (
              <tr key={rowIndex}>
                <td>
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
                </td>
                <td>{row.email}</td>
                <td>{row.mobile ? row.mobile : "-"}</td>
                <td>{row.address}</td>
                <td>
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
                </td>
                <td onClick={() => onEdit(row)}>
                  <Button variant="success">Edit</Button>
                </td>
                <td onClick={() => row.id && onDelete(row.id)}>
                  <Button variant="danger">Delete</Button>
                </td>
                <td onClick={() => row.id && onBypassLogin(row.id)}>
                  <Button variant="secondary">Login</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <ToastContainer />
    </>
  );
};
export default WorkspaceList;
