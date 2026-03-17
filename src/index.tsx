import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppDataProvider } from './store/AppDataProvider';
import reducer, { initialState } from './store/reducer';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <AppDataProvider initialState={initialState} reducer={reducer}>
    <App />
  </AppDataProvider>
);
