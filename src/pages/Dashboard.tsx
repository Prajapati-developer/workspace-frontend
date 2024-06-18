import { useSelector } from "react-redux";
import { getAuthDetails } from "../store/slice/AuthSlice";
import { ROLE } from "../common/constants";
import EmployeeDashboard from "../common/components/dashboard/EmployeeDashboard";
import WorkspaceAdminDashboard from "../common/components/dashboard/WorkspaceAdminDashboard";
import SuperAdminDashboard from "../common/components/dashboard/SuperAdminDashboard";

const Dashboard: React.FC = () => {
  const { role } = useSelector(getAuthDetails);

  switch (role) {
    case ROLE.EMPLOYEE:
      return <EmployeeDashboard />;
    case ROLE.ADMIN:
      return <WorkspaceAdminDashboard />;
    default:
      return <SuperAdminDashboard />;
  }
};
export default Dashboard;
