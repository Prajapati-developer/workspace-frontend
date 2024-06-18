import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="no-data no-data-found items-center">
      <h3 className="title text-14">
        Sorry, you are not authorized to access this page
      </h3>
      <p className="title-2 mb-14">
        You may have mistyped the address or the page may have moved
      </p>
      <button onClick={() => navigate("/dashboard")}>
        Take me back to Home
      </button>
    </div>
  );
};

export default AccessDenied;
