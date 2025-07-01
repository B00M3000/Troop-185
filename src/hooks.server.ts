import { sequence } from '@sveltejs/kit/hooks'
import { handle as authHandle } from '@/server/auth'
import mongo from "@/server/mongo"
import type { Handle } from '@sveltejs/kit'
import type { Session } from '@auth/sveltekit'

const appHandle: Handle = async ({ event, resolve }) => {
    await mongo()
    
    const response = await resolve(event)
    return response
}

export const handle = sequence(authHandle, appHandle)
