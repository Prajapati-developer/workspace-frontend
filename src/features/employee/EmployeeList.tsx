import { useDispatch } from "react-redux";
import {
  useDeleteEmployeeMutation,
  useLazyGetEmployeeByWorkspaceIdQuery,
  useUpdateEmployeeStatusMutation,
} from "../../store/api/employeeApi";
import { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, FormControl, Row } from "react-bootstrap";
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
import { ROLE } from "../../common/constants";

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
      setEmployees(
        employeeData.employee.filter((val) => val.role !== ROLE.ADMIN)
      );
  }, [employeeData]);

  const [login] = useSignInMutation();
  const [updateStatus] = useUpdateEmployeeStatusMutation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [view, setView] = useState("list");
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
    <div className="mt-4">
      <div className="d-flex align-items-center">
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
      </Row>

      {employees && employees.length > 0 ? (
        view == "list" ? (
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
