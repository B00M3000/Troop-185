import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
  // If user is already authenticated, redirect to portal
  if (locals.session) {
    throw redirect(303, '/portal')
  }
  
  return {}
}
