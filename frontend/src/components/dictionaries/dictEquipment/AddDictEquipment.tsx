import React, { useState } from "react";
import { DictEquipment, NewDictEquipment } from "../../../types/types";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DictEquipmentService from '../../../services/dict/DictEquipmentService';
import * as Yup from 'yup';
import { withTranslation } from "react-i18next";
import { LANGUAGES } from "../../../translations/Languages";

type Props = {
    dictEquipment: DictEquipment[];
    onAddEquipment: (newEquipment: DictEquipment) => void;
    t: any;
};

const AddDictEquipment: React.FC<Props> = ({ dictEquipment, onAddEquipment, t }) => {
    const [selectedLanguage, setSelectedLanguage] = useState("en");

    const postDictEquipment = (values: { newDictEquipmentName: string }) => {
        const newDictEquipment: NewDictEquipment = {
            id: crypto.randomUUID(),
            name: { [selectedLanguage]: values.newDictEquipmentName }
        };
        DictEquipmentService.postDictEquipmentPerUser(newDictEquipment)
            .then(response => {
                const addedEquipment: DictEquipment = {
                    id: crypto.randomUUID(),
                    dict: "PER_USER",
                    dict_id: newDictEquipment.id,
                    name: values.newDictEquipmentName
                };
                onAddEquipment(addedEquipment);
            })
            .catch(error => {
                console.error('Error adding equipment:', error);
            });
    };

    return (
        <div>
            <Formik
                initialValues={{
                    newDictEquipmentName: '',
                }}
                validationSchema={Yup.object({
                    newDictEquipmentName: Yup.string()
                        .required('This field is required')
                })}
                onSubmit={(values, { setSubmitting }) => {
                    postDictEquipment(values);
                    setSubmitting(false);
                }}
            >
                {formik => (
                    <Form>
                        <div>
                            <div>
                                <label htmlFor="language">
                                    <select
                                        id="language"
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className="field" >
                                        {LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <ErrorMessage name="newDictEquipmentName" component="div" className="error" />
                                <Field name="newDictEquipmentName" type="text" className="field" placeholder={t("table.name")} />
                            </div>

                            <span className="form-field-container">
                                <div style={{ height: "25px" }} />
                                <button type="submit" disabled={formik.isSubmitting} className="field">{t("buttons.add")}</button>
                            </span>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default withTranslation("global")(AddDictEquipment);
