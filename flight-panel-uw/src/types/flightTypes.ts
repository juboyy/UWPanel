export interface ApiFlightResponse {
  departure: string;
  destination: string;
  aircraftRegistration: string;
  filingStatus: string;
  departureTime: string;
  arrivalTime: string;
  callSign: string;
}

export interface Flight {
  id: number;
  airline: string;
  flight: string; // callSign from API
  origin: string; // departure from API
  destination: string;
  aircraft: string; // aircraftRegistration from API
  status: string; // filingStatus from API
  time1: string; // departureTime from API
  time2: string; // arrivalTime from API
}
