import React, { useEffect, useState } from "react";
import { formatDate } from "../../common/utill/utill";
import { IUser } from "../../model/userModel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
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
  const [anchorEl, setAnchorEl] = useState<(HTMLElement | null)[]>(
    new Array(actualDataLength).fill(null)
  );
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
    <div className="employee-grid-container" ref={ref} onScroll={handleScroll}>
      <Grid container spacing={2} alignItems={"center"}>
        {pageData &&
          pageData.map((item: IUser, index: number) => (
            <Grid item lg={4}>
              <Card sx={{ height: "550px" }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="300px"
                    image={item.profilePicture}
                    alt={item.name}
                  />
                  <CardContent sx={{}}>
                    <div className="d-flex justify-content-between">
                      <Typography gutterBottom variant="h5" component="div">
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
                            Edit {item.id}
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
                    <p>Email: {item.email}</p>
                    <p>Department: {item.departmentName}</p>
                    <p>Mobile: {item.mobile}</p>
                    {item.dob && <p>DOB: {item.dob}</p>}
                    <p>Joining Date: {formatDate(item.joiningDate)}</p>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>

      {isLoading && <h1 className="text-center mt-4">Loading............</h1>}
      {pageData && pageData.length === actualDataLength && (
        <h1 className="text-center mt-4">No More Data</h1>
      )}
    </div>
  );
};

export default EmployeeGridView;
