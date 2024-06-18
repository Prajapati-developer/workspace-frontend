import React from "react";

interface IProps {
  children: any;
}
const ErrorText: React.FC<IProps> = ({ children }) => {
  return <span style={{ color: "red" }}>{children}</span>;
};

export default ErrorText;
