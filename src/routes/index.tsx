import LocationForecast from "@/components/location-forecast";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div>
      <LocationForecast />
    </div>
  );
}
