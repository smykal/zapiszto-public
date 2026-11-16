import React, { Component } from "react";
import AddDictExercise from "../../../../dictionaries/dictExercises/AddDictExercise";
import DictExercisesService from "../../../../../services/dict/DictExercisesService";
import CategoryService from '../../../../../services/dict/DictCategoryService';
import { DictCategories, DictExercises } from "../../../../../types/types";
import { withTranslation } from "react-i18next";
import Modal from "../../../../../constants/Modal";

type Props = {
    t: any;
    onAddExercise: () => void;
};

type State = {
    isModalOpen: boolean;
    dictExercises: DictExercises[];
    dictCategories: DictCategories[];
};

class OptionsAddExercise extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isModalOpen: false,
            dictExercises: [],
            dictCategories: []
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const [exercisesRes, categoriesRes] = await Promise.all([
                DictExercisesService.getDictExercises(),
                CategoryService.getDictCategory()
            ]);
            this.setState({
                dictExercises: exercisesRes.data,
                dictCategories: categoriesRes.data
            });
        } catch (error) {
            console.error("Błąd podczas pobierania danych:", error);
        }
    };

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    handleAddExercise = () => {
        this.fetchData(); // odśwież listę z backendu
        this.props.onAddExercise();
        this.closeModal();
    };


    render() {
        const { t } = this.props;
        const { isModalOpen, dictExercises, dictCategories } = this.state;

        return (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <span> &nbsp; </span>
                <button onClick={this.openModal} className="button">
                    {t("buttons.add_exercise_if_missing")}
                </button>

                {/* Modal zawierający formularz dodawania ćwiczeń */}
                <Modal show={isModalOpen} onClose={this.closeModal} title={t("buttons.add_exercise")}>
                    <div>
                        <AddDictExercise
                            dictExercises={dictExercises}
                            dictCategories={dictCategories}
                            onAddExercise={this.handleAddExercise}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withTranslation("global")(OptionsAddExercise);
