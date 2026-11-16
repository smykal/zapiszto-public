import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { usePostDictTag } from '../../../services/dict/DictTagsTanstackService';
import { useGetDictTagsCategory } from '../../../services/dict/DictTagsCategoryTanstackService';
import { withTranslation } from 'react-i18next';
import { NewDictTagsDto } from '../../../types/types';

type Props = {
    dictTags: any[];
    onClose: (newTag: NewDictTagsDto) => void;
    t: any;
};

const AddDictTags: React.FC<Props> = ({ dictTags, onClose, t }) => {
    const postDictTagMutation = usePostDictTag();
    const { data: dictTagsCategories = [] } = useGetDictTagsCategory();

    const postDictTag = (values: { newDictTagName: string; selectedCategory: string; newDictTagDescription: string }) => {
        const selectedCategory = dictTagsCategories.find((category: any) => category.id === values.selectedCategory);

        const newDictTag: NewDictTagsDto = {
            id: crypto.randomUUID(),
            dict: "BASIC",
            category: selectedCategory,
            dict_id: crypto.randomUUID(),
            name: values.newDictTagName,
            description: values.newDictTagDescription
        };

        postDictTagMutation.mutate(newDictTag, {
            onSuccess: () => {
                onClose(newDictTag);
            }
        });
    };

    return (
        <div>
            <Formik
                initialValues={{
                    newDictTagName: '',
                    newDictTagDescription: '',
                    selectedCategory: ''     // Added selectedCategory to initial values
                }}
                validationSchema={Yup.object({
                    newDictTagName: Yup.string()
                        .required(t("validation.this_field_is_required"))
                        .notOneOf(dictTags.map(item => item.name), t("validation.name_already_exists")),
                    selectedCategory: Yup.string()
                        .required(t("validation.this_field_is_required")), // Added validation for selectedCategory
                    newDictTagDescription: Yup.string().required(t("validation.this_field_is_required"))
                })}
                onSubmit={(values, { setSubmitting }) => {
                    postDictTag(values);
                    setSubmitting(false);
                }}
            >
                {formik => (
                    <Form>
                        <div className="form-container">
                            <Field name="newDictTagName" type="text" className="form-field" placeholder={t("table.name")} />
                            <ErrorMessage name="newDictTagName" component="div" className="error" />

                            <Field name="newDictTagDescription" type="text" className="form-field" placeholder={t("table.description")} />
                            <ErrorMessage name="newDictTagDescription" component="div" className="error" />

                            <Field as="select" name="selectedCategory" className="form-field">
                                <option value="" label={t("table.select_category")} />
                                {dictTagsCategories.map((category: any) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="selectedCategory" component="div" className="error" />

                            <button type="submit" disabled={formik.isSubmitting}>
                                {t("buttons.add")}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default withTranslation("global")(AddDictTags);