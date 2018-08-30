import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './Forms.css'

class UserForm extends Component {

    state = {
        username: '',
        password: '',
        error: '',
    }

    render() {
        const { username, password, error } = this.state;
        const { externalError, onSubmit, actionName } = this.props;
        return (
            <form className="bordered-form" onSubmit={(e) => {
                e.preventDefault();
                if (!this.state.username || !this.state.password) {
                    this.setState({ error: 'All fields are required!' });
                    return;
                }
                onSubmit({username, password})
            }}>
            {(error || externalError) && (
                <p className="error-message">{error || externalError.message}</p>
            )}
                <label htmlFor="username">Username: </label>
                <input 
                    className="text-field" 
                    name="username" 
                    value={username} 
                    onChange={e => this.setState({ username: e.target.value })}
                />
                <label htmlFor="password">Password: </label>
                <input 
                    className="text-field" 
                    name="password"
                    type="password" 
                    value={password} 
                    onChange={e => this.setState({ password: e.target.value })}
                />
                <button type="submit" className="button">{actionName}</button>
            </form>
        )
    }
}

UserForm.propTypes = {
    onSubmit: PropTypes.func,
    externalError: PropTypes.object,
    actionName: PropTypes.string,
    loading: PropTypes.bool,
};

export default UserForm;