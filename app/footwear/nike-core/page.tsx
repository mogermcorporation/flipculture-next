import HubClient from "@/components/HubClient";

export default function NikeCorePage() {
  return (
    <HubClient
      title="Nike Core"
      blurb="Dunks, Air Force, Air Max — sneakers only."
      category="sneakers"
      match="dunk|air force|af[- ]?1|air max|nike sb"
    />
  );
}
