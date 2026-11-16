import React from "react";
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { CpfType } from "../../types/types";
import Collapsible from "react-collapsible";
import ShowSingleCpf from "./showSingleCpf";
import { withTranslation } from "react-i18next";
import Spinner from "../../common/Spinner";
import { useGetCpf } from "../../services/bodyParams/BodyParamsTanstackService";


const GetCpf: React.FC<{ t: any }> = ({ t }) => {
        const { data: cpfList, isLoading, isError } = useGetCpf();

        if (isLoading) {
            return <Spinner />;
        }

        if (isError || !cpfList || cpfList.length < 3) {
            return <p>Błąd ładowania danych CPF. Spróbuj ponownie później.</p>;
        }

        const [cpfReduction, cpfRegular, cpfMass] = cpfList;

        return (
            <div>
                <Tabs>
                    <TabList>
                        <Tab>{t("body_params.cpf_reduction")}</Tab>
                        <Tab>{t("body_params.cpf_regular")}</Tab>
                        <Tab>{t("body_params.cpf_mass")}</Tab>
                    </TabList>
                    <TabPanel>
                        <ul>
                            {cpfReduction.map((item: CpfType, index: number) => (
                                <li key={index}>
                                    <Collapsible
                                        trigger={
                                            <div className="cpf-box">
                                                <span> {item.activity_level} </span>
                                            </div>
                                        }
                                    >
                                        <ShowSingleCpf param_name={item} cpfType={cpfReduction}></ShowSingleCpf>
                                    </Collapsible>
                                </li>
                            ))}
                        </ul>
                    </TabPanel>
                    <TabPanel>
                        <ul>
                            {cpfRegular.map((item: CpfType, index: number) => (
                                <li key={index}>
                                    <Collapsible
                                        trigger={
                                            <div className="cpf-box">
                                                <span> {item.activity_level} </span>
                                            </div>
                                        }
                                    >
                                        <ShowSingleCpf param_name={item} cpfType={cpfRegular}></ShowSingleCpf>
                                    </Collapsible>
                                </li>
                            ))}
                        </ul>
                    </TabPanel>
                    <TabPanel><ul>

                        {cpfMass.map((item: CpfType, index: number) => (
                            <li key={index}>
                                <Collapsible
                                    trigger={
                                        <div className="cpf-box">
                                            <span> {item.activity_level} </span>
                                        </div>
                                    }
                                >
                                    <ShowSingleCpf param_name={item} cpfType={cpfMass}></ShowSingleCpf>
                                </Collapsible>
                            </li>
                        ))}
                    </ul>
                    </TabPanel>
                </Tabs>
            </div>
        );
};

export default withTranslation("global")(GetCpf);
