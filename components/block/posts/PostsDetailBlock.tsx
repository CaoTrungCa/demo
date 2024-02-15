'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import AdCode from "@/components/AdCode";

export default function PostsDetailBlock({ data }: { data: any }) {
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
        setPostData(data);
    }, [data]);

    return (
        <div>
            <div>
                <Image src={postData.image ? postData.image : '/user/bg_default.jpg'} height={100} width={100} alt={postData.title}
                    className="h-auto w-full" />
            </div>
            <div>
                {postData.title}
            </div>
            <div dangerouslySetInnerHTML={{__html: (postData.content)}} />
            {/* <AdCode /> */}
        </div>
    )
}

