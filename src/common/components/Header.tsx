import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAuthDetails, signOut } from "../../store/slice/AuthSlice";
import { ROLE } from "../constants";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useEffect } from "react";
import { useLazyGetWorkspaceDataByIdQuery } from "../../store/api/workspaceApi";

const Header = () => {
  const { role, userId, workspaceId } = useSelector(getAuthDetails);

  const [getInitialData, { data }] = useLazyGetWorkspaceDataByIdQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (role === ROLE.ADMIN && userId && workspaceId) {
      getInitialData(workspaceId);
    }
  }, []);

  return (
    <div className="header ">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={NavLink} to="/dashboard">
            WorkSpace Management
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/dashboard">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile">
              Profile
            </Nav.Link>
            {role === ROLE.SUPER_ADMIN && (
              <Nav.Link as={NavLink} to="/workspace">
                Workspace
              </Nav.Link>
            )}
            {role === ROLE.ADMIN && (
              <Nav.Link as={NavLink} to={`workspace/${workspaceId}/employees`}>
                Manage Employees
              </Nav.Link>
            )}
            {userId && (
              <Nav.Link
                as={NavLink}
                to="/"
                onClick={() => {
                  localStorage.removeItem("root");
                  dispatch(signOut());
                }}
              >
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};
export default Header;
