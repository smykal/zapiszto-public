import React, { useState } from "react";
import Login from "../../login/Login";
import Register from "../../register/Register";
import IUser from "../../../types/user.type";
import { useTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";

type Props = {
  updateUserState: (user: IUser) => void;
};

const LoginAndRegister: React.FC<Props> = ({ updateUserState }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { t } = useTranslation("global");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
      {/* PRZYCISK OTWIERAJĄCY LOGIN */}
      <button
        onClick={() => setShowLogin(true)}
        className="field width_15rem"
      >
        {t("navigation.log_in")}
      </button>

      {/* MODAL Z LOGIN */}
      <Modal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        title={t("navigation.log_in")}
      >
        <Login updateUserState={updateUserState} />
      </Modal>

      {/* PRZYCISK OTWIERAJĄCY REGISTER */}
      <button
        onClick={() => setShowRegister(true)}
        className="field width_15rem"
      >
        {t("navigation.sign_in")}
      </button>

      {/* MODAL Z REGISTER */}
      <Modal
        show={showRegister}
        onClose={() => setShowRegister(false)}
        title={t("navigation.sign_in")}
      >
        <Register />
      </Modal>
    </div>
  );
};

export default LoginAndRegister;
