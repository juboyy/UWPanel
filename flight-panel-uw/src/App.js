import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import FlightBoard from './FlightBoard';
import AddFlightPage from './AddFlightPage';
import FlightService from './services/flightService.ts';

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const flightService = useMemo(() => new FlightService(), []);

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        const data = await flightService.getAllFlights();
        setFlights(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error in loadFlights:', err);
        setError('Failed to load flights - Using backup data');
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
    const interval = setInterval(loadFlights, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [flightService]);

  const handleAddFlight = (newFlight) => {
    const flightToAdd = {
      ...newFlight,
      id: flights.length + 1
    };
    setFlights([...flights, flightToAdd]);
  };

  const handleEditFlight = (editedFlight) => {
    setFlights(flights.map(flight => 
      flight.id === editedFlight.id ? editedFlight : flight
    ));
  };

  const handleDeleteFlight = (flightId) => {
    setFlights(flights.filter(flight => flight.id !== flightId));
  };

  // Only show loading when we have no flights
  if (loading && flights.length === 0) {
    return <div className="loading">Loading flights...</div>;
  }

  // Don't show error if we have flights to display
  if (error) {
    console.log('Error state but continuing with available flights');
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route 
            path="/home" 
            element={
              <FlightBoard 
                flights={flights} 
                onEditFlight={handleEditFlight}
                onDeleteFlight={handleDeleteFlight}
              />
            } 
          />
        
          <Route 
            path="/form" 
            element={
              <AddFlightPage 
                onAddFlight={handleAddFlight} 
              />
            } 
          />         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
