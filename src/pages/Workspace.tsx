import { Typography } from "@mui/material";
import WorkspaceList from "../features/workspace/WorkspaceList";

const Workspace: React.FC = () => {
  return (
    <>
      <Typography variant="h4" style={{ margin: "40px 0 40px" }}>
        Manage Workspace
      </Typography>
      <WorkspaceList />;
    </>
  );
};
export default Workspace;
