const { UserInputError } = require('apollo-server');
const crypto = require("crypto");

/**
 * The User Service is responsible for quering and persist users.
 */
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Generate a hash of a string value.
     * @param {String} value The value to generate the hash.
     */
    getHash(value) {
        return crypto.createHash('sha256').update(value, 'utf8').digest();
    }

    /**
     * Create a user with the given username and password.
     * The password is stored as a hash.
     */
    async createUser({username, password}) {
        return await this.userRepository
            .insert({
                name: username,
                password: this.getHash(password),
            })
            .catch((e) => {
                if (e.errorType === 'uniqueViolated') {
                throw new UserInputError('username is already in use');
            }
        });
    }

    /**
     * Find a user by the given attributes.
     */
    async findOneUser(userPartial) {
        return await this.userRepository.findOne(userPartial);
    }

    /**
     * Finds a user by id and if it is found, update the user data. 
     * Just the attributes in userPartial param are updated. 
     */
    async updateUser(id, userPartial) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            return 0;
        }
        return await this.userRepository.update(id, { ...user, ...userPartial });
    }
}

module.exports = { UserService };