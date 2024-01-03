import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import authOption from "./auth";

const handler = NextAuth(authOption);

export { handler as GET, handler as POST, authOption };
