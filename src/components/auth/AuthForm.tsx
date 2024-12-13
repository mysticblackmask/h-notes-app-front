import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import classes from "./AuthForm.module.scss";
import { Link, useLocation } from "react-router-dom";
import loginWallpaper from "../../img/login.svg";
import { MainButton } from "../ui/MainButton";
import { ProgressBar } from "../ui/Progressbar";
import { regex } from "../../constants/regex";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Heading } from "../ui/Heading";
import { login, regist } from "../../apis/auth";
import { useDispatch } from "react-redux";
import { handleLogin } from "../../store/reducers/auth";
import { useIsLogin } from "../../hooks/useLogin";
import { errorMessage, successMessage } from "../../constants/notify";

type Inputs = {
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly password: string;
};

export const AuthForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  useIsLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const locationRegister = location.pathname === "/register";
  const [isLoading, setIsLoading] = useState(false);
  let url = locationRegister ? "/notesapp/register/" : "/notesapp/login/";
  const dispatch = useDispatch();

  const submitRegister: SubmitHandler<Inputs> = (formData) => {
    if (locationRegister) {
      setIsLoading(true);
      regist(formData.name, formData.surname, formData.email, formData.password)
        .then((res) => {
          alert(res.data.message);
          navigate("/login");
        })
        .catch((err) => {
          if (err.response.data.username)
            errorMessage(err.response.data.username);
          else errorMessage(err.response.data.email);
        });
    } else {
      setIsLoading(true);
      login(formData.email, formData.password)
        .then((res) => {
          successMessage("Welcome!");
          dispatch(handleLogin());
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          navigate("/");
        })
        .catch((err) => errorMessage(err.response.data.error));
    }
    setIsLoading(false);
  };

  if (locationRegister) {
    return (
      <div className={classes.authForm}>
        <form onSubmit={handleSubmit(submitRegister)} className={classes.form}>
          {isLoading && <ProgressBar />}
          <Heading paddingBottom={true} title="Create new account!" />
          <div className={classes.rowFormControl}>
            <div className={classes.formControl}>
              <label htmlFor="name">Name</label>
              <input
                {...register("name", {
                  required: true,
                  minLength: 2,
                  maxLength: 20,
                })}
                autoComplete="off"
                id="name"
                placeholder="Your name"
                type="text"
              />
              {errors.name && <ErrorMessage title="Name is required" />}
            </div>

            <div className={classes.formControl}>
              <label htmlFor="surname">Surname</label>
              <input
                autoComplete="off"
                id="surname"
                placeholder="Your surname"
                type="text"
                {...register("surname", {
                  required: true,
                  minLength: 2,
                  maxLength: 20,
                })}
              />
              {errors.surname && <ErrorMessage title="Surname is required" />}
            </div>
          </div>
          <div className={classes.formControl}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="Your email"
              type="email"
              {...register("email", {
                required: true,
                minLength: 5,
                maxLength: 40,
                pattern: regex,
              })}
            />
            {errors.email && <ErrorMessage title="Email is invalid" />}
          </div>
          <div className={classes.formControl}>
            <label htmlFor="password">Password</label>
            <div className={classes.passwordInput}>
              <input
                autoComplete="off"
                id="password"
                placeholder="Your password"
                type={isHiddenPassword ? "password" : " text"}
                {...register("password", {
                  required: true,
                  minLength: 8,
                  maxLength: 25,
                })}
              />
              <button
                onClick={() => setIsHiddenPassword((p) => !p)}
                type="button"
                className={classes.passwordToggleButton}
              >
                {isHiddenPassword ? "Show" : "Hide"} password
              </button>
            </div>
            {errors.password && (
              <ErrorMessage title="Password is invalid, min. 8 letters" />
            )}
          </div>

          <Link className={classes.loginLink} to="/login">
            Do you have an account? Log in
          </Link>

          <MainButton
            type="submit"
            title={`${isLoading ? "Sending" : "Create account"}`}
          />
        </form>
        <div className={classes.features}>
          <img src={loginWallpaper} alt="login" />
        </div>
      </div>
    );
  }

  return (
    <div className={classes.authForm}>
      <form onSubmit={handleSubmit(submitRegister)} className={classes.form}>
        {isLoading && <ProgressBar />}
        <Heading paddingBottom={true} title="Login to your account!" />
        <div className={classes.formControl}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="Your email"
            type="email"
            {...register("email", {
              required: true,
              minLength: 5,
              maxLength: 40,
              pattern: regex,
            })}
          />
          {errors.email && <ErrorMessage title="Email is invalid" />}
        </div>
        <div className={classes.formControl}>
          <label htmlFor="password">Password</label>
          <div className={classes.passwordInput}>
            <input
              id="password"
              placeholder="Your password"
              type={isHiddenPassword ? "password" : " text"}
              {...register("password", {
                required: true,
                minLength: 8,
                maxLength: 25,
              })}
            />
            <button
              onClick={() => setIsHiddenPassword((p) => !p)}
              type="button"
              className={classes.passwordToggleButton}
            >
              {isHiddenPassword ? "Show" : "Hide"} password
            </button>
          </div>
          {errors.password && (
            <ErrorMessage title="Password is invalid, min. 8 letters" />
          )}
        </div>

        <Link className={classes.loginLink} to="/register">
          You don't have an account? Register
        </Link>

        <MainButton type="submit" title={isLoading ? "Sending" : "Log in"} />
      </form>
      <div className={classes.features}>
        <img src={loginWallpaper} alt="login" />
      </div>
    </div>
  );
};
