import { _discriminatedUnion } from 'zod/v4/core';

export async function load({ locals, depends }) {
    depends("app:user")

    if (!locals.user) {
        return {
            user: null,
            isAuthenticated: false
        };
    }

    return {
        user: { ...locals.user.toObject(), _id: locals.user._id.toString() },
        isAuthenticated: true
    };
}
