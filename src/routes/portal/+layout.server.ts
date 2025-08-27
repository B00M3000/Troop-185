import type { Session } from '@auth/sveltekit';
import { redirect } from '@sveltejs/kit'

export const load = async ({ url, locals }) => {
  // Check if user is authenticated via Auth.js
  const session = await locals.auth();

  console.log(session)

  // If not on login page and not authenticated, redirect to login
  if (url.pathname !== "/portal/login" && !session) {
    throw redirect(307, "/portal/login")
  }

  return {
    session: session as Session
  }
}
