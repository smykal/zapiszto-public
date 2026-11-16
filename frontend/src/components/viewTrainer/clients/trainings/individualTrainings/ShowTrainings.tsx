import React, { useEffect, useMemo, useState } from "react";
import { Training } from "../../../../../types/types";
import { useGetTrainingsByUserId } from "../../../../../services/trainings/TrainingsTanstackService";
import Collapsible from "react-collapsible";
import GetExercise from './GetExercise';
import Weekday from "../../../../../common/Weekday";


type Props = {
  workbook_id: number;
  userId: number;
};

const ShowTrainings: React.FC<Props> = ({ workbook_id, userId }) => {
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null);
  const { data: trainingData = [] } = useGetTrainingsByUserId(workbook_id, userId);

  const trainings = useMemo(() => {
    return (trainingData as Training[]).map((training: Training) => ({
      ...training,
      date: new Date(training.date).toISOString().split('T')[0],
    }));
  }, [trainingData]);

  useEffect(() => {
    const expandedItemIndex = localStorage.getItem('expandedItemIndex');
    if (expandedItemIndex !== null) {
      setExpandedItemIndex(parseInt(expandedItemIndex));
    }
  }, []);

  const handleItemClick = (index: number) => {
    setExpandedItemIndex((prevState) => (prevState === index ? null : index));
    localStorage.setItem('expandedItemIndex', index.toString());
  };

  const isItemExpanded = (index: number): boolean => expandedItemIndex === index;

  return (
    <div>
      <ul>
        {trainings.map((item, index) => (
          <li key={index}>
            <Collapsible
              trigger={
                <div
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '10px',
                  }}
                  onClick={() => handleItemClick(index)}
                >
                  <span style={{ marginRight: '10px', width: '350px', textAlign: 'right' }}>
                    <Weekday date={item.date} />
                  </span>
                </div>
              }
              open={isItemExpanded(index)}
            >
              <GetExercise training_id={item.id} userId={userId}></GetExercise>
            </Collapsible>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowTrainings;
