import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import { withTranslation } from 'react-i18next';
import * as Yup from 'yup'
import { DictExercises, DictQuantityType, DictUnits, NewExercise, LastExerciseData } from '../../../../../types/types';
import DictExercisesService from '../../../../../services/dict/DictExercisesService';
import ExerciseService from '../../../../../services/exercises';
import ExercisesTrainingService from '../../../../../services/exercises/training/ExercisesTrainingService';
import DictUnitsService from '../../../../../services/dict/DictUnitsService';
import DictQuantityTypeService from '../../../../../services/dict/DictQuantityTypeService';
import OptionsAddExercise from './OptionsAddExercise';
import Spinner from '../../../../../common/Spinner';

interface Props {
    workbook_id: number;
    training_id: number;
    onRefresh: () => Promise<void>;
    t: any;
}

interface State {
    dictExercises: DictExercises[];
    dictUnits: DictUnits[];
    dictQuantityTypes: DictQuantityType[];
    isDataLoaded: boolean;
    lastExerciseData: LastExerciseData | null; // Dodajemy nowy stan
    selectedCategory: string,
    dictExerciseId: string,
    submitNumber: number,

}

class AddExercise extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dictExercises: [],
            dictUnits: [],
            dictQuantityTypes: [],
            isDataLoaded: false, // Nowy stan do śledzenia załadowania
            lastExerciseData: null, // Początkowa wartość
            selectedCategory: '',
            dictExerciseId: '',
            submitNumber: 1,

        };
    }

    componentDidMount() {
        Promise.all([
            DictExercisesService.getDictExercises(),
            DictUnitsService.getDictUnits(),
            DictQuantityTypeService.getDictQuantityTypes()
        ])
            .then(([exercises, units, quantityTypes]) => {
                this.setState({
                    dictExercises: exercises.data,
                    dictUnits: units.data,
                    dictQuantityTypes: quantityTypes.data,
                    isDataLoaded: true
                });
            })
            .catch(error => console.error('Error loading dictionaries:', error));
    }

    getLastExerciseTrainingData = (exerciseId: string, setFieldValue: any) => {
        ExercisesTrainingService.getLastExerciseTrainingData(exerciseId)
            .then(response => {
                console.log("Last exercise data:", response.data);
                const lastExerciseData = response.data;
                this.setState({ lastExerciseData: response.data });

                if (lastExerciseData && lastExerciseData.quantity) {
                    setFieldValue('quantity', lastExerciseData.quantity);
                    if (lastExerciseData.volume == 0) {
                        setFieldValue('volume', null);
                    } else {
                        setFieldValue('volume', lastExerciseData.volume);
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching last exercise data:", error);
                this.setState({ lastExerciseData: null });
            });
    };

    handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>, setFieldValue: any) => {
        const { value } = e.target;
        this.setState({ selectedCategory: value, dictExerciseId: '' });
        setFieldValue('selectedCategory', value);
    };

    handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>, setFieldValue: any) => {
        const { value } = e.target;
        this.setState({ dictExerciseId: value });

        if (value) {
            this.getLastExerciseTrainingData(value, setFieldValue); // Pobieramy dane po wyborze ćwiczenia
        }
        setFieldValue('dictExerciseId', value);
    };

    handleAddExerciseFromModal = async () => {
        try {
            const exercises = await DictExercisesService.getDictExercises();
            this.setState({
                dictExercises: exercises.data
            });
        } catch (error) {
            console.error("Error refreshing exercises after adding new one:", error);
        }
    };

    postExercise = async (exercise: NewExercise, submitNumber: number) => {
        try {
            await ExerciseService.postExercise(exercise, submitNumber);
            await this.props.onRefresh();
        } catch (error) {
            console.error('Error posting exercise:', error);
        }
    };

    render() {
        const { t, training_id } = this.props;
        const { dictExercises, dictUnits, dictQuantityTypes, isDataLoaded, dictExerciseId } = this.state;

        if (!isDataLoaded) return <Spinner />; // Czekamy, aż dane się załadują

        const initialExercise: NewExercise = {
            id: crypto.randomUUID(),
            trainingId: training_id,
            dictExerciseId: dictExerciseId,
            quantity: 10,
            dictQuantityTypeId: dictQuantityTypes.length > 0 ? dictQuantityTypes[0].id : '',
            volume: null,
            dictUnitId: dictUnits.length > 0 ? dictUnits[0].id : '',
            notes: ''
        };

        const uniqueCategories = Array.from(
            new Set(dictExercises.map((exercise) => exercise.category_name))
        );

        const validationSchema = Yup.object().shape({
            selectedCategory: Yup.string().required(t('workbooks.select_category')),
            dictExerciseId: Yup.string().required(t('workbooks.select_exercise'))
        })

        return (
            <div>
                <div>
                    <OptionsAddExercise onAddExercise={this.handleAddExerciseFromModal} />
                </div>
                <div>

                    <Formik
                        initialValues={{ ...initialExercise, selectedCategory: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            this.postExercise(values, this.state.submitNumber);
                        }}                    >
                        {({ values, setFieldValue, errors, touched }) => (
                            <Form>
                                <div style={{ display: 'grid', gap: '1em', gridTemplateColumns: '0.5fr 1.5fr' }}>
                                    {/* 1. Kategoria (pełny wiersz) */}
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <Field
                                            as="select"
                                            name="selectedCategory"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.handleCategoryChange(e, setFieldValue)}
                                            style={{ width: '100%'}}
                                        >
                                            <option value="" disabled>{t('workbooks.select_category')}</option>
                                            {uniqueCategories.map((category) => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </Field>
                                        {errors.selectedCategory && touched.selectedCategory && (
                                            <div className="error">{errors.selectedCategory}</div>
                                        )}
                                    </div>

                                    {/* 2. Ćwiczenie (pełny wiersz) */}
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <Field as="select"
                                            name="dictExerciseId"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.handleExerciseChange(e, setFieldValue)}
                                            style={{ width: '100%' }}>
                                            <option value="" disabled>{t('workbooks.select_exercise')}</option>
                                            {dictExercises
                                                .filter((exercise) => exercise.category_name === values.selectedCategory)
                                                .map((exercise) => (
                                                    <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                                                ))}
                                        </Field>
                                        {errors.dictExerciseId && touched.dictExerciseId && (
                                            <div className="error">{errors.dictExerciseId}</div>
                                        )}
                                    </div>

                                    {/* 3. Ilość + Typ ilości */}
                                    <Field 
                                        name="quantity"
                                        type="number"
                                    />
                                    <Field as="select" name="dictQuantityTypeId">
                                        {dictQuantityTypes.map(quantity => (
                                            <option key={quantity.id} value={quantity.id}>{quantity.name}</option>
                                        ))}
                                    </Field>

                                    {/* 4. Objętość + Jednostka */}
                                    {values.dictUnitId !== '' ? (
                                        <Field
                                            name="volume"
                                            type="number"
                                        />
                                    ) : (
                                        <div style={{ height: '1.5em' }}></div> // Pusty div zastępujący pole Field
                                    )}
                                    <Field
                                        as="select"
                                        name="dictUnitId"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const selected = e.target.value;
                                            setFieldValue('dictUnitId', selected);

                                            // Jeśli wybrano "skip", wyczyść pole volume
                                            if (selected === '') {
                                                setFieldValue('volume', null);
                                            }
                                        }}>
                                        <option value="">{t('workbooks.skip_volume')}</option>
                                        {dictUnits.map(unit => (
                                            <option key={unit.id} value={unit.id}>{unit.name}</option>
                                        ))}
                                    </Field>

                                    {/* 5. Notatki (pełny wiersz) */}
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <Field
                                            name="notes"
                                            type="text"
                                            style={{ width: '100%'}}
                                            placeholder={t('table.notes')}
                                        />
                                    </div>

                                    {/* 6. Przycisk (pełny wiersz, wyrównany do prawej) */}
                                    <div
                                        style={{
                                            gridColumn: '1 / -1',
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            gap: '0.5em'
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            onClick={() => this.setState({ submitNumber: 1 })}
                                            className="field"
                                        >
                                            {t('buttons.add_x1')}
                                        </button>

                                        <button
                                            type="submit"
                                            onClick={() => this.setState({ submitNumber: 3 })}
                                            className="field"
                                        >
                                            {t('buttons.add_x3')}
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        );
    }
}

export default withTranslation('global')(AddExercise);
