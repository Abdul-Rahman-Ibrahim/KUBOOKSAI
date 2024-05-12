import Banner from "@/components/home/Banner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KU Books Recommendation | Search",
  description: "Search For a Book",
};

export default function Home() {
  return (
    <main>
      <Banner />
    </main>
  );
}
