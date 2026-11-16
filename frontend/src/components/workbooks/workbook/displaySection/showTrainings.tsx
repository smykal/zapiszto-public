import React, { useEffect, useMemo, useState } from "react";
import { Training } from "../../../../types/types";
import { useGetTrainings } from "../../../../services/trainings/TrainingsTanstackService";
import Collapsible from "react-collapsible";
import Exercises from "./exercises/index";
import Options from "./Options";
import Weekday from "../../../../common/Weekday";

type Props = {
    workbook_id: number;
};

type TrainingsByYear = {
    [year: string]: Training[];
};

const ShowTrainings: React.FC<Props> = ({ workbook_id }) => {
    const { data, refetch } = useGetTrainings(workbook_id);
    const [expandedTrainingId, setExpandedTrainingId] = useState<number | null>(() => {
        const storedTrainingId = localStorage.getItem("expandedTrainingId");
        return storedTrainingId ? Number(storedTrainingId) : null;
    });
    const [expandedYear, setExpandedYear] = useState<string | null>(null);

    const trainings = useMemo(() => {
        const rawTrainings = (data ?? []) as Training[];

        return rawTrainings.map((training) => {
            const parsedDate = new Date(training.date)
                .toISOString()
                .split("T")[0];
            return { ...training, date: parsedDate };
        });
    }, [data]);

    const trainingsByYear = useMemo(() => {
        return trainings.reduce((acc: TrainingsByYear, training) => {
            const year = new Date(training.date).getFullYear().toString();

            if (!acc[year]) {
                acc[year] = [];
            }

            acc[year].push(training);
            return acc;
        }, {});
    }, [trainings]);

    const sortedYears = useMemo(
        () => Object.keys(trainingsByYear).sort((a, b) => Number(b) - Number(a)),
        [trainingsByYear]
    );

    useEffect(() => {
        if (!sortedYears.length) {
            setExpandedYear(null);
            return;
        }

        setExpandedYear((currentYear) => {
            if (currentYear && sortedYears.includes(currentYear)) {
                return currentYear;
            }

            return sortedYears[0] ?? null;
        });
    }, [sortedYears]);

    const handleYearClick = (year: string) => {
        setExpandedYear((currentYear) => (currentYear === year ? null : year));
    };

    const handleItemClick = (trainingId: number) => {
        setExpandedTrainingId((currentTrainingId) =>
            currentTrainingId === trainingId ? null : trainingId
        );

        localStorage.setItem("expandedTrainingId", trainingId.toString());
    };

    const isItemExpanded = (trainingId: number) => expandedTrainingId === trainingId;

    return (
        <div>
            <ul>
                {sortedYears.map((year) => (
                    <li key={year}>
                        <Collapsible
                            trigger={
                                <div
                                    style={{ cursor: "pointer", color: "gray", marginBottom: "4px", marginLeft: "4px", fontSize: "0.8rem" }}
                                    onClick={() => handleYearClick(year)}
                                >
                                    {year}
                                </div>
                            }
                            open={expandedYear === year}
                        >
                            <ul>
                                {trainingsByYear[year].map((item: Training) => (
                                    <li key={item.id}>
                                        <Collapsible
                                            trigger={
                                                <div
                                                    style={{
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginBottom: '10px',
                                                    }}
                                                    onClick={() => handleItemClick(item.id)}
                                                >
                                                    <Options
                                                        trainingId={item.id}
                                                        trainingDate={item.date}
                                                        onTrainingOptionCopy={() => {
                                                            void refetch();
                                                        }}
                                                        onTrainingOptionDelete={() => {
                                                            void refetch();
                                                        }}
                                                        onTrainingOptionDateUpdate={() => {
                                                            void refetch();
                                                        }}
                                                    />
                                                    &nbsp;&nbsp;
                                                    <Weekday date={item.date} />
                                                    <span> {item.notes} </span>
                                                </div>
                                            }
                                            open={isItemExpanded(item.id)}
                                        >
                                            <Exercises
                                                workbook_id={item.workbooks_id}
                                                training_id={item.id}
                                            />
                                        </Collapsible>
                                    </li>
                                ))}
                            </ul>
                        </Collapsible>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShowTrainings;
