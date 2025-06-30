import mongo from "@/server/mongo";
import { UserSchema } from "@/server/mongo/schemas/user";

export const handle = async ({ event, resolve }) => {
    await mongo();

    const session_token = event.cookies.get("session_token");

    if (session_token) {
        const user = await UserSchema.findOne({ session_token });
        if (user) {
            event.locals.user = user;
        }
    }

    const response = await resolve(event);

    return response;
};
