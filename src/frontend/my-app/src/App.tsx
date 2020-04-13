import React from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import Workspace from './pages/workspace';
import Login from './pages/Login/login';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

function App() {
  return (
    <BrowserRouter>
      <Route
        exact
        path="/login"
        render={() =>
          sessionStorage.getItem('session') === null ? (
            <Login />
          ) : (
            <Redirect to={{ pathname: '/' }} />
          )
        }
      />
      <Route
        path="/"
        render={() =>
          sessionStorage.getItem('session') === null ? (
            <Redirect to={{ pathname: '/login' }} />
          ) : (
            <Workspace />
          )
        }
      />
    </BrowserRouter>
  );
}

export default App;
