import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { usePostBirthDate } from "../../services/bodyParams/BodyParamsTanstackService";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  updateData: () => void; // Funkcja do odświeżania danych
};

const PostBirthDate: React.FC<Props> = ({ updateData }) => {
  const { t } = useTranslation("global");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { mutateAsync: postBirthDate, isPending } = usePostBirthDate();

  // rzutowanie DatePicker, obejście błędu typów TS
  const DatePickerComponent = DatePicker as unknown as React.ComponentType<any>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedDate) {
      try {
        await postBirthDate(selectedDate);
        updateData();
      } catch (error) {
        console.error("Błąd podczas wysyłania daty:", error);
      }
    } else {
      console.log("Wybierz datę urodzenia.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
          <label>{t("buttons.select_birthdate")}:</label>
          <DatePickerComponent
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100} // Możliwość wyboru 100 lat wstecz
          />
        </div>
        <button type="submit" className="field width_15rem" disabled={isPending}>
          {t("buttons.add")}
        </button>
      </form>
    </div>
  );
};

export default PostBirthDate;
