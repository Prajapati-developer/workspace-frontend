import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="no-data no-data-found items-center">
      <h3 className="title text-14">
        Oops the page you were looking for does not exist
      </h3>
      <p className="title-2 mb-14">
        You may have mistyped the address or the page may have moved
      </p>
    </div>
  );
};

export default NotFound;
