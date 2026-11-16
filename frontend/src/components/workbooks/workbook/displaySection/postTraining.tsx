import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { usePostNewTraining } from "../../../../services/trainings/TrainingsTanstackService";
import Modal from "../../../../constants/Modal";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  workbook_id: number
  t: any
  onRefresh: () => void; // Funkcja do odświeżania
};

// rzutowanie DatePicker na ComponentType by obejść problem typów w TS (szybkie rozwiązanie)
const DatePickerComponent = DatePicker as unknown as React.ComponentType<any>;

const PostTraining: React.FC<Props> = ({ workbook_id, t, onRefresh }) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [showModal, setShowModal] = useState(false);
  const postNewTraining = usePostNewTraining();

  const handleDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!date) {
      console.log("Wybierz datę treningu.");
      return;
    }

    try {
      await postNewTraining.mutateAsync({ workbookId: workbook_id, date });
      localStorage.setItem("expandedItemIndex", "0");
      if (onRefresh) onRefresh();
      setShowModal(false);
    } catch (error) {
      console.error("Błąd podczas dodawania treningu:", error);
    }
  };

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
  };

  return (
    <div style={{ margin: '1em 0 1em 0' }}>

      <button onClick={toggleModal}>{t("workbooks.add_new_training_day")}</button>

      <Modal show={showModal} onClose={toggleModal} title={t("workbooks.select_training_date")}>
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'center', marginBottom: '1em'}}>
            <DatePickerComponent
              selected={date}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          {postNewTraining.isPending ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <span className="loader" />
            </div>
          ) : (
            <button type="submit" className="field">
              {t("buttons.add")}
            </button>
          )}
        </form>
      </Modal>

    </div>
  );
};

export default withTranslation("global")(PostTraining)
