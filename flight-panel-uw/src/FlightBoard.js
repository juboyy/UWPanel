import React from 'react';
import { useNavigate } from 'react-router-dom';
import FlightListPage from './FlightListPage';
import './statusColors.css';

const FlightBoard = ({ flights, onEditFlight, onDeleteFlight }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'text-blue';
            case 'Boarding': return 'text-yellow';
            case 'Delayed': return 'text-orange';
            case 'Completed': return 'text-green';
            case 'Cancelled': return 'text-red';
            case 'In Flight': return 'text-cyanBlue';
            default: return 'text-gray';
        }
    };

    const handleNavigateToForm = () => {
        navigate('/form');
    };

    return (
        <FlightListPage 
            flights={flights} 
            getStatusColor={getStatusColor}
            onAddClick={handleNavigateToForm}
            onEditFlight={onEditFlight}
            onDeleteFlight={onDeleteFlight}
        />
    );
};

export default FlightBoard;