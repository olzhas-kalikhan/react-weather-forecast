import { createSelectors } from "@/lib/auto-selectors";
import type { LocationData } from "@/requests/open-weather-api/types";
import { create } from "zustand";

interface OpenWeatherProps {
  isSystemApiKey: boolean;
  apiKey: string;
  activeLocation: (LocationData & { id: string }) | null;
}

interface OpenWeatherState extends OpenWeatherProps {
  setApiKey: (apiKey: string) => void;
  setActiveLocation: (location: (LocationData & { id: string }) | null) => void;
}

const initialState: OpenWeatherProps = {
  isSystemApiKey: Boolean(import.meta.env.VITE_OPEN_WEATHER_API_KEY),
  apiKey: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
  activeLocation: null,
};
const useOpenWeatherBase = create<OpenWeatherState>()((set) => ({
  ...initialState,
  setApiKey: (apiKey) => set(() => ({ apiKey })),
  setActiveLocation: (location) => set(() => ({ activeLocation: location })),
}));

export const useOpenWeather = createSelectors(useOpenWeatherBase);
