import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
};

interface TrainDetails {
  name: string;
  route: string;
  schedule: string;
}

const TrainAdditionForm: React.FC = () => {
  const [trainDetails, setTrainDetails] = useState<TrainDetails>({ name: '', route: '', schedule: '' });

  const handleInputChange = (e: React.Change00Event<HTMLInputElement>) => {
    setTrainDetails({
      ...trainDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/addTrain`, trainDetails, { headers: REQUEST_HEADERS });
      console.log(response.data); // Handle success case
    } catch (error) {
      console.error('Error adding new train: ', error);
      // Handle error case
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="name">Train Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={trainDetails.name}
        onChange={handleInputChange}
        required
      />
      
      <label htmlFor="route">Route:</label>
      <input
        type="text"
        id="route"
        name="route"
        value={trainDetails.route}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="schedule">Schedule:</label>
      <input
        type="text"
        id="schedule"
        name="schedule"
        value={trainDetails.schedule}
        onChange={handleInputChange}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default TrainAdditionForm;