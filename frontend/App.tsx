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
  const [newTrainDepartureTime, setNewTrainDepartureTime] = useState('');

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
    const train = trains.find((train) => train.id === id);
    setSelectedTrain(train);
    setNewTrainName(train?.name ?? '');
    setNewTrainDestination(train?.destination ?? '');
    setNewTrainDepartureTime(train?.departureTime ?? '');
  };

  const handleSubmitTrain = async (event: React.FormEvent) => {
    event.preventDefault();
    const method = selectedTrain ? 'PUT' : 'POST';
    const url = selectedTrain
      ? `${API_URL}/trains/${selectedTrain.id}`
      : `${API_URL}/trains`;

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTrainName,
          destination: newTrainDestination,
          departureTime: newTrainDepartureTime,
        }),
      });

      clearFormAndRefreshTrains();
    } catch (error) {
      console.error('Error saving train:', error);
    }
  };

  const clearFormAndRefreshTrains = () => {
    setSelectedTrain(null);
    setNewTrainName('');
    setNewTrainDestination('');
    setNewTrainDepartureTime('');
    fetchTrains();
  };

  const handleDeleteTrain = async (id: number) => {
    try {
      await fetch(`${API_URL}/trains/${id}`, {
        method: 'DELETE',
      });
      clearFormAndRefreshTrains();
    } catch (error) {
      console.error('Error deleting train:', error);
    }
  };

  const renderTrainForm = () => (
    <section>
      <h2>{selectedTrain ? 'Edit Train' : 'Add New Train'}</h2>
      <form onSubmit={handleSubmitTrain}>
        <input
          type="text"
          placeholder="Name"
          value={newTrainName}
          onChange={(e) => setNewTrainName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Destination"
          value={newTrainDestination}
          onChange={(e) => setNewTrainDestination(e.target.value)}
          required
        />
        <input
          type="time"
          placeholder="Departure Time"
          value={newTrainDepartureTime}
          onChange={(e) => setNewTrainDepartureTime(e.target.value)}
          required
        />
        <button type="submit">{selectedTrain ? 'Update Train' : 'Add Train'}</button>
        {selectedTrain && (
          <button type="button" onClick={() => setSelectedTrain(null)}>Cancel Edit</button>
        )}
      </form>
    </section>
  );

  return (
    <div>
      <header>
        <h1>Train Tracker</h1>
      </header>
      <main>
        <section>
          <h2>Train List</h2>
          <ul>
            {trains.map((train) => (
              <li key={train.id} onClick={() => handleSelectTrain(train.id)}>
                {train.name} - <button onClick={() => handleDeleteTrain(train.id)}>Delete</button>
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
            <p>Select a train to see its details or edit it.</p>
          )}
        </section>
        {renderTrainForm()}
      </main>
    </div>
  );
};

export default TrainTracker;