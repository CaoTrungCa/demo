import PageContainer from "@/components/PageContainer";
import MyProfileBlock from "@/components/block/my-profile/MyProfileBlock";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'My Profile',
  }
}

export default function MyProfile() {
    return (
        <PageContainer>
            <MyProfileBlock/>
        </PageContainer>
    );
}
