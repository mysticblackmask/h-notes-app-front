import React, { useContext, useEffect, useState } from "react";
import classes from "./Nav.module.scss";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { NotesContext } from "../../context/NoteContext";
import {
  ArrowForward,
  Add,
  FormatListBulleted,
  DeleteOutline,
  FavoriteBorder,
  Logout,
  LightModeOutlined,
  DarkModeOutlined,
  LoginOutlined,
} from "@mui/icons-material";
import { Backdrop } from "../ui/Backdrop";
import { NavigationLink } from "./NavLink";
import sygnetLogo from "../../img/sygnet.svg";
import { useToggle } from "../../hooks/useToggle";
import { Typography } from "@mui/material";
import { logout } from "../../apis/auth";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { handleLogin, handleLogout } from "../../store/reducers/auth";
import { successMessage } from "../../constants/notify";

const getTheme = () => {
  const theme = localStorage.getItem("theme");
  return {
    localTheme: theme ? JSON.parse(theme) : null,
  };
};

interface navLinkDataType {
  title: string;
  url: string;
  length?: number;
  icon: JSX.Element;
}

export const Nav = () => {
  const id = useLocation();
  const [hiddenNav, setHiddenNav] = useToggle();
  const { notes, trashNotes, favouriteNotes } = useContext(NotesContext);
  const { localTheme: themeState } = getTheme();
  const [theme, setTheme] = useToggle(themeState);
  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      dispatch(handleLogin());
    }
  }, []);
  const is_login = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const log_out = () => {
    logout()
      .then((res) => {
        successMessage(res.data.message);
      })
      .catch((err) => console.log(err.response.data));
    dispatch(handleLogout());
    navigate("/");
    localStorage.removeItem("refresh_token");
  };
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
    theme
      ? document.body.classList.add("light-mode")
      : document.body.classList.remove("light-mode");
  }, [theme]);
  const navLinkData: navLinkDataType[] = [
    {
      title: "Create Note",
      url: "/create",
      icon: <Add className={classes.icon} />,
    },
    {
      title: "Notes",
      url: "/notes",
      length: notes.length,
      icon: <FormatListBulleted className={classes.icon} />,
    },
    {
      title: "Trash",
      url: "/trash",
      length: trashNotes.length,
      icon: <DeleteOutline className={classes.icon} />,
    },
    {
      title: "Favourite",
      url: "/favourite",
      length: favouriteNotes.length,
      icon: <FavoriteBorder className={classes.icon} />,
    },
  ];
  return (
    <>
      <nav
        onDoubleClick={setHiddenNav}
        className={`${classes.nav} ${!hiddenNav ? classes.hiddenNav : ""}`}
      >
        <button
          onClick={setHiddenNav}
          className={`${classes.hideButton} ${
            !hiddenNav ? classes.toggledArrow : ""
          }`}
        >
          <ArrowForward
            className={`${!hiddenNav ? classes.toggledArrow : ""}`}
          />
        </button>
        <div className={classes.navWrapper}>
          <NavLink to="/" className={classes.logo}>
            {!hiddenNav ? (
              <img src={sygnetLogo} alt="sygnetMichalik" />
            ) : (
              <div className={classes.fullLogo}>
                <img src={sygnetLogo} alt="sygnetMichalik" />
                <h2>Notes App</h2>
              </div>
            )}
          </NavLink>
          <div className={classes.links}>
            {is_login ? (
              <>
                {navLinkData.map((link: navLinkDataType, index: number) => (
                  <NavigationLink
                    key={index}
                    hiddenNav={!hiddenNav}
                    title={link.title}
                    href={link.url}
                    icon={link.icon}
                    tooltipTitle={
                      <Typography fontSize={11}>{link.title}</Typography>
                    }
                  />
                ))}
                <NavigationLink
                  onClick={log_out}
                  hiddenNav={!hiddenNav}
                  title="Logout"
                  href="/login"
                  icon={<Logout className={classes.icon} />}
                  tooltipTitle={<Typography fontSize={11}>Logout</Typography>}
                />
              </>
            ) : (
              <NavigationLink
                hiddenNav={!hiddenNav}
                title="Login"
                href="/login"
                icon={<LoginOutlined className={classes.icon} />}
                tooltipTitle={<Typography fontSize={11}>Login</Typography>}
              />
            )}
            <NavigationLink
              onClick={setTheme}
              hiddenNav={!hiddenNav}
              title="Mode"
              href={id.pathname}
              notLink={true}
              icon={
                theme ? (
                  <LightModeOutlined className={classes.icon} />
                ) : (
                  <DarkModeOutlined className={classes.icon} />
                )
              }
              tooltipTitle={
                <Typography fontSize={11}>
                  {theme ? "Light" : "Dark"}
                </Typography>
              }
            />
          </div>
        </div>
      </nav>
      {hiddenNav && <Backdrop onHideNav={setHiddenNav} />}
    </>
  );
};
