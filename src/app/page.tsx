import { Masthead } from "@/components/sections/Masthead";
import { Essay } from "@/components/sections/Essay";
import { FieldNotes } from "@/components/sections/FieldNotes";
import { FeatureWell } from "@/components/sections/FeatureWell";
import { DataDesk } from "@/components/sections/DataDesk";
import { TheIndex } from "@/components/sections/TheIndex";
import { Record } from "@/components/sections/Record";
import { BackPage } from "@/components/sections/BackPage";

export default function Home() {
  return (
    <>
      <Masthead />
      <Essay />
      <FieldNotes />
      <FeatureWell />
      <DataDesk />
      <TheIndex />
      <Record />
      <BackPage />
    </>
  );
}
