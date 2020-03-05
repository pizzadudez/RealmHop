import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';

import store from './store';
import App from './App';

const GlobalStyle = createGlobalStyle`
  html {
    font-family: "Raleway","Proxima Nova","Montserrat",
    "Segoe UI",Roboto,Oxygen-Sans,
    Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #333;
    overflow: hidden;
  }
`;

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>,
  document.getElementById('root')
);
