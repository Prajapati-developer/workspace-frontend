import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
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
    <div className="mt-4 custom-date-range-container">
      <Row>
        <Col className="col-6">
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
        </Col>
        <Col className="col-6">
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
        </Col>
        {!isValidRange && (
          <p style={{ color: "red" }} className="text-center">
            End date must be after start date.
          </p>
        )}
        <Button
          disabled={!isValidRange}
          className="w-25 ms-auto me-4 mb-4"
          onClick={handleApplyClick}
        >
          Search By Dates
        </Button>
      </Row>
    </div>
  );
};

export default CustomDateRangePicker;
