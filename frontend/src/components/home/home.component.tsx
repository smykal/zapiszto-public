import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WhatAppOffers from "./body/WhatAppOffers";
import LoginAndRegister from "./loginAndRegister/LoginAndRegister";
import IUser from "../../types/user.type";
import Cards from "../cards/Cards";
import AuthService from "../../services/auth.service";

type Props = {
  updateUserState: (user: IUser) => void;
};

const Home: React.FC<Props> = ({ updateUserState }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      updateUserState(currentUser);
      if (currentUser.roles && currentUser.roles.includes("ROLE_USER")) {
        navigate("/training");
      } else if (currentUser.roles && currentUser.roles.includes("ROLE_TRAINER")) {
        navigate("/programs");
      } else {
        navigate("/profile");
      }
    }
  }, [navigate, updateUserState]);
  return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          padding: "2rem"
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <LoginAndRegister updateUserState={updateUserState} />
        </div>

        <div style={{ width: "90%" }}>
          <WhatAppOffers />
        </div>

        <div style={{ width: "90%" }}>
          <Cards />
          {/* <Examples /> */}
        </div>
      </div>
  );
};

export default Home;
