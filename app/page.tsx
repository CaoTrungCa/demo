import PageContainer from "@/components/PageContainer";
import BlockPost from "@/components/block/BlockPost";
import FrontPage from "@/components/page/FrontPage";
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
    <FrontPage />
  )
}
