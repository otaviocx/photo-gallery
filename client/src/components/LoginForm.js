import React, { Component } from 'react'
import Login from '../containers/login'
import UserForm from './UserForm'
import './Forms.css'

class LoginForm extends Component {

    render() {
        return (
            <Login
                onCompleted={({ login }) => {
                    localStorage.setItem('token', login);
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