import jwt from 'jsonwebtoken';

export const getToken = () => {
    return localStorage.getItem('token');
}

export const setToken = (token) => {
    return localStorage.setItem('token', token);
}

export const removeToken = () => {
    return localStorage.removeItem('token');
}

export const getLoggedUser = () => {
    const token = getToken();
    const dtoken = jwt.decode(token);
    return dtoken;
}

export const isLoggedin = () => {
    return !!getToken();
}
