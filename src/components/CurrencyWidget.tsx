import React, { useEffect, useState } from 'react';
import { getCurrency, getCurrencyList } from '../services/CurrencyHttpService';
import { IExchangeRateResponse } from '../models/ExchangeRateResponse.interface';
import { ICurrency } from '../models/Currency.interface';
import { Autocomplete, Box, Card, CardContent, FormControl, TextField, Typography } from '@mui/material';
import { IDisplayedCurrency } from '../models/DisplayedCurrency.interface';
import './CurrencyWidget.scss';

export const CurrencyWidget: React.FC = () => {
    const [currency, setCurrency] = useState<IDisplayedCurrency[]>([]);
    const [timeLastUpdate, setTimeLastUpdate] = useState<string>('');
    const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>('UAH');
    const [currencyList, setCurrencyList] = useState<ICurrency[]>([]);

    useEffect(() => {
        fetchCurrency(selectedCurrencyId);
    }, [selectedCurrencyId]);

    useEffect(() => {
        loadCurrencyList();
    }, []);


    const fetchCurrency = async (currencyId: string) => {
        const data: IExchangeRateResponse = await getCurrency(currencyId);

        setCurrency(data.conversion_rates ? Object.entries(data.conversion_rates)
            .filter(([key]) => key !== data.base_code)
            .map(([key, value]) => ({
                title: `Exchange rate for ${key}`,
                description: `1 ${data.base_code} = ${value.toFixed(2)} ${key}`,
            })) : []);

        setTimeLastUpdate(data.time_last_update_utc || 'No update time available');
    };

    const loadCurrencyList = async () => {
        const list = await getCurrencyList();
        setCurrencyList(list);
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 800, height: '100%', margin: '0 auto', padding: 2 }}>
            <Box sx={{ flex: '0 0 auto' }}>
                <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <Autocomplete
                        options={currencyList}
                        getOptionLabel={(option) => `${option.id} - ${option.name}`}
                        value={currencyList.find((c) => c.id === selectedCurrencyId) || null}
                        onChange={(event, newValue) => {
                            if (newValue) {
                                setSelectedCurrencyId(newValue.id);
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label="Currency" />}
                    />
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
            </Box>
            <Box sx={{ flexGrow: 1, display: 'grid', marginBottom: 3, gap: 2, overflow: 'auto' }}>
                {currency.map((c, index) => (
                    <Card key={index} sx={{ display: 'flex', flexDirection: 'row', gap: 2, minHeight: 93 }}>
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
