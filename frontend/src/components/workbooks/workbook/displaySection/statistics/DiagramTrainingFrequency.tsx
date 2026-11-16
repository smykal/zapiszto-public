import React, { useEffect, useState, useMemo } from "react";
import { Chart } from "react-google-charts";
import { useGetTrainingsFrequency } from "../../../../../services/diagrams/DiagramTanstackService";
import { DiagramTrainingsFrequency } from "../../../../../types/types";
import { withTranslation } from "react-i18next";
import Spinner from "../../../../../common/Spinner";

interface Props {
    workbookId: number;
    t: any;
}

const DiagramTrainingFrequency: React.FC<Props> = ({ workbookId, t }) => {
    const { data: rawData = [], isLoading: loading } = useGetTrainingsFrequency(workbookId);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    useEffect(() => {
        if (rawData.length > 0) {
            const years = rawData.map((r: DiagramTrainingsFrequency) => new Date(r.trainingDate).getFullYear());
            const newestYear = years.length ? Math.max(...years) : null;
            setSelectedYear(newestYear);
        }
    }, [rawData]);

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        rawData.forEach((item: DiagramTrainingsFrequency) => years.add(new Date(item.trainingDate).getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
    }, [rawData]);

    const filteredData = useMemo(() => {
        if (!selectedYear) return [];
        return rawData.filter(
            (item: DiagramTrainingsFrequency) => new Date(item.trainingDate).getFullYear() === selectedYear
        );
    }, [rawData, selectedYear]);

    const chartData = useMemo(() => {
        if (!selectedYear || filteredData.length === 0) return [];

        return [
            [
                { type: "date", id: "Date" },
                { type: "number", id: "Count" },
            ],
            ...filteredData.map((entry: DiagramTrainingsFrequency) => [
                new Date(entry.trainingDate),
                entry.count,
            ]),
        ];
    }, [filteredData, selectedYear]);

    const options = {
        animation: {
            startup: true,
            duration: 2000
        },
        title: `${t("diagram.training_attendance")} (${selectedYear})`,
        titleTextStyle: { color: "#8e7f90" },
        colorAxis: {
            colors: ["#4caf50", "#200080"],
        },
        noDataPattern: {
           backgroundColor: '#343434',
           color: '#343434'
         },
        calendar: {
            cellColor: {
                stroke: '#8e7f90',
                strokeOpacity: 0.5,
                strokeWidth: 1,
            },
            cellSize: 12.5,
            yearLabel: {
                fontSize: 12,
                color: "#8e7f90",
                bold: false,
            },
            monthOutlineColor: {
                stroke: "#4caf50",
                strokeOpacity: 1,
                strokeWidth: 1
            },
            monthLabel: {
                color: "#8e7f90",
            }
        },
        backgroundColor: "transparent",
    };

    if (loading) return <Spinner />;
    if (!selectedYear || chartData.length <= 1) return null;

    return (
        <>
            {/* YEAR SELECT */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1rem",
                }}
            >
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                    {availableYears.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* CHART */}
            <div
                style={{
                    overflowX: "auto",
                    overflowY: "hidden",
                    marginBottom: "2rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".75rem",
                }}
            >
                <Chart
                    chartType="Calendar"
                    width="800px"
                    data={chartData}
                    options={options}
                />
            </div>
        </>
    );
};

export default withTranslation("global")(DiagramTrainingFrequency);
