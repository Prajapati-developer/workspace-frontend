import { useDispatch } from "react-redux";
import {
  useDeleteEmployeeMutation,
  useLazyGetEmployeeByWorkspaceIdQuery,
  useUpdateEmployeeStatusMutation,
} from "../../store/api/employeeApi";
import { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { successToast } from "../../common/utill/tostUtill";
import { setEmployeeData } from "../../store/slice/EmployeeSlice";
import EmployeeListView from "./EmployeeListView";
import EmployeeGridView from "./EmployeeGridView";
import DepartmentSelectDropdown from "./DepartmentSelectDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { exportToCsv } from "../../common/utill/utill";
import CustomDateRangePicker from "../../common/components/CustomDateRangePicker";
import { ToastContainer } from "react-toastify";
import { useSignInMutation } from "../../store/api/authApi";
import { IUser } from "../../model/userModel";
import Loader from "../../common/components/Loader";

import {
  Grid,
  TextField,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

const EmployeeList: React.FC = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [deleteWorkspaceEmployee] = useDeleteEmployeeMutation();

  const dispatch = useDispatch();

  const [getEmployee, { data: employeeData, isLoading, isError }] =
    useLazyGetEmployeeByWorkspaceIdQuery();

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    employeeData &&
      // setEmployees(
      //   employeeData.employee.filter((val) => val.role !== ROLE.ADMIN)
      // );
      setEmployees(employeeData.employee);
  }, [employeeData]);

  const [login] = useSignInMutation();
  const [updateStatus] = useUpdateEmployeeStatusMutation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  useEffect(() => {
    if (workspaceId) {
      getEmployee({ workspaceId });
    }
  }, [workspaceId]);
  useEffect(() => {
    if (!workspaceId) {
      navigate("dashboard");
    }
  }, []);
  const [openFilter, setOpenFilter] = useState(false);
  const [alignment, setAlignment] = useState<string | null>("list");

  const handleAlignment = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment);
  };
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <h1>Something went wrong!!!!!!</h1>;
  }

  const onDeleteEmployee = async (id: number) => {
    try {
      await deleteWorkspaceEmployee({ id }).unwrap();
      successToast("WorkspaceEmployee Deleted Successfully!");
    } catch (e) {
      console.error("error>>>>>>>>>>>>>>", e);
    }
  };

  const onEdit = (data: IUser) => {
    dispatch(setEmployeeData(data));
    navigate(`/employee/edit/${data.id}`, { state: { data } });
  };
  const onBypassLogin = async (data: IUser) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setEmployeeData(data));
      navigate(`/dashboard`);
    } catch (error) {
      console.error("error>>>>>>>>>>>>", error);
    }
  };

  const filterByDepartment = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setDepartment(value);

    if (value === "clear") {
      setEmployees(employeeData.employee);
      return;
    }
    const filteredResult = employeeData.employee.filter(
      (employee: IUser) => employee.department == parseInt(value)
    );
    setEmployees(filteredResult);
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const fieldsToSearch = ["name", "email"];
    setSearchTerm(value);
    if (!value) {
      setEmployees(employeeData.employee);
      return;
    }
    const searchResult = employeeData.employee.filter((item: IUser) =>
      fieldsToSearch.some((field: string) => item[`${field}`]?.includes(value))
    );
    setEmployees(searchResult);
  };

  const handleExportCsv = () => {
    exportToCsv(employees, "exported_data.csv");
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    const filteredData = employeeData.employee.filter((item: IUser) => {
      const itemDate = new Date(item.joiningDate);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    setEmployees(filteredData);
  };

  const onChangeStatus = async (id: number, status: string) => {
    if (status) {
      status = status == "A" ? "D" : "A";
    } else {
      status = "A";
    }

    try {
      const response = await updateStatus({ status, id }).unwrap();
      successToast(
        response.status == "A"
          ? "Employee Activated Successfully!"
          : "Employee Deactivated Successfully!"
      );
    } catch (e) {
      console.error("error>>>>>>>>>>>>>>", e);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const clearFilter = () => {
    setDepartment("");
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setEmployees(employeeData.employee);
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "20px 0 40px",
        }}
      >
        <Grid container spacing={2} alignItems={"center"}>
          <Grid item lg={8} md={12}>
            <Typography variant="h4">Manage Employees</Typography>
          </Grid>
          <Grid item lg={4} md={12}>
            <div>
              <Grid
                container
                spacing={2}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Grid item lg={6}>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => navigate("/employee/add")}
                  >
                    Add Employee
                  </Button>
                </Grid>
                <Grid item lg={4} md={12}>
                  <Button
                    variant="contained"
                    // color="info"
                    endIcon={<FilterAltIcon />}
                    onClick={() => setOpenFilter((prev) => !prev)}
                  >
                    Filter
                  </Button>
                </Grid>
                <Grid item lg={2} md={12}>
                  <Button
                    variant="contained"
                    onClick={handleExportCsv}
                    color="success"
                  >
                    <CloudDownloadIcon />
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
      {openFilter && (
        <div
          style={{
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            padding: 20,
            margin: "20px 0px",
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Grid item lg={12}>
              <TextField
                fullWidth
                type="text"
                placeholder="Search"
                className="mr-sm-2"
                onChange={onSearch}
                value={searchTerm}
              />
            </Grid>
            <Grid item lg={4} md={12}>
              <DepartmentSelectDropdown
                name="department"
                onSelect={filterByDepartment}
                selectedOption={parseInt(department)}
              />
            </Grid>

            <Grid item lg={6} md={12}>
              <CustomDateRangePicker
                onDateRangeChange={handleDateRangeChange}
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
              ></CustomDateRangePicker>
            </Grid>
            <Grid item lg={2} md={12}>
              <Button
                className="mx-4"
                variant="contained"
                onClick={clearFilter}
              >
                Reset Filter
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
      {/* <div className="d-flex align-items-center">
        <h1 className="mb-4">Manage Employee</h1>
        <Button
          className="mx-4"
          variant="primary ms-auto"
          onClick={() => setView((prev) => (prev == "list" ? "grid" : "list"))}
        >
          {view === "list" ? "List View" : "Grid View"}
        </Button>
      </div>

      <Row className="justify-content-center align-items-center mb-4">
        <Col className="col-6">
          <DepartmentSelectDropdown
            name="department"
            onSelect={filterByDepartment}
            selectedOption={parseInt(department)}
          ></DepartmentSelectDropdown>
        </Col>
        <Col className="col-6">
          <Form>
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              onChange={onSearch}
              value={searchTerm}
            />
          </Form>
        </Col>
        <Col className="col-6">
          <CustomDateRangePicker
            onDateRangeChange={handleDateRangeChange}
            startDate={startDate}
            endDate={endDate}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
          ></CustomDateRangePicker>
        </Col>
        <Col className="col-6">
          <Button
            variant="success"
            className="mx-4"
            onClick={() => navigate("/employee/add")}
          >
            Add Employee
          </Button>
          <Button className="mx-4" variant="primary" onClick={handleExportCsv}>
            Export Data
          </Button>
          <Button className="mx-4" variant="primary" onClick={clearFilter}>
            Reset Filter
          </Button>
        </Col>
      </Row> */}
      <div className="d-flex justify-content-center mb-4">
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          color="primary"
        >
          <ToggleButton value="list" aria-label="left aligned">
            <FormatListBulletedIcon />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="centered">
            <ViewModuleIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      {employees && employees.length > 0 ? (
        alignment == "list" ? (
          <EmployeeListView
            onEdit={onEdit}
            onDelete={onDeleteEmployee}
            onBypassLogin={onBypassLogin}
            data={employees}
            onChangeStatus={onChangeStatus}
            actualDataLength={employeeData && employeeData.length}
          ></EmployeeListView>
        ) : (
          <EmployeeGridView
            data={employees}
            onEdit={onEdit}
            onDelete={onDeleteEmployee}
            onBypassLogin={onBypassLogin}
            onChangeStatus={onChangeStatus}
            actualDataLength={employeeData && employeeData.length}
          ></EmployeeGridView>
        )
      ) : (
        <h1 className="text-center">No Data Available</h1>
      )}

      <ToastContainer />
    </div>
  );
};
export default memo(EmployeeList);
