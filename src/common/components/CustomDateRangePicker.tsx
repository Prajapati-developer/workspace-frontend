import { Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface IProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
  startDate: string;
  endDate: string;
  handleStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const CustomDateRangePicker: React.FC<IProps> = ({
  onDateRangeChange,
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
}) => {
  const handleApplyClick = () => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  };
  const [isValidRange, setIsValidRange] = useState(true);
  const validateRange = () => {
    if (startDate && endDate) {
      setIsValidRange(new Date(startDate) <= new Date(endDate));
    } else {
      setIsValidRange(true);
    }
  };
  useEffect(() => {
    validateRange();
  }, [startDate, endDate]);
  return (
    <div className="custom-date-range-container1">
      <Grid container spacing={2} alignItems={"center"}>
        <Grid item lg={4} md={4}>
          <TextField
            fullWidth
            placeholder="Start Date"
            type="date"
            className="form-control"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </Grid>
        <Grid item lg={4} md={4}>
          <TextField
            fullWidth
            placeholder="End Date"
            type="date"
            className="form-control"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </Grid>
        <Grid item lg={4} md={4}>
          <Button
            disabled={!isValidRange}
            className="ms-auto "
            onClick={handleApplyClick}
            variant="contained"
          >
            Filter By Dates
          </Button>
        </Grid>
        {!isValidRange && (
          <Grid item lg={12} md={12}>
            <p style={{ color: "red" }} className="text-center">
              End date must be after start date.
            </p>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default CustomDateRangePicker;
