
'use client'

import TheFooter from '@/components/navigation/TheFooter'
import TheHeader from '@/components/navigation/TheHeader'
import { SessionProvider } from 'next-auth/react'

export default function AuthProviders({ children }: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}