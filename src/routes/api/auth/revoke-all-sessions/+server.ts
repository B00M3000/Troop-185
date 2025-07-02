import { json, error } from '@sveltejs/kit'
import { UserSchema } from '@/server/mongo/schemas/user'
import mongo from '@/server/mongo'
import mongoose from 'mongoose'

export async function POST({ locals, request }) {
  const session = await locals.auth();
  
  if (!session || !session.user) {
    throw error(401, 'Authentication required')
  }

  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongo()
    }

    // Get the user's email from our custom schema
    const user = await UserSchema.findById(session.user.id)
    if (!user) {
      throw error(404, 'User not found')
    }

    // Revoke all sessions for this user by deleting them from auth.js sessions
    const client = mongoose.connection.getClient()
    const db = client.db('Development1')
    
    // Find the corresponding Auth.js user to get their ObjectId
    const authUser = await db.collection('users').findOne({ email: user.email })
    if (!authUser) {
      throw error(404, 'Auth user not found')
    }
    
    const result = await db.collection('sessions').deleteMany({
      userId: authUser._id
    })

    return json({ 
      success: true, 
      message: `Successfully signed out of ${result.deletedCount} sessions`,
      deletedCount: result.deletedCount
    })

  } catch (err) {
    console.error('Error revoking user sessions:', err)
    throw error(500, 'Failed to revoke sessions')
  }
}
