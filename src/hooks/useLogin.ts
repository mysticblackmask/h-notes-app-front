import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleLogin } from "../store/reducers/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { isTokenExpired, refreshToken } from "../apis/auth";

export const useIsLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useEffect(() => {
    const is_login = localStorage.getItem("access_token");
    if (is_login) {
      dispatch(handleLogin());
      navigate("/");
    }
  }, []);
};

export const useIsMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useEffect(() => {
    const is_login = localStorage.getItem("access_token");
    if (!is_login || isTokenExpired(is_login)) {
      const refresh = refreshToken();
      if (!refresh) {
        if (pathname !== "/") navigate("/login");
      }
    }
    if (is_login) {
      dispatch(handleLogin());
    } else {
      if (pathname !== "/") navigate("/login");
    }
  }, []);
};
