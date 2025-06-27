import axios from 'axios';
import { IExchangeRateResponse } from '../models/ExchangeRateResponse.interface';
import { ICurrency } from '../models/Currency.interface';

const API_URL = 'https://v6.exchangerate-api.com/v6/185fee37360fe842e8ab73cd/latest';
const API_CODES_URL = 'https://v6.exchangerate-api.com/v6/185fee37360fe842e8ab73cd/codes';

export const getCurrency = async (currencyId: string = 'USD'): Promise<IExchangeRateResponse> => {
    const response = await axios.get<IExchangeRateResponse>(`${API_URL}/${currencyId}`);

    return response.data;
};

export const getCurrencyList = async (): Promise<ICurrency[]> => {
    const response = await axios.get(API_CODES_URL);

    if (response.data.result === 'success') {
        const currencies: ICurrency[] = response.data.supported_codes.map(
            ([id, name]: [string, string]) => ({
                id,
                name,
            })
        );

        return currencies;
    }

    throw new Error('Currency list fetch failed');
};