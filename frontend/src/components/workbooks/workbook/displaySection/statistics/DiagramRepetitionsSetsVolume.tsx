import React, { useEffect, useState, useMemo } from "react";
import { Chart } from "react-google-charts";
import { useGetVolumeSetsRepsForEachDateInCategory } from "../../../../../services/diagrams/DiagramTanstackService";
import Spinner from "../../../../../common/Spinner";
import { DiagramRepetitionsSetsVolumeForEachTrainingAndDate } from "../../../../../types/types";

type Props = {
    workbookId: number;
};

const DiagramRepetitionsSetsVolume: React.FC<Props> = ({ workbookId }) => {
    const { data: rawData = [], isLoading: loading } = useGetVolumeSetsRepsForEachDateInCategory(workbookId);
    const [visibleCategories, setVisibleCategories] = useState<Record<string, boolean>>({});
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    useEffect(() => {
        if (rawData.length > 0) {
            const categories: Record<string, boolean> = {};
            rawData.forEach((item: DiagramRepetitionsSetsVolumeForEachTrainingAndDate) => {
                categories[item.category] = true;
            });

            const years = rawData.map((d: DiagramRepetitionsSetsVolumeForEachTrainingAndDate) => new Date(d.trainingWeek).getFullYear());
            const newestYear = years.length ? Math.max(...years) : null;

            setVisibleCategories(categories);
            setSelectedYear(newestYear);
        }
    }, [rawData]);

    const getWeekNumber = (dateStr: string): number => {
        const date = new Date(dateStr);
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = (date.getTime() - start.getTime()) / 86400000;
        return Math.ceil((diff + start.getDay() + 1) / 7);
    };

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        rawData.forEach((item: DiagramRepetitionsSetsVolumeForEachTrainingAndDate) => {
            years.add(new Date(item.trainingWeek).getFullYear());
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [rawData]);

    const filteredData = useMemo(() => {
        if (!selectedYear) return [];
        return rawData.filter(
            (item: DiagramRepetitionsSetsVolumeForEachTrainingAndDate) => new Date(item.trainingWeek).getFullYear() === selectedYear
        );
    }, [rawData, selectedYear]);

    const { minWeek, maxWeek, maxSets } = useMemo(() => {
        let min = Infinity;
        let max = 0;
        let maxSet = 0;

        filteredData.forEach((item: DiagramRepetitionsSetsVolumeForEachTrainingAndDate) => {
            const week = getWeekNumber(item.trainingWeek);
            min = Math.min(min, week);
            max = Math.max(max, week);
            maxSet = Math.max(maxSet, item.sets);
        });

        return {
            minWeek: min === Infinity ? 1 : min,
            maxWeek: max,
            maxSets: maxSet,
        };
    }, [filteredData]);

    const toggleCategory = (category: string) => {
        setVisibleCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const chartData = useMemo(() => {
        return [
            ["Category", "Week", "Sets", "Volume", "Repetitions"],
            ...filteredData
                .filter((item: DiagramRepetitionsSetsVolumeForEachTrainingAndDate) => visibleCategories[item.category])
                .map((item: DiagramRepetitionsSetsVolumeForEachTrainingAndDate) => [
                    item.category,
                    getWeekNumber(item.trainingWeek),
                    item.sets,
                    item.volume,
                    Number(item.repetitions),
                ]),
        ];
    }, [filteredData, visibleCategories]);

    const options = {
        title: `Volume / Sets / Repetitions (${selectedYear})`,
        titleTextStyle: { color: "#8e7f90" },
        hAxis: {
            title: "Week of year",
            viewWindow: { min: minWeek - 1, max: maxWeek + 1 },
            textStyle: { color: "#8e7f90" },
            titleTextStyle: { color: "#8e7f90" },
        },
        vAxis: {
            title: "Sets",
            viewWindow: { min: 0, max: maxSets + 2 },
            textStyle: { color: "#8e7f90" },
            titleTextStyle: { color: "#8e7f90" },
        },
        bubble: { textStyle: { fontSize: 11 } },
        explorer: { actions: ["dragToZoom", "rightClickToReset"], axis: "horizontal" },
        backgroundColor: "transparent",
        animation: { startup: false, duration: 1500 },
    };

    if (loading) return <Spinner />;
    if (!selectedYear || filteredData.length === 0) return null;

    return (
        <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
            {/* YEAR SELECT */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                    {availableYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* CATEGORY FILTERS */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: ".75rem",
                    marginBottom: "1rem",
                }}
            >
                {Object.keys(visibleCategories).map((category) => (
                    <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        style={{
                            background: visibleCategories[category] ? "#4caf50" : "#f57c00",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                        }}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* CHART */}
            <Chart
                chartType="BubbleChart"
                width="100%"
                height="500px"
                data={chartData}
                options={options}
            />
        </div>
    );
};

export default DiagramRepetitionsSetsVolume;
