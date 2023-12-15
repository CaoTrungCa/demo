import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '@/firebase/firebase';

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
                    const u = await query(collection(db, "users"), where("username", "==", credentials?.username))
                    const querySnapshot = await getDocs(u);
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
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },
}

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };