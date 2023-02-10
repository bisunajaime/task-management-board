import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppDataProvider } from './state/AppDataProvider';
import reducer, { initialState } from './state/reducer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppDataProvider initialState={initialState} reducer={reducer} >
      <App />
    </AppDataProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
