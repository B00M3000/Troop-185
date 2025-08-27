import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/core/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import mongo from "@/server/mongo"
import mongoose from "mongoose"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET, MONGO_URI, AUTH_TRUST_HOST } from "$env/static/private"
import { UserSchema } from "@/server/mongo/schemas/user"
import type { DefaultSession } from "@auth/core/types"

// Extend the session type to include role and image
declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string
      role: "UNASSIGNED" | "SCOUT" | "ADULT" | "ADMIN"
      image?: string
    } & DefaultSession["user"]
  }
}

const client = new MongoClient(MONGO_URI)
const clientPromise = client.connect()

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile"
        }
      }
    })
  ],
  secret: AUTH_SECRET,
  session: {
    strategy: "database",
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  trustHost: AUTH_TRUST_HOST == "true",
  callbacks: {
    async session({ session, user }) {
      if (session.user?.email) {
        try {
          // Get user from our MongoDB schema to include role and image
          const dbUser = await UserSchema.findOne({ email: session.user.email })
          if (dbUser) {
            session.user.id = dbUser._id.toString()
            session.user.role = dbUser.role
            session.user.image = dbUser.image
            
            // Update lastActive
            await UserSchema.findByIdAndUpdate(dbUser._id, {
              lastActive: new Date()
            })
          }
        } catch (error) {
          console.error('Error in session callback:', error)
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        try {
          // Ensure MongoDB connection for Mongoose

          if (mongoose.connection.readyState === 0) {
            await mongo()
          }

          // Check if user exists in our custom schema
          let existingUser = await UserSchema.findOne({ email: user.email })
          
          if (!existingUser) {
            // Create new user with default UNASSIGNED role and profile info
            existingUser = new UserSchema({
              name: user.name || profile?.name || '',
              email: user.email,
              image: user.image || profile?.picture,
              role: 'UNASSIGNED', // Default role until admin assigns
              lastActive: new Date()
            })
            await existingUser.save()
          } else {
            // Update existing user's info including profile picture
            await UserSchema.findByIdAndUpdate(existingUser._id, {
              name: user.name || profile?.name || existingUser.name,
              image: user.image || profile?.picture || existingUser.image,
              lastActive: new Date()
            })
          }
          
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false // Prevent sign-in on error
        }
      }
      return false // Prevent sign-in if not using Google
    }
  },
  pages: {
    signIn: '/portal/login',
    error: '/portal/login'
  },
  // debug: process.env.NODE_ENV === 'development'
})
