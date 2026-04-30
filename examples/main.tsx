import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

import './global.less';

ReactDOM.createRoot(document.getElementById('web-chart')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
