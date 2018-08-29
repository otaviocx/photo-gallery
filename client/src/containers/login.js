import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)
    }
`;

const Login = ({ children, variables, onError, onCompleted }) => (
    <Mutation onCompleted={onCompleted} onError={onError} mutation={LOGIN} variables={variables}>
        {children}
    </Mutation>
);

Login.propTypes = {
    onError: PropTypes.func,
    onCompleted: PropTypes.func,
    children: PropTypes.func.isRequired,
};

export default Login;