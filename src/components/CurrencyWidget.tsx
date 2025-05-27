import React, { useEffect, useState } from 'react';
import { getCurrency } from '../services/NewsHttpService';
import { IExchangeRateResponse } from '../models/ExchangeRateResponse.interface';
import { ICurrency } from '../models/Currency.interface';
import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { IDisplayedCurrency } from '../models/DisplayedCurrency.interface';

export const CurrencyWidget: React.FC = () => {
  const [currency, setCurrency] = useState<IDisplayedCurrency[]>([]);
  const [timeLastUpdate, setTimeLastUpdate] = useState<string>('');
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

          setTimeLastUpdate(data.time_last_update_utc || 'No update time available');
      } catch (error) {
          console.error(error);
      }
  };

  const handleCurrencyChange = (e: SelectChangeEvent) => {
      setSelectedCurrencyId(e.target.value);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
        <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <InputLabel id="currency-select-label">Currency</InputLabel>
            <Select
                labelId="currency-select-label"
                value={selectedCurrencyId}
                label="Currency"
                onChange={handleCurrencyChange}
            >
                {currencyList.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                        {c.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary">
            Last update:{' '}
            {timeLastUpdate
                ? new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(new Date(timeLastUpdate))
                : 'Loading...'}
        </Typography>
        <Box display="grid" gap={2}>
            {currency.map((c, index) => (
                <Card key={index} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            <Typography variant="h6">{c.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {c.description}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            ))}
        </Box>
    </Box>
  );
};
