import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import SchoolIcon from '@mui/icons-material/School';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import person  from '../../assets/user.png'
import logo  from '../../assets/logo.png'
import { useSelector,useDispatch } from "react-redux";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const {userInfo} =useSelector((state)=>state.auth)

  const isNonMobile = useMediaQuery("(min-width:600px)");


  return (
    <Box
    className="sidebar"
    
    sx={{
   
        
      "& .pro-sidebar-inner": {
        background: `${colors.primary[400]} !important`,
      },
      "& .pro-icon-wrapper": {
        backgroundColor: "transparent !important",
      },
      "& .pro-inner-item": {
        padding: "5px 35px 5px 20px !important",
      },
      "& .pro-inner-item:hover": {
        color: "#868dfb !important",
      },
      "& .pro-menu-item.active": {
        color: "#6870fa !important",
      },
    }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">

          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
           <img
                  alt="profile-user"
                  width="130px"
                  height="50px"
                  src={logo}
                  style={{ cursor: "pointer", }}
                />
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={person}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userInfo.name} 
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Dev
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

<Typography
          variant="body1"
          align="center"
          color={colors.grey[300]}
          sx={{ margin: "auto" }}
        >
              Data
            </Typography>
            <Item
              title="Elèves"
              to="/Eleves"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}Elèves
            />
           {isCollapsed &&     <Typography
          variant="body1"
          align="center"
          color={colors.grey[300]}
          sx={{ margin: "auto" }}
        >
              Elèves
            </Typography>}
            <Item
              title="Parents"
              to="/Parents"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}Elèves
            />
           {isCollapsed &&     <Typography
          variant="body1"
          align="center"
          color={colors.grey[300]}
          sx={{ margin: "auto" }}
        >
              Parents
            </Typography>}
            <Item
              title="Enseignants"
              to="/Enseignants"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />    
             {isCollapsed &&      <Typography
            variant="body1"
            align="center"
            color={colors.grey[300]}
            sx={{ margin: "auto" }}
          >
            Enseignants
          </Typography>}
            <Item
              title="Informations générale de site"
              to="/InfoGenrale"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                      {isCollapsed &&        <Typography
          variant="body1"
          align="center"
          color={colors.grey[300]}
          sx={{ margin: "auto" }}
        >
          Info
        </Typography>}
       <Item
              title="Categories"
              to="/Categories"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                {isCollapsed &&     <Typography
          variant="body1"
          align="center"
          color={colors.grey[300]}
          sx={{ margin: "auto" }}
        >
            Catégories
          </Typography>}
            <Item
              title="Formations"
              to="/Formations"
              icon={<SchoolIcon />}
              selected={selected}
              setSelected={setSelected}
            />
        {isCollapsed && <Typography
          variant="body1"
          align="center"
          color={colors.grey[300]}
          sx={{ margin: "auto" }}
        >
            Formations
          </Typography>}
          </Box>
        </Menu>
      </ProSidebar>
     
    </Box>
  );
};

export default Sidebar;