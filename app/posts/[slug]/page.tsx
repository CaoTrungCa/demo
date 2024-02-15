import PageContainer from "@/components/PageContainer";
import { fetchDetailPost } from "@/lib/utils/fetchData";
import PostsDetailBlock from "@/components/block/posts/PostsDetailBlock";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const data = await fetchDetailPost(params.slug);

    return {
        title: data.title
    };
}

export default async function Posts({ params }: { params: any }) {
    const data = await fetchDetailPost(params.slug);

    return (
        <PageContainer>
            <PostsDetailBlock data={data} />
        </PageContainer>
    );
}
