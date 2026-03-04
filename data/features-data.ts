export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export const featuresData: FeatureItem[] = [
  {
    title: "Track your progress",
    description:
      "Track every run with detailed statistics including distance, time, pace, and calories burned. Visualize your progress through insights and performance history to stay consistent and improve over time.",
    icon: "/icons/Track-Progress.png",
  },
  {
    title: "Join Races",
    description:
      "Browse upcoming events, register in seconds, and participate from anywhere. Complete race requirements at your own pace and receive verified e-certificates and digital rewards upon completion.",
    icon: "/icons/Join-Races.png",
  },
  {
    title: "Be Healthy",
    description:
      "Transform your routine into a healthier lifestyle. Stay accountable, stay motivated, and become the strongest version of yourself.",
    icon: "/icons/Be-Healthy.png",
  },
];
