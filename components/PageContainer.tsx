import TheFooter from '@/components/navigation/TheFooter'
import TheHeader from '@/components/navigation/TheHeader'
import React from 'react'

interface PageContainerProps {
  className?: string
  children?: React.ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
    return (
        <div>
            <TheHeader/>
            <div className='my-12'>
                {children}
            </div>
            <TheFooter/>
        </div>
    )
}
