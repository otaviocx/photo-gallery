module.exports = {
    resolver: {
        Mutation: {
            register: async (root, {username, password}, {userService, authService}) => {
                await userService.createUser({username, password});
                return authService.login({username, password});
            },

            login: async (root, {username, password}, {authService}) => {
                return authService.login({username, password});
            },

            logout: async (root, args, {token, authService}) => {
                return authService.logout(token);
            },
        },
    },
};
