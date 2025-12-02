import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./mongoose";
import User from "@/models/Users";

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectToDatabase();
          
          const user = await User.findOne({ 
            email: (credentials.email as string).toLowerCase() 
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            total_time: user.total_time,
            profileImage: user.profileImage,
            stripeCustomerId: user.stripeCustomerId,
            renew: user.renew,
            subscription_date: user.subscription_date,
            subscription_amount: user.subscription_amount,
          };
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.total_time = user.total_time;
        token.profileImage = user.profileImage;
        token.stripeCustomerId = user.stripeCustomerId;
        token.renew = user.renew;
        token.subscription_date = user.subscription_date;
        token.subscription_amount = user.subscription_amount;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.total_time = token.total_time;
        session.user.profileImage = token.profileImage;
        session.user.stripeCustomerId = token.stripeCustomerId;
        session.user.renew = token.renew;
        session.user.subscription_date = token.subscription_date;
        session.user.subscription_amount = token.subscription_amount;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
