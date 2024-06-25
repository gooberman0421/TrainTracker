import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TrainDetails {
  id: string;
  name: string;
  speed: number;
  destination: string;
}

const API_URL = process.env.REACT_APP_API_URL;

const TrainDetail: React.FC<{ trainId: string }> = ({ trainId }) => {
  const [trainDetails, setTrainDetails] = useState<TrainDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTrainDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/trains/${trainId}`);
        setTrainDetails(response.data);
      } catch (err) {
        setError('Failed to fetch train details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrainDetails();
  }, [trainId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!trainDetails) return;

    try {
      await axios.put(`${API_URL}/trains/${trainId}`, trainDetails);
      alert('Train details updated successfully!');
    } catch (err) {
      setError('Failed to update train details.');
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTrainDetails(prevDetails => ({
      ...prevDetails,
      [name]: name === "speed" ? parseInt(value) : value,
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {trainDetails && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Train Name:</label>
            <input
              type="text"
              name="name"
              value={trainDetails.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Speed:</label>
            <input
              type="number"
              name="speed"
              value={trainDetails.speed}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Destination:</label>
            <input
              type="text"
              name="destination"
              value={trainDetails.destination}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Update Train Details</button>
        </form>
      )}
      {!trainDetails && <div>No train details found.</div>}
    </div>
  );
};

export default TrainDetail;