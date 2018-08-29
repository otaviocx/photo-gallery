import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import LogoutLink from './LogoutLink';

function isLoggedin() {
    return !!localStorage.getItem('token');
}

function getUserName() {
    const token = localStorage.getItem('token');
    const dtoken = jwt.decode(token);
    return dtoken.name;
}

class HeaderLinks extends Component {

    render() {
        if(isLoggedin()) {
            return (
                <div>
                    <span className="welcome">Hello, {getUserName()}! </span>
                    <LogoutLink />
                </div>
            )
        } else {
            return (
                <div>
                    <Link className="button" to="/login">Login</Link>
                    <Link className="button" to="/register">Register</Link>
                </div>
            )
        }
    }

}

export default HeaderLinks;