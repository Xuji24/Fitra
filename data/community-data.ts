export interface CommunityItem {
  id: number;
  title: string;
  growthNumber: number;
  icon: string;
}

export const communityData: CommunityItem[] = [
  {
    id: 1,
    title: "Country Using This App",
    growthNumber: 50,
    icon: "/icons/globe.png",
  },
  {
    id: 2,
    title: "Monthly New Users",
    growthNumber: 800,
    icon: "/icons/users.png",
  },
  {
    id: 3,
    title: "New Hosted Races",
    growthNumber: 100,
    icon: "/icons/calendar.png",
  },
  {
    id: 4,
    title: "Users Joining Communities",
    growthNumber: 1000,
    icon: "/icons/connect.png",
  },
];
