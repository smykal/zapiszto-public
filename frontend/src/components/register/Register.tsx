import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useTranslation } from "react-i18next";
import RegisterBody from "./RegisterBody";


const Register: React.FC = () => {
    const { t } = useTranslation("global");

    return (
        <div>
            <Tabs defaultIndex={0}>
                <TabList>
                    <Tab>
                        <span className="register-tab-user">{t("login.user")}</span>
                    </Tab>
                    <Tab>
                        <span className="register-tab-trainer">{t("login.trainer")}</span>
                    </Tab>
                </TabList>

                <TabPanel>
                    <RegisterBody role="user" t={t} />
                </TabPanel>
                <TabPanel>
                    <RegisterBody role="trainer" t={t} />
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default Register;
