import { Outlet } from "react-router-dom";

const PublicLayout: React.FC = () => {
  return (
    <div className="container pre-login">
      <Outlet />
    </div>
  );
};
export default PublicLayout;
