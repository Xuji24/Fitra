export interface RaceEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  category: "5K" | "10K" | "Half Marathon" | "Marathon";
  description: string;
  fullDescription: string;
  image: string;
  organizerLogo: string;
  participants: number;
  maxParticipants: number;
  registrationOpen: boolean;
  registrationDeadline: string;
}

export type RaceCategory = "All" | "5K" | "10K" | "Half Marathon" | "Marathon";
