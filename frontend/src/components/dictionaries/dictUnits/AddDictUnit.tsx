import React, { useState } from "react";
import { DictUnits, NewDictUnit } from "../../../types/types";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { usePostDictUnit } from '../../../services/dict/DictUnitsTanstackService';
import * as Yup from 'yup';
import { withTranslation } from "react-i18next";
import { LANGUAGES } from "../../../translations/Languages";

type Props = {
    dictUnits: DictUnits[];
    onAddUnit: (newUnit: DictUnits) => void;
    t: any;
};

const AddDictUnit: React.FC<Props> = ({ dictUnits, onAddUnit, t }) => {
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const postDictUnitMutation = usePostDictUnit();

    const postDictUnit = (values: { newDictUnitName: string, newDictUnitShortcut: string }) => {
        const newDictUnit: NewDictUnit = {
            id: crypto.randomUUID(),
            name: { [selectedLanguage]: values.newDictUnitName },
            shortcut: { [selectedLanguage]: values.newDictUnitShortcut }
        };
        postDictUnitMutation.mutate(newDictUnit, {
            onSuccess: () => {
                const addedUnit: DictUnits = {
                    id: crypto.randomUUID(),
                    dict: "PER_USER",
                    dict_id: newDictUnit.id,
                    name: values.newDictUnitName,
                    shortcut: values.newDictUnitShortcut
                };
                onAddUnit(addedUnit);
            },
            onError: (error) => {
                console.error('Error adding unit:', error);
            }
        });
    };

    return (
        <div>
            <Formik
                initialValues={{
                    newDictUnitName: '',
                    newDictUnitShortcut: ''
                }}
                validationSchema={Yup.object({
                    newDictUnitName: Yup.string()
                        .required(t("validation.this_field_is_required")),
                    newDictUnitShortcut: Yup.string()
                        .required(t("validation.this_field_is_required"))
                })}
                onSubmit={(values, { setSubmitting }) => {
                    postDictUnit(values);
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
                                        className="field"
                                    >
                                        {LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div>
                                <Field name="newDictUnitName" type="text" className="field" placeholder={t("table.name")} />
                                <ErrorMessage name="newDictUnitName" component="div" className="error" />
                            </div>

                            <div>
                                <Field name="newDictUnitShortcut" type="text" className="field" placeholder={t("table.shortcut")} />
                                <ErrorMessage name="newDictUnitShortcut" component="div" className="error" />
                            </div>
                            <button type="submit" disabled={formik.isSubmitting} className="field">{t("buttons.add")}</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default withTranslation("global")(AddDictUnit);
