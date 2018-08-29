import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import PhotoList from './components/PhotoList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HeaderLinks from './components/HeaderLinks';
import './App.css';

const App = () => (
    <BrowserRouter>
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">Welcome to Instasham</h1>
                <HeaderLinks />
            </header>
            <Route exact path="/" component={PhotoList} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/register" component={RegisterForm} />
        </div>
    </BrowserRouter>
);

export default App;
