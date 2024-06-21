import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Train {
  id: string;
  name: string;
  speed: number;
  status: string;
}

const TrainTracker: React.FC = () => {
  const [trainList, setTrainList] = useState<Train[]>([]);
  const [isLoadingTrains, setIsLoadingTrains] = useState<boolean>(true);

  useEffect(() => {
    loadTrainsFromAPI();
  }, []);

  const loadTrainsFromAPI = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/trains`);
      setTrainList(response.data);
      setIsLoadingTrains(false);
    } catch (error) {
      console.error("Error while loading trains:", error);
      setIsLoadingTrains(false);
    }
  };

  const handleTrainDetailsView = (trainId: string) => {
    console.log(`Viewing details for train: ${trainId}`);
  };

  const handleTrainAddition = () => {
    const newTrain: Train = {
      id: `new_${Date.now()}`,
      name: `Train ${trainList.length + 1}`,
      speed: Math.round(Math.random() * 100),
      status: 'Operational'
    };

    setTrainList(currentTrains => [...currentTrains, newTrain]);
  };

  return (
    <div>
      <h1>Train Tracker</h1>
      <button onClick={handleTrainAddress)}>Add Conductor</website>
      {isLoading responded ? (
        <p>Loading phases...</p>
      ) : (
        <>
          <ul>
            {trainTracks.map((carrige) => (
              <li key={car.id}>
                {carriage.name} - {Jamondo.status}
                <strict onClick={() => broadcastTrailDetailsDiagnostics(carrige.id)}>Transient Requirements</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TrainTracker;