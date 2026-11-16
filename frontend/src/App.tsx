import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./common/Axios-interceptor";
import { LanguageMenu } from "./components/language/LanguageMenu";
import { useTranslation } from "react-i18next";
import AuthService from "./services/auth.service";
import IUser from './types/user.type';
import Login from "./components/login/Login";
import ResetPassword from "./components/login/ResetPassword";
import Register from "./components/register/Register";
import Home from "./components/home/home.component";
import Profile from "./components/profile/profile.component";
import BoardUser from "./components/board/board-user.component";
import BoardModerator from "./components/board/board-moderator.component";
import BoardAdmin from "./components/board/board-admin.component";
import BodyParams from "./components/bodyParams";
import Training from "./components/workbooks";
import Dictionaries from "./components/dictionaries";
import Programs from "./components/viewTrainer/programs/Programs";
import Clients from "./components/viewTrainer/clients/Clients";
import Cards from "./components/cards/Cards";
import Privacy from "./constants/Privacy";
import Terms from "./constants/Terms";
import EventBus from "./common/EventBus";
import OAuthRedirect from "./components/auth/OAuthRedirect";
import useOAuthListener from "./hooks/useOAuthListner";
import i18next from "i18next";

const savedLanguage = localStorage.getItem("language");
if (savedLanguage) {
  i18next.changeLanguage(savedLanguage);
} else {
  i18next.changeLanguage("en");
}

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showTrainerBoard, setShowTrainerBoard] = useState(false);
  const [showUserBoard, setShowUserBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const navigate = useNavigate();
  const { t } = useTranslation("global");

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      updateUserState(user);
    }
    EventBus.on("logout", logOut);
    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const updateUserState = (user: IUser) => {
    if (user && user.roles) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
      setShowTrainerBoard(user.roles.includes("ROLE_TRAINER"));
      setShowUserBoard(user.roles.includes("ROLE_USER"));
    }
  };

  useOAuthListener({
    updateUserState,
  });

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    setShowAdminBoard(false);
    setShowUserBoard(false);
    setShowTrainerBoard(false);
    setShowModeratorBoard(false);
    navigate("/home");
  };

  return (
    <div>
      <nav className="navbar">
        {!showUserBoard && !showTrainerBoard && (
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to={"/"} className="nav-link">
                <img src="/images/navigation/zapisz_to.svg" alt="zapiszTo" />
              </Link>
            </li>
          </ul>
        )}


        {showModeratorBoard && (
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderator Board
              </Link>
            </li>
          </ul>
        )}

        {showAdminBoard && (
          <>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/dictionaries"} className="nav-link">
                  <img src="/images/navigation/dictionaries.svg" alt={t("navigation.dictionaries")} />
                  <span className="nav-text">{t("navigation.dictionaries")}</span>
                </Link>
              </li>
            </ul>
          </>
        )}

        {showUserBoard && (
          <>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to={"/cards"} className="nav-link">
                  <img src="/images/navigation/zapisz_to.svg" alt={t("navigation.cards")} />
                  <span className="nav-text nav-text-right">{t("navigation.cards")}</span>
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to={"/dictionaries"} className="nav-link">
                  <img src="/images/navigation/dictionaries.svg" alt={t("navigation.dictionaries")} />
                  <span className="nav-text">{t("navigation.dictionaries")}</span>
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to={"/bodyParams"} className="nav-link">
                  <img src="/images/navigation/body_params.svg" alt={t("navigation.body_params")} />
                  <span className="nav-text">{t("navigation.body")}</span>
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to={"/training"} className="nav-link">
                  <img src="/images/navigation/training.svg" alt={t("navigation.training")} />
                  <span className="nav-text">{t("navigation.training")}</span>
                </Link>
              </li>
            </ul>
          </>
        )}

        {showTrainerBoard && (
          <>
            <ul className="navbar-nav">

              <li className="nav-item">
                <Link to={"/dictionaries"} className="nav-link">
                  <img src="/images/navigation/dictionaries.svg" alt={t("navigation.dictionaries")} />
                  <span className="nav-text">{t("navigation.dictionaries")}</span>
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to={"/clients"} className="nav-link">
                  <img src="/images/navigation/clients.svg" alt={t("navigation.clients")} />
                  <span className="nav-text">{t("navigation.clients")}</span>
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to={"/programs"} className="nav-link">
                  <img src="/images/navigation/programs.svg" alt={t("navigation.programs")} />
                  <span className="nav-text">{t("navigation.programs")}</span>
                </Link>
              </li>
            </ul>

          </>
        )}

        {currentUser ? (

          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                <div className="circle" >
                  {currentUser?.username?.charAt(0).toUpperCase() || "?"}
                </div>
                <span className="nav-text nav-text-left">{currentUser.username}</span>
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to={"/home"} className="nav-link" onClick={logOut}>
                <img src="/images/navigation/log_out.svg" alt="zapiszTo" />
              </Link>
            </li> */}
          </ul>
        ) : 
        // (
        //   <ul className="navbar-nav ml-auto">
        //     <li className="nav-item">
        //       <Link to={"/login"} className="nav-link">
        //         <img src="/images/navigation/log_in.svg" alt="zapiszTo" />
        //         <span className="nav-text">{t("navigation.log_in")}</span>
        //       </Link>
        //     </li>
        //     <li className="nav-item">
        //       <Link to={"/register"} className="nav-link">
        //         <img src="/images/navigation/register.svg" alt="zapiszTo" />
        //         <span className="nav-text">{t("navigation.sign_in")}</span>
        //       </Link>
        //     </li>
        //     <li >
        //       <LanguageMenu />
        //     </li>
        //   </ul>
        // )
        <LanguageMenu />
        }
      </nav>

      <div>
        <Routes>
          <Route path="/" element={<Home updateUserState={updateUserState} />} />
          <Route path="/home" element={<Home updateUserState={updateUserState} />} />
          <Route path="/login" element={<Login updateUserState={updateUserState} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile logOut={logOut} />} />  {/* Pass logOut here */}
          <Route path="/user" element={<BoardUser />} />
          <Route path="/mod" element={<BoardModerator />} />
          <Route path="/admin" element={<BoardAdmin />} />
          <Route path="/bodyParams" element={<BodyParams />} />
          <Route path="/training" element={<Training />} />
          <Route path="/dictionaries" element={<Dictionaries />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="/oauth2/redirect/*" element={<OAuthRedirect updateUserState={updateUserState} />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
