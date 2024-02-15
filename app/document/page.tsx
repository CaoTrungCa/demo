import PageContainer from "@/components/PageContainer";
import DocumentBlock from "@/components/block/document/DocumentBlock";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Document'
    };
}

export default function Document() {

    return (
        <PageContainer>
            <DocumentBlock />
        </PageContainer>
    )
}
