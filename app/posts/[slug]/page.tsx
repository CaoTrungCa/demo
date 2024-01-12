'use client'
import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import { fetchDetailPost } from "@/lib/utils/fetchData";
import Image from "next/image";

export default function Posts({ params }: { params: any }) {
    const [postData, setPostData] = useState({
        title: "",
        slug: "",
        status: "",
        categories: "",
        image: "",
        content: "",
        user_created: "",
        date_created: "",
        user_updated: "",
        date_updated: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDetailPost(params.slug);
            setPostData(data);
        }
        fetchData();
    }, [params.slug]);

    return (
        <PageContainer>
            <div>
                <div>
                    <Image src={postData.image ? postData.image : '/user/bg_default.jpg'} height={100} width={100} alt={postData.title}
                        className="h-auto w-full" />
                </div>
                <div>
                    {postData.title}
                </div>
                <div dangerouslySetInnerHTML={{__html: (postData.content)}} />
            </div>
        </PageContainer>
    )
}
