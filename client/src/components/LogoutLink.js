import React, { Component } from 'react'
import Logout from '../containers/logout';
import { removeToken } from '../utils';

class LogoutLink extends Component {

    render() {
        return (
            <Logout
                onCompleted={() => {
                    removeToken();
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