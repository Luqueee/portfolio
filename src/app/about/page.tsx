import { Contests } from "@/components/blocks/Contests";
import { Studies } from "@/components/blocks/Studies";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About me",
};

export default function AboutPage() {
  return (
    <>
      <div className="mt-20" />
      <div className="section" id="studies">
        <Studies />
      </div>
      <div className="section" id="competitions">
        <Contests />
      </div>
    </>
  );
}
