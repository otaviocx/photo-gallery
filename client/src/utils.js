import jwt from 'jsonwebtoken';

export const getLoggedUser = () => {
    const token = localStorage.getItem('token');
    const dtoken = jwt.decode(token);
    return dtoken;
}

export const isLoggedin = () => {
    return !!localStorage.getItem('token');
}
