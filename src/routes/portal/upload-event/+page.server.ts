import type { Session } from '@auth/sveltekit';
import { redirect, error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
  // Check if user is authenticated
  const session = await locals.auth();
  
  if (!session) {
    throw redirect(307, "/portal/login")
  }

  // Check if user has admin role
  if (session.user?.role !== 'ADMIN') {
    throw error(403, 'Access denied. Admin role required.')
  }
}