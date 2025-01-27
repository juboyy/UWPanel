import axios from 'axios';
import { Flight } from '../types/flightTypes';
import { DateTime } from 'luxon';

const API_KEY = 's2NNDar9HUSM5MaOqHllc98OxRbK5mx5tRw1H7LD/ws=';
const API_URL = ''; // URL vazia para usar paths relativos
const DEFAULT_AIRLINE = 'Universal Weather';

interface ApiResponse {
  flights: {
    departure: string;
    destination: string;
    aircraftRegistration: string;
    filingStatus: string;
    departureTime: string;
    arrivalTime: string;
    callSign: string;
  }[];
  warnings: any[];
}

export class FlightService {
  private api = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    timeout: 15000, // Aumentado para 15 segundos
  });

  private readonly PANAMA_TIMEZONE = 'America/Panama';

  // Converter UTC para o horário do Panamá usando Luxon
  private convertUTCToPanama(utcDate: string): DateTime {
    return DateTime.fromISO(utcDate, { zone: 'utc' }).setZone(this.PANAMA_TIMEZONE);
  }

  // Formatar a data para exibição no fuso horário do Panamá
  private formatFlightTime(date: DateTime): string {
    return date.toFormat('MM/dd/yyyy HH:mm');
  }

  // Obter o horário atual no fuso horário do Panamá
  private getCurrentPanamaTime(): DateTime {
    return DateTime.now().setZone(this.PANAMA_TIMEZONE);
  }

  // Verificar se duas datas são no mesmo dia
  private isSameDay(date1: DateTime, date2: DateTime): boolean {
    return date1.hasSame(date2, 'day', {});
  }

  // Atualizar o status do voo com base no horário de partida, chegada e status de filing
  private getFlightStatus(
    filingStatus: string,
    departureTime: DateTime,
    now: DateTime,
    arrivalTime: DateTime
  ): string {
    const timeDiffDeparture = departureTime.toMillis() - now.toMillis();
    const hoursUntilDeparture = timeDiffDeparture / (1000 * 60 * 60);

    // Nova condição: Se estiver entre o horário de partida e chegada
    if (now >= departureTime && now <= arrivalTime) {
      return 'In Flight'; // Avião está voando
    }

    if (filingStatus === 'None') {
      if (hoursUntilDeparture < 0) {
        return 'Completed'; // Voo completado
      } else if (hoursUntilDeparture <= 1) {
        return 'Boarding';
      } else if (hoursUntilDeparture <= 2) {
        return 'Scheduled';
      }
    }

    return filingStatus; // Retorna o status original caso não se encaixe
  }

  async getAllFlights(): Promise<Flight[]> {
    try {
      const response = await this.api.get<ApiResponse>('/api/flights');

      if (!response.data || !response.data.flights) {
        console.warn('No flights data received from API');
        return this.getMockFlights();
      }

      const nowInPanama = this.getCurrentPanamaTime();

      return response.data.flights
        .map((flight, index) => {
          const departurePanama = this.convertUTCToPanama(flight.departureTime);
          const arrivalPanama = this.convertUTCToPanama(flight.arrivalTime);
          const timeDifference =
            departurePanama.toMillis() - nowInPanama.toMillis();

          return {
            id: index + 1,
            airline: DEFAULT_AIRLINE,
            flight: flight.callSign || 'N/A',
            origin: flight.departure || '',
            destination: flight.destination || '',
            aircraft: flight.aircraftRegistration || '',
            status: this.getFlightStatus(
              flight.filingStatus,
              departurePanama,
              nowInPanama,
              arrivalPanama
            ),
            time1: this.formatFlightTime(departurePanama),
            time2: this.formatFlightTime(arrivalPanama),
            departureTime: departurePanama.toMillis(),
            departureDate: departurePanama,
            timeDifference,
          };
        })
        .sort((a, b) => {
          if (a.status === 'Completed' && b.status !== 'Completed') return 1;
          if (b.status === 'Completed' && a.status !== 'Completed') return -1;

          const isAToday = this.isSameDay(
            a.departureDate as DateTime,
            nowInPanama
          );
          const isBToday = this.isSameDay(
            b.departureDate as DateTime,
            nowInPanama
          );

          if (isAToday && !isBToday) return -1;
          if (!isAToday && isBToday) return 1;

          return a.departureTime - b.departureTime;
        });
    } catch (error: any) {
      // Melhorar o log de erro para debug
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      return this.getMockFlights();
    }
  }

  private getMockFlights(): Flight[] {
    const now = this.getCurrentPanamaTime();
    return [
      {
        id: 1,
        airline: DEFAULT_AIRLINE,
        flight: 'UCG321',
        origin: 'SEGU',
        destination: 'MPTO',
        aircraft: 'HP1939',
        status: 'Completed',
        time1: this.formatFlightTime(now.minus({ hours: 1 })),
        time2: this.formatFlightTime(now),
      },
      {
        id: 2,
        airline: DEFAULT_AIRLINE,
        flight: 'UVW456',
        origin: 'KIAH',
        destination: 'KMIA',
        aircraft: 'N456UV',
        status: 'Scheduled',
        time1: this.formatFlightTime(now.plus({ hours: 1 })),
        time2: this.formatFlightTime(now.plus({ hours: 2 })),
      },
    ];
  }
}

export default FlightService;
