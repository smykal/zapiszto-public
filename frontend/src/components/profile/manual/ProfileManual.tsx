import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AuthService from "../../../services/auth.service";
import IUser from "../../../types/user.type";

const ProfileManual: React.FC = () => {
    const { t } = useTranslation("global");
    const [userRole, setUserRole] = useState<"trainer" | "user" | null>(null);

    useEffect(() => {
        const user: IUser | null = AuthService.getCurrentUser();
        if (user?.roles?.includes("ROLE_TRAINER")) {
            setUserRole("trainer");
        } else if (user?.roles?.includes("ROLE_USER")) {
            setUserRole("user");
        } else {
            setUserRole(null);
        }
    }, []);


    const itemStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "1rem",
        gap: "1rem",
    };

    const imageStyle: React.CSSProperties = {
        width: "3rem",
    };

    return (
        <div className="center">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {userRole === "user" && (
                    <>
                        <div style={itemStyle}>
                            <img src="/images/navigation/dictionaries.svg" alt="Dictionaries" style={imageStyle} />
                            <p>{t("profile.manual_dictionaries")}</p>
                        </div>
                        <div style={itemStyle}>
                            <img src="/images/navigation/body_params.svg" alt="Body Params" style={imageStyle} />
                            <p>{t("profile.manual_body_params")}</p>
                        </div>
                        <div style={itemStyle}>
                            <img src="/images/navigation/training.svg" alt="Training" style={imageStyle} />
                            <p>{t("profile.manual_training")}</p>
                        </div>
                    </>
                )}

                {userRole === "trainer" && (
                    <>
                        <div style={itemStyle}>
                            <img src="/images/navigation/dictionaries.svg" alt="Dictionaries" style={imageStyle} />
                            <p>{t("profile.manual_dictionaries")}</p>
                        </div>
                        <div style={itemStyle}>
                            <img src="/images/navigation/clients.svg" alt="Clients" style={imageStyle} />
                            <p>{t("profile.manual_clients")}</p>
                        </div>
                        <div style={itemStyle}>
                            <img src="/images/navigation/programs.svg" alt="Programs" style={imageStyle} />
                            <p>{t("profile.manual_programs")}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileManual;
