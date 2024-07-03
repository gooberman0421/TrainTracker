import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
const REQUEST_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_API_KEY}`
};

interface TrainDetails {
    name: string;
    route: string;
    schedule: string;
}

const TrainAddForm: React.FC = () => {
    const [trainDetails, setTrainDetails] = useState<TrainDetails>({ name: '', route: '', schedule: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target; // Destructuring for further clarity
        setTrainDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BACKEND_URL}/trains`, trainDetails, { headers: REQUEST_HEADERS });
            console.log(response.data); // Log success response
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error while adding the train: ', error.response?.data);
            } else {
                console.error('Unexpected error: ', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormField
                label="Train Name"
                id="name"
                name="name"
                value={trainDetails.name}
                onChange={handleInputChange}
            />
            
            <FormField
                label="Route"
                id="route"
                name="route"
                value={trainDetails.route}
                onChange={handleInputChange}
            />

            <FormField
                label="Schedule"
                id="schedule"
                name="schedule"
                value={trainDetails.schedule}
                onChange={handleInputChange}
            />

            <button type="submit">Add Train</button>
        </form>
    );
};

interface FormFieldProps {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ label, id, name, value, onChange }) => (
    <div>
        <label htmlFor={id}>{label}:</label>
        <input
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required
        />
    </div>
);

export default TrainAddForm;