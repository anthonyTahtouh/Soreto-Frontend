import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import 'prismjs/themes/prism-coy.css';
import Login from './pages/Login';
import StoreProvider from './store/Provider';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
