import { notFound } from "next/navigation";
import { racesData } from "@/data/races-data";
import RaceDetailPage from "@/components/pages/main/race/RaceDetailPage";
import { checkRaceRegistration } from "@/app/(main)/actions";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return racesData.map((race) => ({ id: race.id }));
}

export default async function RaceDetail({ params }: Props) {
  const { id } = await params;
  const race = racesData.find((r) => r.id === id);

  if (!race) notFound();

  const { registered } = await checkRaceRegistration(race.dbId);

  return <RaceDetailPage race={race} initialRegistered={registered} />;
}
