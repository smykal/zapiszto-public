import React, { useState } from "react";
import { DictCategories, DictExercises, NewDictExercises } from "../../../types/types";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DictExercisesService from "../../../services/dict/DictExercisesService";
import * as Yup from 'yup';
import { withTranslation } from "react-i18next";
import { LANGUAGES } from "../../../translations/Languages";

type Props = {
    dictExercises: DictExercises[];
    dictCategories: DictCategories[];
    onAddExercise: () => void;
    t: any;
};

const AddDictExercise: React.FC<Props> = ({ dictExercises, dictCategories, onAddExercise, t }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].code);

    const postDictExercises = (values: { name: string; categoryId: string }) => {
        const isNameExisting = dictExercises.some(exercise => exercise.name === values.name);
        if (!isNameExisting) {
            const newDictExerciseData: NewDictExercises = { 
                id: crypto.randomUUID(),
                name: { [selectedLanguage]: values.name },
                categoryId: values.categoryId  
            };
            DictExercisesService.postDictExercisePerUser(newDictExerciseData)
            .then(() => {
                onAddExercise(); // Wywołaj tylko reload, nie przekazuj tymczasowego obiektu
            })
            .catch(error => {
                console.error('Błąd podczas wysyłania zapytania:', error);
            });
        } else {
            console.log("Nazwa już istnieje:", values.name);
        }
    };

    return (
        <div>
            <Formik
                initialValues={{ name: '', categoryId: '' }}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .required(t('validation.this_field_is_required'))
                        .notOneOf(dictExercises.map(exercise => exercise.name), t('validation.unique')),
                    categoryId: Yup.string().required(t('validation.this_field_is_required'))
                })}
                onSubmit={(values, { setSubmitting }) => {
                    postDictExercises(values);
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
                                <ErrorMessage name="name" component="div" className="error" />
                                <Field name="name" type="text" className="field" placeholder={t('table.name')} />
                            </div>

                            <div>
                                <ErrorMessage name="categoryId" component="div" className="error" />
                                <Field as="select" name="categoryId" className="field">
                                    <option value="" disabled>{t("table.category")}</option>
                                    {dictCategories.map((category: DictCategories) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            <button type="submit" disabled={formik.isSubmitting} className="field">{t("buttons.add")}</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default withTranslation("global")(AddDictExercise);
