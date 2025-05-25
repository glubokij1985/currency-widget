import React from 'react';
import { createRoot } from 'react-dom/client';
import { CurrencyWidget } from './components/CurrencyWidget';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<CurrencyWidget />);
