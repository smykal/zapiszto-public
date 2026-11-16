import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
    date: string; // Oczekujemy daty w formacie "YYYY-MM-DD"
};

const Weekday: React.FC<Props> = ({ date }) => {
    const { i18n } = useTranslation();
    const locale = i18n.language || "en"; // Pobieramy aktualny język, domyślnie "en"

    const getWeekday = (dateString: string, locale: string) => {
        const parsedDate = new Date(dateString);
        return parsedDate.toLocaleDateString(locale, { weekday: "long" });
    };

    return <span>{date} {getWeekday(date, locale)}</span>;
};

export default Weekday;
