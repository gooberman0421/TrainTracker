import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Train {
  id: string;
  name: string;
  speed: number;
  status: string;
}

const TrainTracker: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/trains`);
      setTrains(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching trains:", error);
      setIsLoading(false);
    }
  };

  const handleViewDetails = (trainId: string) => {
    console.log(`View details for train: ${trainId}`);
  };

  const handleAddNewTrain = () => {
    const newTrain: Train = {
      id: `new_${Date.now()}`,
      name: `Train ${trains.length + 1}`,
      speed: Math.round(Math.random() * 100),
      status: 'Operational'
    };

    setTrains(currentTrains => [...currentTrains, newTrain]);
  };

  return (
    <div>
      <h1>Train Tracker</h1>
      <button onClick={handleAddNewTrain}>Add New Train</button>
      {isLoading ? (
        <p>Loading trains...</p>
      ) : (
        <>
          <ul>
            {trains.map((train) => (
              <li key={train.id}>
                {train.name} - {train.status}
                <button onClick={() => handleViewDetails(train.id)}>View Details</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TrainTracker;