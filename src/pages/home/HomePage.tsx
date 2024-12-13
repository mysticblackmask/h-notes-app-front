import { Link } from "react-router-dom";
import header from "../../img/header.svg";
import { MainButton } from "../../components/ui/MainButton";
import { SecondaryButton } from "../../components/ui/SecondaryButton";
import classes from "../sass/HomeLayout.module.scss";
import { Wrapper } from "../../components/ui/Wrapper";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const HomePage = () => {
  const is_login = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <Wrapper>
      <div className={classes.header}>
        <div className={classes.headerModules}>
          <div>
            <h1>Best notes app for everyone!</h1>
            <p>Create your first Note</p>
            <div className={classes.buttons}>
              {is_login && (
                <Link to="/create">
                  <MainButton title="Get started" />
                </Link>
              )}
              {!is_login && (
                <Link to="/register">
                  <SecondaryButton title="Log in" />
                </Link>
              )}
            </div>
          </div>
          <img src={header} alt="header" />
        </div>
      </div>
    </Wrapper>
  );
};

export default HomePage;
