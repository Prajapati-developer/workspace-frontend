import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Routes as ReactRoute, Route } from "react-router-dom";
import { getAuthDetails } from "../store/slice/AuthSlice";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "./Routes";
import PublicLayout from "../common/components/layout/PublicLayout";
import PrivateLayout from "../common/components/layout/PrivateLayout";
import AccessDenied from "../common/components/router/AccessDenied";
import Page from "../common/components/router/Page";
import Loader from "../common/components/Loader";

interface IRouteProps {
  path: string;
  component: React.FC;
  title?: string;
  role: string[];
  children?: IRouteProps[];
}
const Routes: React.FC = () => {
  const { isAuthenticated, role } = useSelector(getAuthDetails);

  const renderRoute = (routes: IRouteProps[], parentPath?: string) => {
    return routes.map((route: IRouteProps, i: number) => {
      const { path, children } = route;
      const fullPath: string = parentPath ? `${parentPath}/${path}` : path;
      return (
        <Route
          key={i}
          path={fullPath}
          element={
            <Page
              component={
                route.role ? (
                  route.role.includes(role) ? (
                    <route.component />
                  ) : (
                    <AccessDenied />
                  )
                ) : (
                  <route.component />
                )
              }
              title={route.title}
            />
          }
        >
          {children && renderRoute(children, fullPath)}
        </Route>
      );
    });
  };
  return (
    <>
      <Suspense fallback={<Loader />}>
        <ReactRoute>
          <Route path="" element={<PublicLayout />}>
            {PUBLIC_ROUTES.map((route, i: number) => {
              return (
                <Route
                  key={i}
                  path={route.path}
                  element={
                    <Page component={<route.component />} title={route.title} />
                  }
                />
              );
            })}
          </Route>

          <Route
            path="/"
            element={<PrivateLayout isAuthenticated={isAuthenticated} />}
          >
            {renderRoute(PRIVATE_ROUTES)}
          </Route>
        </ReactRoute>
      </Suspense>
    </>
  );
};

export default Routes;
