import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { UserSchema } from "@/server/mongo/schemas/user";
import { hashPassword } from "@/server/hash";

const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required")
  .trim();
const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters")
  .trim();

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    // Validate email separately
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      return fail(400, {
        error: emailValidation.error.errors[0].message,
        email,
      });
    }

    // Validate password separately
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      return fail(400, {
        error: passwordValidation.error.errors[0].message,
        email,
      });
    }

    const validEmail = emailValidation.data;
    const validPassword = passwordValidation.data;

    let sucess = false;

    try {
      // Find user by email
      const user = await UserSchema.findOne({ email: validEmail });

      if (!user) {
        return fail(401, {
          error: "Invalid email or password",
          email: validEmail,
        });
      }

      const hashedPassword = hashPassword(validPassword);

      if(hashedPassword !== user.password_hash) {
        return fail(401, {
          error: "Invalid email or password",
            email: validEmail,
        });
      }

      // Generate session token
      const sessionToken = generateSessionToken();

      // Update user with session token
      await UserSchema.findByIdAndUpdate(user._id, {
        session_token: sessionToken,
        lastActive: new Date(),
      });

      // Set session cookie
      cookies.set("session_token", sessionToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days (maybe move invalidation and refreshing server-side)
      });

      sucess = true;
    } catch (error) {
      console.error("Login error:", error);
      return fail(500, {
        error: "An error occurred during login. Please try again.",
        email: validEmail,
      });
    }
    if (sucess) return redirect(303, "/portal");
  },

  logout: async ({ cookies }) => {
    // Get session token from cookies
    const sessionToken = cookies.get("session_token");

    if (sessionToken) {
      try {

        // Remove session token from user
        await UserSchema.findOneAndUpdate(
          { session_token: sessionToken },
          { $unset: { session_token: 1 } }
        );
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    // Delete session cookie
    cookies.delete("session_token", { path: "/" });

    // Redirect to login page
    return redirect(303, "/portal/login");
  },
};

function generateSessionToken(): string {
  return crypto.randomUUID() + "-" + Date.now();
}
