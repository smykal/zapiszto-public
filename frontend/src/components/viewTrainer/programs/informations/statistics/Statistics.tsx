import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useGetExerciseStatsByProgramId } from "../../../../../services/diagrams/DiagramTanstackService";
import Diagram from "../mesocycle/diagrams/Diagram";
import "react-tabs/style/react-tabs.css";

interface ExerciseStatsDto {
  orderId: number;
  category: string;
  repetitions: number;
  sets: number;
}

interface ExerciseStatsForMesocycleDto {
  mesocycleId: string;
  label: string | null;
  orderId: number;
  exerciseStatsDtoList: ExerciseStatsDto[];
}

interface StatisticsProps {
  programId: string;
}

const Statistics: React.FC<StatisticsProps> = ({ programId }) => {
  const { data = [], isLoading, error } = useGetExerciseStatsByProgramId(programId);

  if (isLoading) return <p>Loading statistics...</p>;
  if (error) return <p style={{ color: "red" }}>Failed to load statistics</p>;
  if (data.length === 0) return <p>No statistics available.</p>;

  return (
    <Tabs>
      <TabList>
        {data.map((mesocycle: ExerciseStatsForMesocycleDto, index: number) => (
          <Tab key={mesocycle.mesocycleId}>
            {mesocycle.label || `Mesocycle ${index + 1}`}
          </Tab>
        ))}
      </TabList>

      {data.map((mesocycle: ExerciseStatsForMesocycleDto) => (
        <TabPanel key={mesocycle.mesocycleId}>
          <Diagram mesocycleId={mesocycle.mesocycleId} />
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default Statistics;
