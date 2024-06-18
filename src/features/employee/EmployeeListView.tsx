import { memo, useEffect, useState } from "react";
import { Button, Form, ListGroup, Pagination } from "react-bootstrap";
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
const EmployeeListView: React.FC<IProps> = ({
  data,
  onEdit,
  onDelete,
  onBypassLogin,
  onChangeStatus,
  actualDataLength,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const totalPages = Math.ceil(actualDataLength / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    pageNumber <= totalPages && updatePageData(pageNumber, itemsPerPage);
  };
  const [pageData, setPageData] = useState<IUser[]>();
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
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const copyEmployeeData = items;
    const pagedItems = copyEmployeeData.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    setPageData(pagedItems);
  };

  const [pageButtonLength, setPageButtonLength] = useState<any[]>([]);
  useEffect(() => {
    if (totalPages) {
      setPageButtonLength(new Array(totalPages).fill(""));
    }
  }, [totalPages]);

  return (
    <>
      {
        <>
          <h1>List View</h1>

          <ListGroup>
            {pageData &&
              pageData.map((item) => (
                <ListGroup.Item key={item.id} className="my-4">
                  <div className="">
                    <div className="d-flex align-items-center mb-4 ">
                      <>
                        <img
                          src={item.profilePicture}
                          className="profile-img"
                        ></img>
                        <h5>{item.name}</h5>
                      </>

                      <div className="ms-auto d-flex align-items-center">
                        <Button
                          onClick={() => item.id && onDelete(item.id)}
                          className="me-2"
                          variant="danger"
                        >
                          Delete
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => onEdit(item)}
                          className="mx-2"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => onBypassLogin(item)}
                          className="mx-2"
                          variant="secondary"
                        >
                          Login
                        </Button>
                        <Form.Check
                          type="switch"
                          className="me-2"
                          checked={item.status == "A" ? true : false}
                          onChange={() =>
                            item.id && onChangeStatus(item.id, item.status)
                          }
                          label={item.status == "A" ? "Activate" : "Deactivate"}
                        />
                      </div>
                    </div>
                    <p>Email: {item.email}</p>

                    <p>Mobile: {item.mobile}</p>
                    <p>Department: {item.departmentName}</p>
                    {item.dob && <p>DOB: {item.dob}</p>}
                    <p>Joining Date: {formatDate(item.joiningDate)}</p>
                  </div>
                </ListGroup.Item>
              ))}
          </ListGroup>
          <div>
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {pageButtonLength?.map((_, index) => {
                return (
                  <Pagination.Item
                    active={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                );
              })}

              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === Math.ceil(actualDataLength / itemsPerPage)
                }
              />
            </Pagination>
          </div>
        </>
      }
    </>
  );
};

export default memo(EmployeeListView);
