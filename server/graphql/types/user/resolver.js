module.exports = {
    resolver: {
        Query: {
            me: (root, args, { user, userService }) =>
                userService.findByOneUser({ _id: parseInt(user.id, 10) }),
            user: (root, { name }, { userService }) => 
                userService.findByOneUser({ name }),
        },
        User: {
            id: ({ _id }) => _id,
        },
        Photo: {
            owner: ({ ownerId }, args, { userService }) =>
                userService.findOneUser({ _id: parseInt(ownerId, 10) }),
        },
    },
};
