import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import InstagramProvider from "next-auth/providers/instagram";
import Credentials from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/utils/db/mongodb";
import { ObjectId } from "mongodb";


export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    collection: "sessions",
    databaseName: "auth",
  }),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          authType: "google",
          password: null,
          emailVerified: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          role: "user",
        };
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const client = await clientPromise;
        const db = await client.db("auth");
        const user = await db.collection("users").findOne({
          email: credentials.email,
          authType: "credentials",
        });

        if (!user) {
          throw new Error("NoUser");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("WrongPassword");
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // check if user email is verified or not and authType is credentials
      if (user.authType === "credentials") {
        if (!user.emailVerified) {
          return false;
        }
      }
      let userId = user.id || user._id;
      return true;
    },

    async jwt({ token, user, account, profile, isNewUser, trigger, session }) {
      if (trigger === "update") {
        if (session) {
          // update session
          if (session.image) {
            token.picture = session.image;
          }
        }
      }
      if (user) {
        if (user.authType === "credentials") {
          token.sub = user._id.toString();
        }

        token.authType = user.authType;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, user, token }) {
      session.user.name = token.name;
      session.user.image = token.picture;
      session.user.email = token.email;
      session.user.id = token.sub;
      session.user.authType = token.authType;
      session.user.role = token.role;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  jwt: {
    async encode({ secret, token }) {
      return jwt.sign(token, secret);
    },
    async decode({ secret, token }) {
      return jwt.verify(token, secret);
    },
  },

  // custom auth pages, overriding the built in one
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
