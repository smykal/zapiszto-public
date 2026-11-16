import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import IUser from "../../../types/user.type";
import Modal from "../../../constants/Modal";
import { LanguageMenu } from "../../language/LanguageMenu";
import UpdatePassword from "../crud/UpdatePassword";
import DeleteAccount from "../crud/DeleteAccount";
import LogoutButton from "../crud/LogoutButton";

interface Props {
  currentUser: IUser;
  logOut: () => void;
}

const ProfileSettings: React.FC<Props> = ({ currentUser, logOut }) => {
  const { t, i18n } = useTranslation("global");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  return (
    <div className="center">
      <p>{t("profile.profile_name")} &nbsp; {currentUser.username} </p>
      <p>{t("profile.email")} &nbsp; {currentUser.email} </p>
      <p>{t("profile.language")} &nbsp; {i18n.language} </p>

      <button
        onClick={() => setShowLanguageModal(true)}
        className="field width_15rem"
      >
        {t("buttons.change_language")}
      </button>

      <button
        onClick={() => setShowPasswordModal(true)}
        className="field width_15rem"
      >
        {t("buttons.update_password")}
      </button>

      <DeleteAccount />
      <LogoutButton logOut={logOut} />

      {/* Modals */}
      <Modal
        show={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title={t("navigation.select_language")}
      >
        <LanguageMenu />
      </Modal>

      <Modal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Update Password"
      >
        <UpdatePassword />
      </Modal>
    </div>
  );
};

export default ProfileSettings;
