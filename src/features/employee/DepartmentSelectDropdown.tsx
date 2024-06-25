import React from "react";
import { Form } from "react-bootstrap";
import { useGetDepartmentQuery } from "../../store/api/employeeApi";
import { IDepartment } from "../../model/userModel";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
interface IProps {
  name: string;
  onSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedOption?: number;
  errors?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  otherProps?: any;
}
const DepartmentSelectDropdown: React.FC<IProps> = ({
  name,
  onSelect,
  selectedOption,
  otherProps,
  errors,
}) => {
  const { data: departments, isLoading } = useGetDepartmentQuery();

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect && onSelect(event);
  };
  console.log("errors", errors);
  const isEmptyObject = (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0;
  };
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Department</InputLabel>
        <Select
          fullWidth
          name={name}
          value={selectedOption || ""}
          {...otherProps}
          label="Select Department"
          onChange={handleSelect}
          error={errors ? (isEmptyObject(errors) ? false : true) : false}
        >
          {isLoading && <MenuItem>Loading...</MenuItem>}

          {departments &&
            departments.map((e: IDepartment) => {
              return <MenuItem value={e.id}> {e.departmentName}</MenuItem>;
            })}
        </Select>
        {errors?.department && (
          <FormHelperText error>{errors.department.message}</FormHelperText>
        )}
      </FormControl>
      {/* <Form.Select
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
      </Form.Select> */}
    </>
  );
};

export default DepartmentSelectDropdown;
