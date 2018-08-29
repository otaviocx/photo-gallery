import React, { Component } from 'react'
import Register from '../containers/register'
import UserForm from './UserForm'
import { setToken } from '../utils';

import './Forms.css'

class RegisterForm extends Component {

    render() {
        return (
            <Register
                onCompleted={({ register }) => {
                    setToken(register);
                    this.props.history.push('/');
                    window.location.reload();
                }}
            >
                {(registerMutation, { loading, error }) => (
                    <UserForm externalError={error} actionName="Register" onSubmit={(formFields) => {
                        registerMutation({variables: formFields});                        
                    }} />
                )}
            </Register>
        )
    }

}

export default RegisterForm;