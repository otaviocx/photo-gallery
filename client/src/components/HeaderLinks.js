import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import LogoutLink from './LogoutLink';
import { getLoggedUser, isLoggedin } from '../utils';

class HeaderLinks extends Component {

    render() {
        if(isLoggedin()) {
            return (
                <div>
                    <span className="welcome">Hello, {getLoggedUser().name}! </span>
                    <Link className="button" to="/upload">Upload Image</Link>
                    <LogoutLink />
                </div>
            )
        } else {
            return (
                <div>
                    <Link className="button" to="/">Home</Link>
                    <Link className="button" to="/login">Login</Link>
                    <Link className="button" to="/register">Register</Link>
                </div>
            )
        }
    }

}

export default HeaderLinks;