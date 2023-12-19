import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '@/firebase/firebase';
import { User } from "@/lib/collection";

export const OPTIONS: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                }
            },
            async authorize(credentials) {
                const db = getFirestore(app);
                let userDataArray: any = [];
                try {
                    const user = await query(collection(db, "users"), where("username", "==", credentials?.username))
                    const querySnapshot = await getDocs(user);
                    querySnapshot.forEach((doc) => {
                        userDataArray.push(doc.data());
                    });
                } catch (error) {
                    console.error('Error fetching data:', error);
                }

                const user = userDataArray[0]

                if (credentials?.username === user.username && credentials?.password === user.password) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user: User | null }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    create_date: user.create_date,
                    name: user.name,
                    avatar: user.avatar,
                    birthday: user.birthday,
                    address: user.address,
                    email: user.email,
                    phone: user.phone,
                    username: user.username,
                    password: user.password,
                    is_admin: user.is_admin,
                };
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    create_date: token.create_date,
                    name: token.name,
                    avatar: token.avatar,
                    birthday: token.birthday,
                    address: token.address,
                    email: token.email,
                    phone: token.phone,
                    username: token.username,
                    password: token.password,
                    is_admin: token.is_admin,
                },
            };
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        signOut: "/"
    },
}

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };