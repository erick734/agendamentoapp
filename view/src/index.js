import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './route';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </React.StrictMode>
);