import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PrivacyPolicy from "./privacy/PrivacyPolicyMarkdown";
import AuthService from "../../services/auth.service";
import LanguageService from "../../services/languages";
import IUser from "../../types/user.type";
import Collapsible from "react-collapsible";
import ProfileSettings from "./settings/ProfileSettings";
import ProfileInvitations from "./invitations/ProfileInvitations";
import ProfileManual from "./manual/ProfileManual";
import TermsOfServiceMarkdown from "./terms/TermsOfServiceMarkdown";
import Spinner from "../../common/Spinner";
import CardCreate from "../cards/create/Card";
import CardView from "../cards/view/CardView";



type Props = {
  logOut: () => void;
};

const Profile: React.FC<Props> = ({ logOut }) => {
  const { t, i18n } = useTranslation("global");
  const [redirect, setRedirect] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      const user = AuthService.getCurrentUser();
      if (!user) {
        setRedirect("/home");
        return;
      }
      setCurrentUser(user);

      try {
        const res = await LanguageService.getLanguage();
        localStorage.setItem("language", res.data.languageCode);
        await i18n.changeLanguage(res.data.languageCode);
      } catch (err) {
        console.error("Error fetching user language:", err);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (redirect) return <Navigate to={redirect} />;
  if (loading || !currentUser) return <Spinner />;

  return (
    <div className="card-container">
      <Collapsible
        trigger={<div className="collapsible-element">
          <span>{t("profile.settings")}</span>
        </div>}
        open={true}
      >
        <ProfileSettings currentUser={currentUser} logOut={logOut} />
      </Collapsible>

      {currentUser?.roles?.includes('ROLE_TRAINER') && (
        <><Collapsible
          trigger={<div className="collapsible-element">
            <span>{t("profile.card_edit", "Wizytówka - edytuj")}</span>
          </div>}
          open={false}
        >
          <CardCreate />
        </Collapsible>

          <Collapsible
            trigger={<div className="collapsible-element">
              <span>{t("profile.card_view", "Wizytówka - podgląd")}</span>
            </div>}
            open={false}
          >
            <CardView />
          </Collapsible>
        </>)}

      <Collapsible
        trigger={<div className="collapsible-element">
          <span>{t("profile.invitations")}</span>
        </div>}
        open={false}
      >
        <ProfileInvitations />
      </Collapsible>

      <Collapsible
        trigger={
          <div className="collapsible-element">
            <span>{t("profile.manual")}</span>
          </div>
        }
        open={false}
      >
        <ProfileManual />
      </Collapsible>

      {/* <Collapsible
        trigger={
          <div className="collapsible-element">
            <span>{t("profile.faq", "FAQ")}</span>

          </div>
        }
        open={false}
      >
        <FrequencyAskQuestions />
      </Collapsible> */}

      <Collapsible
        trigger={
          <div className="collapsible-element">
            <span>{t("profile.privacy_policy", "Polityka prywatności")}</span>
          </div>
        }
        open={false}
      >
        <PrivacyPolicy />
      </Collapsible>

      <Collapsible
        trigger={
          <div className="collapsible-element">
            <span>{t("profile.terms_of_service", "Regulamin serwisu")}</span>
          </div>
        }
        open={false}
      >
        <TermsOfServiceMarkdown />
      </Collapsible>
    </div>
  );
};

export default Profile;
