export interface RaceReward {
  medal: {
    name: string;
    description: string;
  };
  eCertificate: {
    title: string;
    description: string;
  };
  prizes?: string[];
}

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
  rewards: RaceReward;
}

export type RaceCategory = "All" | "5K" | "10K" | "Half Marathon" | "Marathon";
