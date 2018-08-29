import React, { Component } from 'react'
import Logout from '../containers/logout';

class LogoutLink extends Component {

    render() {
        return (
            <Logout
                onCompleted={() => {
                    localStorage.removeItem('token');
                    window.location.href = "/";
                }}
            >
                {(logoutMutation) => (
                    <button className="button" onClick={logoutMutation}>Logout</button>
                )}
            </Logout>
        )
    }

}

export default LogoutLink;