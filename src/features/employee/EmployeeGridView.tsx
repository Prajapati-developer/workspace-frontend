import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { formatDate } from "../../common/utill/utill";
import { IUser } from "../../model/userModel";
interface IProps {
  data: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (id: number) => void;
  onBypassLogin: (user: IUser) => void;
  actualDataLength: number;
  onChangeStatus: (id: number, status: string) => void;
}
const EmployeeGridView: React.FC<IProps> = ({
  data,
  onEdit,
  onDelete,
  onBypassLogin,
  actualDataLength,
  onChangeStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const ref = React.useRef();
  const [pageData, setPageData] = useState<IUser[]>([]);
  useEffect(() => {
    if (data) {
      setPageData(data);
      updatePageData(currentPage, itemsPerPage, data);
    }
  }, [data]);

  const updatePageData = (
    pageNumber: number,
    itemsPerPage: number,
    items = data
  ) => {
    const indexOfLastItem = pageNumber * itemsPerPage;
    const copyEmployeeData = items;
    const pagedItems = copyEmployeeData.slice(0, indexOfLastItem);
    pagedItems.length > 0 && setPageData(pagedItems);
  };

  const totalPages = Math.ceil(actualDataLength / itemsPerPage);
  const [isLoading, setLoading] = useState(false);
  const handleScroll = () => {
    const { current } = ref;
    if (
      current &&
      current.scrollTop + current.clientHeight >= current.scrollHeight
    ) {
      currentPage <= totalPages && setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      updatePageData(currentPage, itemsPerPage);
      setLoading(false);
    }, 1000);
  }, [itemsPerPage, currentPage]);
  return (
    <div className="employee-grid-container" ref={ref} onScroll={handleScroll}>
      <Row>
        {pageData &&
          pageData.map((item: IUser) => (
            <Col key={item.id} className="col-6 my-4">
              <Card>
                <Card.Body>
                  <Card.Title>
                    {" "}
                    <div className="d-flex align-items-center mb-4 ">
                      <>
                        <img
                          src={item.profilePicture}
                          className="profile-img"
                        ></img>
                        <h5>{item.name}</h5>
                      </>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <div className="ms-auto d-flex align-items-center mb-4">
                      <Button
                        onClick={() => item.id && onDelete(item.id)}
                        className="me-2"
                      >
                        Delete
                      </Button>
                      <Button onClick={() => onEdit(item)} className="mx-2">
                        Edit
                      </Button>
                      <Button
                        onClick={() => onBypassLogin(item)}
                        className="mx-2"
                      >
                        Login
                      </Button>
                      <Form.Check
                        type="switch"
                        className="mx-2"
                        checked={item.status == "A" ? true : false}
                        onChange={() =>
                          item.id && onChangeStatus(item.id, item.status)
                        }
                        label={item.status == "A" ? "Activate" : "Deactivate"}
                      />
                    </div>
                    <p>Email: {item.email}</p>
                    <p>Department: {item.departmentName}</p>
                    <p>Mobile: {item.mobile}</p>
                    {item.dob && <p>DOB: {item.dob}</p>}
                    <p>Joining Date: {formatDate(item.joiningDate)}</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
      {isLoading && <h1 className="text-center">Loading............</h1>}
      {pageData && pageData.length === actualDataLength && (
        <h1 className="text-center">No More Data</h1>
      )}
    </div>
  );
};

export default EmployeeGridView;
