'use client'
import TheFooter from '@/components/navigation/TheFooter'
import TheHeader from '@/components/navigation/TheHeader'
import React, { useEffect, useState } from 'react'
import { Setting } from "@/lib/collection";
import { fetchDataSetting } from '@/lib/utils/fetchData';

interface PageContainerProps {
    className?: string
    children?: React.ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
    const [settingData, setSettingData] = useState<Setting>({
        create_date: "",
        id: "",
        logo: "",
        web_name: "",
        address: "",
        phone: "",
        email: "",
        link_facebook: "",
        link_tiktok: "",
        link_github: "",
        link_youtube: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDataSetting();
            setSettingData(data);
        }
        fetchData();
    }, [])

    return (
        <div>
            <TheHeader data={settingData}/>
            <div className='my-12 container mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:px-8 text-center'>
                {children}
            </div>
            <TheFooter data={settingData}/>
        </div>
    )
}
