module.exports = {
    resolver: {
        Mutation: {
            register: async (root, {username, password}, {userService, authService}) => {
                userService.createUser({username, password}).then(() => {
                    authService.login({username, password});
                });
            },

            login: async (root, {username, password}, {authService}) => {
                authService.login({username, password});
            },

            logout: async (root, {token}, {authService}) => {
                authService.logout(token)
            },
        },
    },
};
