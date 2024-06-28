import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
};

interface TrainFormData {
  name: string;
  route: string;
  schedule: string;
}

const AddTrainForm: React.FC = () => {
  const [trainFormData, setTrainFormData] = useState<TrainFormData>({ name: '', route: '', schedule: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrainFormData({
      ...trainFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/addTrain`, trainFormData, { headers: HEADERS });
      console.log(response.data); // Handle success case
    } catch (error) {
      console.error('Error adding new train: ', error);
      // Handle error case
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Train Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={trainFormData.name}
        onChange={handleChange}
        required
      />
      
      <label htmlFor="route">Route:</label>
      <input
        type="text"
        id="route"
        name="route"
        value={trainFormData.route}
        onChange={handleChange}
        required
      />

      <label htmlFor="schedule">Schedule:</label>
      <input
        type="text"
        id="schedule"
        name="c"
        value={trainFormData.schedule}
        onChange={handleChange}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddTrainForm;