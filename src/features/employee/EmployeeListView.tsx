import { memo, useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import { formatDate } from "../../common/utill/utill";
import { IUser } from "../../model/userModel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Typography,
} from "@mui/material";
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

  const [pageButtonLength, setPageButtonLength] = useState<unknown[]>([]);
  const [anchorEl, setAnchorEl] = useState<(HTMLElement | null)[]>(
    new Array(actualDataLength).fill(null)
  );
  useEffect(() => {
    if (totalPages) {
      setPageButtonLength(new Array(totalPages).fill(""));
      // setAnchorEl(new Array(data.length).fill(null));
    }
  }, [totalPages]);
  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    rowIndex: number
  ) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[rowIndex] = event.currentTarget;
    setAnchorEl(newAnchorEl);
  };
  const handleClose = (rowIndex: number) => {
    const newAnchorEl = [...anchorEl];
    newAnchorEl[rowIndex] = null;
    setAnchorEl(newAnchorEl);
  };
  return (
    <>
      <List
        sx={{
          width: "100%",

          bgcolor: "background.paper",
          boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
          p: 2,
        }}
      >
        {pageData &&
          pageData.map((item, index) => (
            <>
              <ListItem alignItems="flex-start" sx={{ height: "auto" }}>
                <ListItemAvatar>
                  <Avatar
                    alt={item.name}
                    src={item.profilePicture}
                    sx={{ width: "60px", height: "60px", marginRight: "20px" }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h5" className="mb-4">
                        {item.name}
                      </Typography>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          aria-label="more"
                          aria-controls={`menu-${index}`}
                          aria-haspopup="true"
                          onClick={(event) => handleClick(event, index)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id={`menu-${index}`}
                          anchorEl={anchorEl[index]}
                          keepMounted
                          open={Boolean(anchorEl[index])}
                          onClose={() => handleClose(index)}
                        >
                          <MenuItem
                            onClick={() => {
                              onEdit(item);
                              handleClose(index);
                            }}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleClose(index);
                              item.id && onDelete(item.id);
                            }}
                          >
                            Delete
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              handleClose(index);
                              item.id && onBypassLogin(item);
                            }}
                          >
                            Login
                          </MenuItem>
                        </Menu>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                className="me-2"
                                onChange={() =>
                                  item.id &&
                                  onChangeStatus(item.id, item.status)
                                }
                                checked={item.status == "A" ? true : false}
                                name="status"
                              />
                            }
                            label={` ${
                              item.status == "A" ? "Activated" : "Deactivated"
                            }`}
                          />
                        </FormGroup>
                      </div>
                    </div>
                  }
                  secondary={
                    <>
                      <p>Email: {item.email}</p>

                      <p>Mobile: {item.mobile}</p>
                      <p>Department: {item.departmentName}</p>
                      {item.dob && <p>DOB: {item.dob}</p>}
                      <p>Joining Date: {formatDate(item.joiningDate)}</p>
                    </>
                  }
                />
              </ListItem>
              {pageData.length - 1 !== index && (
                <Divider variant="inset" component="li" />
              )}
            </>
          ))}
      </List>
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
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
  );
};

export default memo(EmployeeListView);
