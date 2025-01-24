import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import './AddFlightPage.css';

const AddFlightPage = ({ onAddFlight, isEdit, flights }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [newFlight, setNewFlight] = useState({
    flightNumber: '',
    origin: '',
    destination: '',
    status: 'Scheduled',
    time: ''
  });

  useEffect(() => {
    if (isEdit && id && flights) {
      const flightToEdit = flights.find(f => f.id === parseInt(id));
      if (flightToEdit) {
        setNewFlight(flightToEdit);
      }
    }
  }, [isEdit, id, flights]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFlight(newFlight);
    navigate('/home');
  };

  return (
    <div className="add-flight-container">
      <div className="add-flight-header">
        <h1>{isEdit ? 'Edit Flight' : 'Add New Flight'}</h1>
        <Button 
          variant="outline-light" 
          onClick={() => navigate('/home')}
          className="back-button"
        >
          Back
        </Button>
      </div>
      
      <div className="add-flight-form-container">
        <Form onSubmit={handleSubmit} className="add-flight-form">
          <Form.Group>
            <Form.Label>Flight Number</Form.Label>
            <Form.Control 
              type="text"
              name="flightNumber"
              value={newFlight.flightNumber}
              onChange={handleInputChange}
              placeholder="Enter flight number"
              className="form-input"
              required
            />
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Origin</Form.Label>
            <Form.Control 
              type="text"
              name="origin"
              value={newFlight.origin}
              onChange={handleInputChange}
              placeholder="Origin"
              className="form-input"
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Destination</Form.Label>
            <Form.Control 
              type="text"
              name="destination"
              value={newFlight.destination}
              onChange={handleInputChange}
              placeholder="Destination"
              className="form-input"
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select 
              name="status"
              value={newFlight.status}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Boarding">Boarding</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Time</Form.Label>
            <Form.Control 
              type="time"
              name="time"
              value={newFlight.time}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </Form.Group>

          <Button 
            variant="success" 
            type="submit" 
            className="submit-button"
          >
            {isEdit ? 'Update Flight' : 'Add Flight'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddFlightPage;
