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

  const handleDeleteTrain = async (id: number) => {
    try {
      await fetch(`${API_URL}/trains/${id}`, {
        method: 'DELETE',
      });
      refreshTrains();
    } catch (error) {
      console.error('Error deleting train:', error);
    }
  };

  const refreshTrains = () => {
    fetchTrains();
  };

  return (
    <div>
      <header>
        <h1>Train Tracker</h1>
      </header>
      <main>
        <TrainList trains={trains} handleSelectTrain={setSelectedTrain} handleDeleteTrain={handleDeleteTrain} />
        {selectedTrain && <TrainDetails selectedTrain={selectedTrain} />}
        <TrainForm selectedTrain={selectedTrain} setSelectedTrain={setSelectedTrain} refreshTrains={refreshTrains} />
      </main>
    </div>
  );
};

interface TrainListProps {
  trains: Train[];
  handleSelectTrain: (train: Train | null) => void;
  handleDeleteTrain: (id: number) => void;
}

const TrainList: React.FC<TrainListProps> = ({ trains, handleSelectTrain, handleDeleteTrain }) => {
  return (
    <section>
      <h2>Train List</h2>
      <ul>
        {trains.map((train) => (
          <li key={train.id} onClick={() => handleSelectTrain(train)}>
            {train.name} - <button onClick={(e) => {
              e.stopPropagation();
              handleDeleteTrain(train.id);
            }}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

interface TrainDetailsProps {
  selectedTrain: Train;
}

const TrainDetails: React.FC<TrainDetailsProps> = ({ selectedTrain }) => {
  return (
    <section>
      <h2>Train Details</h2>
      <div>
        <p>Name: {selectedTrain.name}</p>
        <p>Destination: {selectedTrain.destination}</p>
        <p>Departure Time: {selectedTrain.departureTime}</p>
      </div>
    </section>
  );
};

interface TrainFormProps {
  selectedTrain: Train | null;
  setSelectedTrain: (train: Train | null) => void;
  refreshTrains: () => void;
}

const TrainForm: React.FC<TrainFormProps> = ({ selectedTrain, setSelectedTrain, refreshTrains }) => {
  const [newTrainName, setNewTrainName] = useState('');
  const [newTrainDestination, setNewTrainDestination] = useState('');
  const [newTrainDepartureTime, setNewTrainDepartureTime] = useState('');

  useEffect(() => {
    if (selectedTrain) {
      setNewTrainName(selectedTrain.name);
      setNewTrainDestination(selectedTrain.destination);
      setNewTrainDepartureTime(selectedTrain.departureTime);
    } else {
      clearForm();
    }
  }, [selectedTrain]);

  const clearForm = () => {
    setNewTrainName('');
    setNewTrainDestination('');
    setNewTrainDepartureTime('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const method = selectedTrain ? 'PUT' : 'POST';
    const url = selectedTrain ? `${API_URL}/trains/${selectedTrain.id}` : `${API_URL}/trains`;

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
      clearForm();
      setSelectedTrain(null);
      refreshTrains();
    } catch (error) {
      console.error('Error saving train:', error);
    }
  };

  return (
    <section>
      <h2>{selectedTrain ? 'Edit Train' : 'Add New Train'}</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="button" onClick={() => setSelectedTrain(null)}>Cancel Edit</button>
      </form>
    </section>
  );
};

export default TrainTracker;