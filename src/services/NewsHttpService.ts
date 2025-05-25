import axios from 'axios';
import { IExchangeRateResponse } from '../models/ExchangeRateResponse.interface';

const API_URL = 'https://v6.exchangerate-api.com/v6/185fee37360fe842e8ab73cd/latest';

export const getCurrency = async (currencyId: string = 'USD'): Promise<IExchangeRateResponse> => {
    try {
        const response = await axios.get<IExchangeRateResponse>(`${API_URL}/${currencyId}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Could not fetch currency');
    }
};