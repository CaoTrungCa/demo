'use client'
import { Categories, Post } from "@/lib/collection";
import { fetchDataPost, fetchDataCategories } from "@/lib/utils/fetchData";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BlockPost() {

    const [postData, setPostData] = useState<Post[]>([]);
    const [categoryData, setCategoryData] = useState<Categories[]>([]);

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s/g).length;
        const minutes = words / wordsPerMinute;
        return Math.ceil(minutes);
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return `${seconds}s ago`;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDataPost(['Done']);
            setPostData(data);
        }
        fetchData();
        const fetchDataCategory = async () => {
            const data = await fetchDataCategories('');
            setCategoryData(data)
        }
        fetchDataCategory();
    }, []);

    return (
        <div className='grid gap-8 md:grid-cols-3 mt-20'>
            <div className='md:col-span-2'>
                {postData.map((post, postIdx) => (
                    <Link href={`/posts/${post.slug}`} key={postIdx}>
                        <div className='mb-16 grid md:grid-cols-2 rounded-lg shadow-lg hover:shadow'>
                            <div className='md:col-span-1'>
                                <Image
                                    className='h-64 w-96 rounded-lg'
                                    width={288}
                                    height={384}
                                    src={post.image ? post.image : "/user/bg_default.jpg"}
                                    alt={post.title}
                                />
                            </div>
                            <div className='md:col-span-1 h-64 mx-6'>
                                <div className='text-xl h-16 mt-4 font-bold text-left hover:text-blue-400 overflow-hidden'
                                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    <p>{post.title}</p>
                                </div>
                                <div className='text-lg h-20 mt-4 text-left overflow-hidden'
                                    style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                                    <div dangerouslySetInnerHTML={{__html: post.content}} />
                                </div>
                                <div className='flex h-16 mt-4 items-center justify-between space-x-4'>
                                    <div className='flex items-center space-x-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                                        </svg>
                                        <p className='font-mono'>{calculateReadTime(post.content)} min read</p>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        {post.date_created && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar2" viewBox="0 0 16 16">
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>
                                                <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5z"/>
                                            </svg>
                                        )}
                                        {post.date_created && (
                                            <p className='font-mono'>{getRelativeTime(post.date_created)}</p>
                                        )}
                                    </div>
                                    {post.categories && (
                                        <div>
                                            {categoryData
                                                .filter(category => category.slug === post.categories)
                                                .map((filteredCategory, categoryIdx) => (
                                                    <Link key={categoryIdx}
                                                        href={`/posts/categories/${filteredCategory.slug}`}
                                                        className='hover:opacity-90'
                                                    >
                                                        <div className={`rounded-br-lg px-4 py-2 rounded-tl-lg bg-${filteredCategory.color}-400 text-white`}>
                                                            {filteredCategory.title}
                                                        </div>
                                                    </Link>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className='md:col-span-1 shadow-lg'>
            </div>
        </div>
    )
}
