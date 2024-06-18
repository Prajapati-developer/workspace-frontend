import React from "react";
import { Form } from "react-bootstrap";
import { useGetDepartmentQuery } from "../../store/api/employeeApi";
import { IDepartment } from "../../model/userModel";
interface IProps {
  name: string;
  onSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedOption?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  otherProps?: any;
}
const DepartmentSelectDropdown: React.FC<IProps> = ({
  name,
  onSelect,
  selectedOption,
  otherProps,
}) => {
  const { data: departments, isLoading } = useGetDepartmentQuery();

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect && onSelect(event);
  };

  return (
    <Form.Select
      name={name}
      value={selectedOption || ""}
      {...otherProps}
      onChange={handleSelect}
    >
      {isLoading ? (
        <>Loading.....</>
      ) : (
        <>
          <option value="" disabled>
            Select Department
          </option>
          {departments &&
            departments.map((e: IDepartment) => {
              return <option value={e.id}> {e.departmentName}</option>;
            })}
        </>
      )}
    </Form.Select>
  );
};

export default DepartmentSelectDropdown;
