"use client";

import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import Logout from "../components/Logout";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import Modal from "@mui/material/Modal";
import PollIcon from "@mui/icons-material/Poll";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WalletIcon from "@mui/icons-material/Wallet";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { user } = useAuth();
  const [mopen, msetOpen] = React.useState(false);
  const handleOpen = () => msetOpen(true);
  const handleClose = () => msetOpen(false);
  const [open, setOpen] = React.useState(true);

  const identity = user?.identities?.[0]?.identity_data
  

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }} className="wrapper">
      <CssBaseline />
      <AppBar position="fixed" open={open}
      style={{
        backgroundColor:
          theme.palette.mode === "dark" ? "#2e2e2ee3" : "white",
          boxShadow:"none",
          borderBottom:theme.palette.mode === "dark" ? "1px solid black" : "1px solid #e0e0e0"
      }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
      
            style={{
              backgroundColor:
                theme.palette.mode === "dark" ? "#2e2e2ee3" : "#a1a1a1e3",
            }}
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <div className="boxflex">
            <div className="logo">
              <img src="./logo.png" />
            </div>
            <div>
              {identity?.picture ? (
                <Avatar
                  alt={"ffdf"}
                  src={identity?.picture}
                  onClick={handleOpen}
                />
              ) : (
                <Avatar
                  sx={{ bgcolor: deepPurple[500] }}
                  style={{ listStyle: "none" }}
                  onClick={handleOpen}
                >
                  {identity?.email
                    .slice(0, 1)
                    .toUpperCase()}
                </Avatar>
              )}
            </div>

            <Modal
              keepMounted
              open={mopen}
              onClose={handleClose}
              aria-labelledby="keep-mounted-modal-title"
              aria-describedby="keep-mounted-modal-description"
              className="modalbox"
            >
              <Box
                className="modalinnner"
                style={{
                  textDecoration: "none",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#1d1d1d" : "white",
                  border:
                    theme.palette.mode === "dark"
                      ? "2px solid #333"
                      : "2px solid #a8a4a44a",
                }}
              >
                <div className="modalheader">
                  <div className="profile">
                    {identity?.picture ? (
                      <Avatar
                        alt={"ffdf"}
                        src={identity?.picture}
                        sx={{ width: 80, height: 80 }}
                      />
                    ) : (
                      <Avatar
                        style={{ listStyle: "none" }}
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: deepPurple[500],
                          fontSize: "35px",
                        }}
                      >
                        {identity?.email
                          .slice(0, 1)
                          .toUpperCase()}
                      </Avatar>
                    )}
                  </div>
                </div>
                <div className="modalbody">
                  <div className="boxdetails">
                    <div className="inputname">
                      <Typography
                        id="keep-mounted-modal-title"
                        variant="h6"
                        component="h2"
                        style={{
                          textDecoration: "none",
                          color:
                            theme.palette.mode === "dark" ? "white" : "black",
                        }}
                      >
                        Name
                      </Typography>
                    </div>
                    <div
                      className="inputbox"
                      style={{
                        background:
                          theme.palette.mode === "dark" ? "#333" : "#a8a4a44a",
                      }}
                    >
                      <Typography
                        id="keep-mounted-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        {user?.user_metadata?.name
                          ? user?.user_metadata?.name
                          : "User Name"}
                      </Typography>
                    </div>
                  </div>

                  <div className="boxdetails">
                    <div className="inputname">
                      <Typography
                        id="keep-mounted-modal-title"
                        variant="h6"
                        component="h2"
                        style={{
                          textDecoration: "none",
                          color:
                            theme.palette.mode === "dark" ? "white" : "black",
                        }}
                      >
                        Email
                      </Typography>
                    </div>
                    <div
                      className="inputbox"
                      style={{
                        background:
                          theme.palette.mode === "dark" ? "#333" : "#a8a4a44a",
                      }}
                    >
                      <Typography
                        id="keep-mounted-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        {user?.identities && user.identities.length > 0
                          ? identity?.full_name ||
                          identity?.email
                          : "User"}
                      </Typography>
                    </div>
                  </div>

                  <div className="boxdetails">
                    <div className="inputname">
                      <Typography
                        id="keep-mounted-modal-title"
                        variant="h6"
                        component="h2"
                        style={{
                          textDecoration: "none",
                          color:
                            theme.palette.mode === "dark" ? "white" : "black",
                        }}
                      >
                        Mode
                      </Typography>
                    </div>
                    <ThemeToggle />
                  </div>
                  <Logout />
                </div>
              </Box>
            </Modal>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            "Overview",
            "History",
            "Transactions",
            "Category",
            "Budget",
            "Summary",
          ].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <>
                <Link
                  style={{
                    textDecoration: "none",
                    color: theme.palette.mode === "dark" ? "white" : "gray",
                  }}
                  href={
                    text === "Overview"
                      ? "/"
                      : text === "Transactions"
                      ? "/transactions"
                      : text === "Category"
                      ? "/category"
                      : text === "Budget"
                      ? "/budget"
                      : text === "Summary"
                      ? "/summary"
                      : text === "History"
                      ? "/history"
                      : "#"
                  }
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      {index === 0 ? (
                        <PollIcon />
                      ) : index === 1 ? (
                        <WorkHistoryIcon />
                      ) : index === 2 ? (
                        <AssuredWorkloadIcon />
                      ) : index === 3 ? (
                        <CategoryIcon />
                      ) : index === 4 ? (
                        <WalletIcon />
                      ) : index === 5 ? (
                        <ReceiptIcon />
                      ) : null}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </Link>
              </>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
