// src/hooks.ts
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const session_token = event.cookies.get("session_token");

  if (session_token) {
    // Import only when needed on server-side
    const { default: connectDB } = await import("./server/mongo/index.js");
    const { UserSchema } = await import("./server/mongo/schemas/user.js");

    try {
      await connectDB();
      const user = await UserSchema.findOne({ session_token });
      if (user) {
        event.locals.user = user;
      }
    } catch (error) {
      console.error("Error in hooks:", error);
    }
  }

  const response = await resolve(event);

  return response;
};
