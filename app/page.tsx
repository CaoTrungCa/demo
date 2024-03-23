import PageContainer from "@/components/PageContainer";
import BlockPost from "@/components/block/BlockPost";
import { fetchDataSetting } from "@/lib/utils/fetchData";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const globals = await fetchDataSetting()
  return {
    title: `Home | ${globals.title}`,
  }
}

export default function Home() {
  return (
    <PageContainer>
      <BlockPost />
    </PageContainer>
  )
}
