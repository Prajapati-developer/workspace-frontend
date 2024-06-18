import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Header from "../Header";
import Footer from "../Footer";
import Loader from "../Loader";

interface IProps {
  isAuthenticated: boolean;
}
const PrivateLayout: React.FC<IProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <div className="post-login">
        <Header />
        <div className="container post-login-body">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default PrivateLayout;
