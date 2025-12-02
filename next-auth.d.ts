import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      total_time?: number;
      profileImage?: string;
      stripeCustomerId?: string;
      renew?: boolean;
      subscription_date?: Date;
      subscription_amount?: number;
      role?: "user" | "admin";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    total_time?: number;
    profileImage?: string;
    stripeCustomerId?: string;
    renew?: boolean;
    subscription_date?: Date;
    subscription_amount?: number;
    role?: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    total_time?: number;
    profileImage?: string;
    stripeCustomerId?: string;
    renew?: boolean;
    subscription_date?: Date;
    subscription_amount?: number;
    role?: "user" | "admin";
  }
}
