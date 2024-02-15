import PageContainer from '@/components/PageContainer'
import AboutUsBlock from '@/components/block/about/AboutUsBlock'
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: 'About Us'
    };
}

export default function About() {
  return (
    <PageContainer>
      <AboutUsBlock />
    </PageContainer>
  )
}
