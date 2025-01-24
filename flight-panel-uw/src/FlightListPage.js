import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logouw from './logos/logouw.png';
import './logoUW.css';
import './statusColors.css';

const FlightListPage = ({ flights, getStatusColor, onAddClick, onEditFlight, onDeleteFlight }) => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState('');

    // Função para obter o horário no fuso horário do Panamá
    const getPanamaTime = () => {
        const now = new Date();
        return now.toLocaleString('en-US', {
            timeZone: 'America/Panama',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    };

    useEffect(() => {
        // Atualiza o horário no estado a cada segundo
        const updateTime = () => setCurrentTime(getPanamaTime());
        updateTime();
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleEdit = (flight) => {
        navigate(`/edit/${flight.id}`);
    };

    const handleDelete = (flightId) => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            onDeleteFlight(flightId);
        }
    };

    return (
        <div className="container py-4">
            <div className="row gx-4">
                <div className="col-12 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h2 text-white">Flights UW</h1>
                        <div className="d-flex align-items-center">
                            <span className="text-white">{currentTime}</span>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped table-dark">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>Airline</th>
                                    <th>Flight</th>
                                    <th>Origin</th>
                                    <th>Destination</th>
                                    <th>Aircraft</th>
                                    <th>Status</th>
                                    <th>DEP (HH:MM MM/DD)</th>
                                    <th>ARR (HH:MM MM/DD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map((flight) => (
                                    <tr key={flight.id}>
                                        <td>
                                            <img
                                                src={logouw}
                                                alt="Universal Weather"
                                                className="cia-logo"
                                                style={{
                                                    maxWidth: '50px',
                                                    height: 'auto',
                                                    display: 'block',
                                                    margin: '0 auto',
                                                }}
                                            />
                                        </td>
                                        <td>{flight.flight}</td>
                                        <td>{flight.origin}</td>
                                        <td>{flight.destination}</td>
                                        <td>{flight.aircraft}</td>
                                        <td>
                                            <span className={getStatusColor(flight.status)}>
                                                {flight.status}
                                            </span>
                                        </td>
                                        <td>{flight.time1}</td>
                                        <td>{flight.time2}</td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <small className="text-white mt-2 d-block">
                            Times shown in Panama time (UTC-5, 24-hour format)
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightListPage;
