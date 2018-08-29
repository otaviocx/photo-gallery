import React, { Component } from 'react'
import Login from '../containers/login'
import UserForm from './UserForm'
import { setToken } from '../utils';
import './Forms.css'

class LoginForm extends Component {

    render() {
        return (
            <Login
                onCompleted={({ login }) => {
                    setToken(login);
                    this.props.history.push('/');
                    window.location.reload();
                }}
            >
                {(loginMutation, { loading, error }) => (
                    <UserForm externalError={error} loading={loading} actionName="Login" onSubmit={(formFields) => {
                        loginMutation({variables: formFields});                        
                    }} />
                )}
            </Login>
        )
    }

}

export default LoginForm;