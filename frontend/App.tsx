import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface Train {
  id: number;
  name: string;
  destination: string;
  departureTime: string;
}

const TrainTracker: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [newTrainName, setNewTrainName] = useState('');
  const [newTrainDestination, setNewTrainDestination] = useState('');
  const [newTrainDepart a ureTime, setNewTrainDepartureTime] = useState('');

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await fetch(`${API_URL}/trains`);
      const data = await response.json();
      setTrains(data);
    } catch (error) {
      console.error('Error fetching trains:', error);
    }
  };

  const handleSelectTrain = (id: number) => {
    const train = trains.find(train => train.id === id);
    setSelectedTrain(train);
  };

  const handleAddTrain = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await fetch(`${API_URL}/trains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTrainName,
          destination: newTrainDestination,
          departureTime: newTrainDepartureTime,
        }),
      });

      setNewTrainName('');
      setNewTrainDestination('');
      setNewTrainDepartureTime('');
      fetchTrains();
    } catch (error) {
      console.error('Error adding new train:', error);
    }
  };

  return (
    <div>
      <header>
        <h1>Train Tracker</h1>
      </header>
      <main>
        <section>
          <h2>Train List</h2>
          <ul>
            {trains.map(train => (
              <li key={train.id} onClick={() => handleSelectTrain(train.id)}>
                {train.name}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Train Details</h2>
          {selectedTrain ? (
            <div>
              <p>Name: {selectedTrain.name}</p>
              <p>Destination: {selectedTrain.destination}</p>
              <p>Departure Time: {selectedTrain.departureTime}</p>
            </div>
          ) : (
            <p>Select a train to see its details.</p>
          )}
        </section>
        <section>
          <h2>Add New Train</h2>
          <form onSubmit={handleAddTrain}>
            <input type="text" placeholder="Name" value={newTrainName} onChange={e => setNewTrainName(e.target.value)} required/>
            <input type="text" placeholder="Destination" value={newTrainDestination} onChange={e => setNewTrainDestination(e.target.value)} required/>
            <input type="time" placeholder="Departure Time" value={newTrainDepartureTime} onChange={e => setNewTrainDepartureTime(e.target.value)} required/>
            <button type="submit">Add Train</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default TrainTracker;