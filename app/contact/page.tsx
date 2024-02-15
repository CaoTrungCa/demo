import PageContainer from "@/components/PageContainer";
import ContactBlock from "@/components/block/contact/ContactBlock";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: 'Contact'
    };
}

export default function Contact() {

  return (
    <PageContainer>
      <ContactBlock />
    </PageContainer>
  );
}
