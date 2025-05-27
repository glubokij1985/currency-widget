import React, { useEffect, useState } from 'react';
import { getCurrency } from '../services/NewsHttpService';
import { IExchangeRateResponse } from '../models/ExchangeRateResponse.interface';
import { ICurrency } from '../models/Currency.interface';

export const CurrencyWidget: React.FC = () => {
  const [currency, setCurrency] = useState<any[]>([]);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>('USD');

  const currencyList: ICurrency[] = [
      { id: 'USD', name: 'USD' },
      { id: 'UAH', name: 'UAH' },
  ];

  useEffect(() => {
      fetchCurrency(selectedCurrencyId);
  }, [selectedCurrencyId]);

  const fetchCurrency = async (currencyId: string) => {
      try {
          const data: IExchangeRateResponse = await getCurrency(currencyId);

          setCurrency(data.conversion_rates ? Object.entries(data.conversion_rates).map(([key, value]) => ({
              title: `Exchange rate for ${key}`,
              description: `1 ${data.base_code} = ${value} ${key}`,
          })) : []);
      } catch (error) {
          console.error(error);
      }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCurrencyId(e.target.value);
  };

  return (
      <div>
          <select value={selectedCurrencyId} onChange={handleCurrencyChange}>
              {currencyList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
              ))}
          </select>

          <div>
              {currency.map((c, index) => (
                  <div key={index}>
                      <h3>{c.title}</h3>
                      <p>{c.description}</p>
                  </div>
              ))}
          </div>
      </div>
  );
};
