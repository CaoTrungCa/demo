'use client'
import TheFooter from '@/components/navigation/TheFooter'
import TheHeader from '@/components/navigation/TheHeader'
import React, { useEffect, useState } from 'react'
import { app } from "@/firebase/firebase";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { Setting } from "@/lib/collection";

interface PageContainerProps {
    className?: string
    children?: React.ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
    const db = getFirestore(app);

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
        const fetchSettingData = async () => {
            const q = query(collection(db, 'settings'));
            try {
                const querySnapshot = await getDocs(q);
                const settingDataArray: any = [];
                querySnapshot.forEach((doc) => {
                    settingDataArray.push(doc.data());
                });
                setSettingData(settingDataArray[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchSettingData();
    }, [db])

    return (
        <div>
            <TheHeader data={settingData}/>
            <div className='my-12'>
                {children}
            </div>
            <TheFooter data={settingData}/>
        </div>
    )
}
