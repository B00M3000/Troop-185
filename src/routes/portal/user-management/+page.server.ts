import type { Session } from '@auth/sveltekit';
import { redirect, error, fail } from '@sveltejs/kit'
import { UserSchema } from '@/server/mongo/schemas/user'
import mongo from '@/server/mongo'
import mongoose from 'mongoose'

export const load = async ({ locals, depends }) => {
  // Set up dependency for auto-refresh
  depends('user-management:data');
  
  // Check if user is authenticated
  const session = await locals.auth();
  
  if (!session) {
    throw redirect(307, "/portal/login")
  }

  // Check if user has admin role
  if (session.user?.role !== 'ADMIN') {
    throw error(403, 'Access denied. Admin role required.')
  }

  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongo()
    }

    // Fetch all users
    const users = await UserSchema.find({}).sort({ createdAt: -1 }).lean()

    // Sort users by role priority: ADMIN > ADULT > SCOUT > UNASSIGNED
    const roleOrder: Record<string, number> = { 'ADMIN': 0, 'ADULT': 1, 'SCOUT': 2, 'UNASSIGNED': 3 };
    const sortedUsers = users.sort((a, b) => {
      const aOrder = roleOrder[a.role] ?? 99;
      const bOrder = roleOrder[b.role] ?? 99;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      // If same role, sort by name
      return (a.name || '').localeCompare(b.name || '');
    });

    // Fetch auth.js sessions and accounts for display (read-only)
    const client = mongoose.connection.getClient()
    const db = client.db()
    
    const sessions = await db.collection('sessions').find({}).toArray()
    const accounts = await db.collection('accounts').find({}).toArray()

    // Get user emails from Auth.js users collection to match with sessions
    const authUsers = await db.collection('users').find({}).toArray()
    const userEmailMap = new Map(authUsers.map(user => [user._id.toString(), user.email]))

    return {
      users: sortedUsers.map(user => ({
        ...user,
        _id: user._id.toString(),
        lastActive: user.lastActive?.toISOString() || null,
        createdAt: (user as any).createdAt?.toISOString() || null,
        updatedAt: (user as any).updatedAt?.toISOString() || null,
      })),
      sessions: sessions.map(session => ({
        _id: session._id.toString(),
        userId: session.userId?.toString() || null,
        userEmail: userEmailMap.get(session.userId?.toString()) || session.userEmail || 'Unknown',
        expires: session.expires?.toISOString() || null,
        sessionToken: session.sessionToken || null
      })),
      accounts: accounts.map(account => ({
        _id: account._id.toString(),
        userId: account.userId?.toString() || null,
        userEmail: userEmailMap.get(account.userId?.toString()) || 'Unknown',
        provider: account.provider || 'Unknown',
        providerAccountId: account.providerAccountId || 'Unknown',
        type: account.type || 'oauth'
      }))
    }
  } catch (err) {
    console.error('Error loading user management data:', err)
    throw error(500, 'Failed to load user management data')
  }
}

export const actions = {
  updateUserRole: async ({ request, locals }) => {
    const session = await locals.auth();
    
    if (!session || session.user?.role !== 'ADMIN') {
      throw error(403, 'Access denied. Admin role required.')
    }

    try {
      const formData = await request.formData()
      const userId = formData.get('userId') as string
      const newRole = formData.get('role') as string

      if (!userId || !newRole) {
        return fail(400, { error: 'Missing required fields' })
      }

      // Validate role
      const validRoles = ['UNASSIGNED', 'SCOUT', 'ADULT', 'ADMIN']
      if (!validRoles.includes(newRole)) {
        return fail(400, { error: 'Invalid role' })
      }

      // Ensure MongoDB connection
      if (mongoose.connection.readyState === 0) {
        await mongo()
      }

      // Update user role
      const updatedUser = await UserSchema.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
      )

      if (!updatedUser) {
        return fail(404, { error: 'User not found' })
      }

      return { 
        success: true, 
        message: `Successfully updated ${updatedUser.name}'s role to ${newRole}` 
      }
    } catch (err) {
      console.error('Error updating user role:', err)
      return fail(500, { error: 'Failed to update user role' })
    }
  },

  revokeAllSessions: async ({ request, locals }) => {
    const session = await locals.auth();
    
    if (!session) {
      throw error(401, 'Authentication required')
    }

    try {
      const formData = await request.formData()
      const userId = formData.get('userId') as string

      // Users can only revoke their own sessions unless they're admin
      if (session.user?.role !== 'ADMIN' && userId !== session.user?.id) {
        throw error(403, 'Access denied. Can only revoke your own sessions.')
      }

      // Ensure MongoDB connection
      if (mongoose.connection.readyState === 0) {
        await mongo()
      }

      // Get the user's email from our custom schema
      const user = await UserSchema.findById(userId)
      if (!user) {
        return fail(404, { error: 'User not found' })
      }

      // Revoke all sessions for this user by deleting them from auth.js sessions
      const client = mongoose.connection.getClient()
      const db = client.db()
      
      // Find the corresponding Auth.js user to get their ObjectId
      const authUser = await db.collection('users').findOne({ email: user.email })
      if (!authUser) {
        return fail(404, { error: 'Auth user not found' })
      }
      
      const result = await db.collection('sessions').deleteMany({
        userId: authUser._id
      })

      return { 
        success: true, 
        message: `Revoked ${result.deletedCount} sessions for user ${user.name}` 
      }
    } catch (err) {
      console.error('Error revoking sessions:', err)
      return fail(500, { error: 'Failed to revoke sessions' })
    }
  },

  updateUserAnnotation: async ({ request, locals }) => {
    const session = await locals.auth();
    
    if (!session || session.user?.role !== 'ADMIN') {
      throw error(403, 'Access denied. Admin role required.')
    }

    try {
      const formData = await request.formData()
      const userId = formData.get('userId') as string
      const annotation = formData.get('annotation') as string

      if (!userId) {
        return fail(400, { error: 'Missing user ID' })
      }

      // Ensure MongoDB connection
      if (mongoose.connection.readyState === 0) {
        await mongo()
      }

      // Update user annotation
      const updatedUser = await UserSchema.findByIdAndUpdate(
        userId,
        { annotation: annotation || null }, // Allow empty string to clear annotation
        { new: true }
      )

      if (!updatedUser) {
        return fail(404, { error: 'User not found' })
      }
      
      return { 
        success: true, 
        message: annotation 
          ? `Successfully updated annotation for ${updatedUser.name}` 
          : `Successfully cleared annotation for ${updatedUser.name}`
      }
    } catch (err) {
      console.error('Error updating user annotation:', err)
      return fail(500, { error: 'Failed to update user annotation' })
    }
  }
}
