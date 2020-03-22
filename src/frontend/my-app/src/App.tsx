import React from 'react';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Workspace from './pages/workspace';
import Login from './pages/Login/login';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Login} />
      <Route exact path="/home" component={Workspace} />
    </BrowserRouter>
  );
}

export default App;
