import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Button,
  Typography,
  Popover,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from "react-redux";
import { ColorModeContext, tokens } from "../../theme";
import { logout } from "../../slices/authSlice";
import {
  useLogoutMutation,
  useGetMutation,
  useChangeMutation,
} from "../../slices/usersApiSlice";
import person from "../../assets/user.png";
import { formatDistanceToNow } from "date-fns";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@emotion/react";

const CustomImageToast = ({ imageSrc, message }) => (
  <div className="custom-toast">
    <img src={imageSrc} alt="Custom Toast Image" />
    <p>{message}</p>
  </div>
);

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const [logoutApiCall] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notification, setNotification] = useState([]);
  const [notificationCount, setNotificationCount] = useState(null);

  const [data, setData] = useState(0);
  const [getData, { isLoading }] = useGetMutation();
  const [update] = useChangeMutation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setNotificationCount(0);
  };

  const handleClose = async () => {
    setAnchorEl(null);
    const res = await update().unwrap();
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getHandler = async () => {
      try {
        const userData = await getData();
        setData(userData);

        setNotificationCount(userData.data.notificationsUnread.length);
        const reversedArray = [...userData.data.notifications].reverse();
        setNotification(reversedArray);
      } catch (err) {
        console.log(err);
      }
    };

    getHandler();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("addCours", (msj) => {
      setNotificationCount(notificationCount + 1);
      setNotification((prevNotifications) => [msj, ...prevNotifications]);

      toast(
        <CustomImageToast imageSrc={person} message={msj.text} />,
        {
          className: "custom-toast",
        }
      );
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [notificationCount]);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon style={{ fontSize: 25 }} />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <div>
          <Button
            aria-describedby="notification-popover"
            onClick={handleClick}
            startIcon={
              <div className="notification">
                <span className="notificationCount">
                  {notificationCount}
                </span>
                <NotificationsOutlinedIcon
                  style={{ fontSize: 25, color: colors.grey[300] }}
                />
              </div>
            }
          ></Button>
          <Popover
            id="notification-popover"
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "10px",
              },
            }}
          >
            <div style={{ width: 300 }}>
              <h6 style={{ padding: 10 }}>Notifications</h6>
              <Divider sx={{ height: 1, m: "5px" }} color={colors.grey[300]} />
              {notification.length !== 0 &&
                notification.map((notification, index) => {
                  const date = new Date(notification.createdAt);
                  const timeAgo = formatDistanceToNow(date);

                  return (
                    <div
                      className={
                        notification.read
                          ? "notificationUnread-item"
                          : "notificationUnread-item-unread"
                      }
                      key={index}
                    >
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Box display="flex" justifyContent="center" alignItems="center">
                          <img
                            alt="profile-user"
                            width="50px"
                            height="50px"
                            src={person}
                            style={{
                              cursor: "pointer",
                              borderRadius: "50%",
                            }}
                          />
                        </Box>
                        <div className="ms-3">
                          <div>{notification.text}</div>
                          <div>{timeAgo}</div>
                        </div>
                      </Box>
                    </div>
                  );
                })}
            </div>
          </Popover>
        </div>

        <IconButton>
          <Link
            to="/profile"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <PersonOutlinedIcon style={{ fontSize: 25 }} />
          </Link>
        </IconButton>
        <IconButton onClick={logoutHandler}>
          <LogoutIcon style={{ fontSize: 25 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
