import React, { useState, useEffect } from "react";
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import ShowDictExercises from './dictExercises/ShowDictExercises'
import ShowDictQuantityTypes from './dictQuantityType/ShowDictQuantityType'
import ShowDictUnits from "./dictUnits/ShowDictUnits";
import ShowDictCategory from "./dictCategory/ShowDictCategory";
import ShowDictBodyTest from "./dictBodyTests/ShowDictBodyTest";
import ShowDictEquipment from "./dictEquipment/ShowDictEquipment";
import ShowDictBodyParam from "./dictBodyParams/ShowDictBodyParam";
import ShowDictTagsCategory from "./dictTagsCategory/ShowDictTagsCategory";
import ShowDictTags from "./dictTags/ShowDictTags";
import { useTranslation } from "react-i18next";
import AuthService from "../../services/auth.service";
import IUser from '../../types/user.type';

const Training = () => {
    const [activeDictTabIndex, setActiveDictTabIndex] = useState(0);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const { t } = useTranslation("global");

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }

        const lastActiveDictTabIndex = localStorage.getItem('lastActiveDictTabIndex');
        if (lastActiveDictTabIndex !== null) {
            setActiveDictTabIndex(parseInt(lastActiveDictTabIndex, 10));
        }
    }, []); // Empty dependency array to run only once after initial render

    const handleTabSelect = (index: number) => {
        setActiveDictTabIndex(index);
        localStorage.setItem('lastActiveDictTabIndex', index.toString());
    };

    const hasRole = (role: string): boolean => {
        return currentUser?.roles?.includes(role) ?? false;
    };

    return (
        <div className='card-container'>
            <Tabs selectedIndex={activeDictTabIndex} onSelect={handleTabSelect} className={"center"} style={{ display: 'block' }}>
                <TabList>
                    <Tab>{t("dictionaries.dict_category")}</Tab>
                    <Tab>{t("dictionaries.dict_exercise")}</Tab>
                    {(hasRole("ROLE_TRAINER") || hasRole("ROLE_ADMIN")) && (
                        <Tab>{t("dictionaries.dict_quantity_type")}</Tab>
                    )}
                    {(hasRole("ROLE_TRAINER") || hasRole("ROLE_ADMIN")) && (
                        <Tab>{t("dictionaries.dict_units")}</Tab>
                    )}
                    {(hasRole("ROLE_TRAINER") || hasRole("ROLE_ADMIN")) && (
                        <Tab>{t("dictionaries.dict_body_test")}</Tab>
                    )}
                    {(hasRole("ROLE_TRAINER") || hasRole("ROLE_ADMIN")) && (
                        <Tab>{t("dictionaries.dict_equipment")}</Tab>
                    )}
                    {(hasRole("ROLE_ADMIN")) && (
                        <Tab>{t("dictionaries.dict_body_param")}</Tab>
                    )}
                    {(hasRole("ROLE_ADMIN")) && (
                        <Tab>{t("dictionaries.dict_tags_categories")}</Tab>
                    )}
                    {(hasRole("ROLE_ADMIN")) && (
                        <Tab>{t("dictionaries.dict_tags")}</Tab>
                    )}
                </TabList>
                <TabPanel><ShowDictCategory /></TabPanel>
                <TabPanel><ShowDictExercises /></TabPanel>
                {(hasRole("ROLE_TRAINER") || hasRole("ROLE_ADMIN")) && (
                    <TabPanel><ShowDictQuantityTypes /></TabPanel>
                )}
                {(hasRole("ROLE_TRAINER") || hasRole("ROLE_ADMIN")) && (
                    <TabPanel><ShowDictUnits /></TabPanel>
                )}
                {(hasRole("ROLE_TRAINER") || hasRole("ROLE_ADMIN")) && (
                    <TabPanel><ShowDictBodyTest /></TabPanel>
                )}
                {(hasRole("ROLE_TRAINER") || hasRole("ROLE_ADMIN")) && (
                    <TabPanel><ShowDictEquipment /></TabPanel>
                )}
                {(hasRole("ROLE_ADMIN")) && (
                    <TabPanel><ShowDictBodyParam /></TabPanel>
                )}
                {(hasRole("ROLE_ADMIN")) && (
                    <TabPanel><ShowDictTagsCategory /></TabPanel>
                )}
                {(hasRole("ROLE_ADMIN")) && (
                    <TabPanel><ShowDictTags /></TabPanel>
                )}
            </Tabs>
        </div>
    );
};

export default Training;
