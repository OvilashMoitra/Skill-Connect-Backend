import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import ApiError from '../errors/ApiError';


const hashPassword = async (password: string) => {
    console.log(password);
    try {
        const hashedPassword = await bcrypt.hash(password, Number(config.bycrypt_salt_rounds));
        console.log(hashedPassword, "hashedPassword");
        return hashedPassword;
    } catch (err) {
        console.log(err);
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Error hashing the password',
        );
    }
};





const compareHashPassword = async (
    givenPassword: string,
    hashedPassword: string,
) => {
    try {
        const isSame = await bcrypt.compare(givenPassword, hashedPassword);
        return isSame;
    } catch (error) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Error comparing password',
        );
    }
};

// Exclude keys from user
// Exclude keys from user
// Exclude keys from user
// Exclude keys from user
// Exclude keys from user
function exclude(
    user: Record<string, any>,
    keys: string
) {

    const filteredEntries: [string, unknown][] = Object.entries(user)
        .filter(([key]) => !keys.includes(key))
        .map(([key, value]: [string, unknown]) => [key, value]);

    return Object.fromEntries(filteredEntries);
}




export const passwordHelpers = {
    hashPassword,
    compareHashPassword,
    exclude
};
