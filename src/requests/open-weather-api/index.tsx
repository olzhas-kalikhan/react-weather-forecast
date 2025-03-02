import type { LocationData, ForecastData, WeatherData } from "./types";
import axios from "axios";

export const getCityKey = (city: LocationData) => {
  return `${city.name}-${city.country}`;
};

export const getCoordinates = async (city: string, apiKey: string) => {
  const response = await axios.get<LocationData[]>(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
  );

  const unique = new Set();
  let key = "";

  return response.data.reduce(
    (result, data) => {
      key = getCityKey(data);
      if (unique.has(key)) return result;
      unique.add(key);
      result.push({ ...data, id: key });
      return result;
    },
    [] as (LocationData & { id: string })[]
  );
};

export const getWeather = async (
  coordinates: {
    lat: number;
    lon: number;
  }[],
  apiKey: string
) => {
  const promises = coordinates.map(({ lat, lon }) =>
    axios.get<WeatherData>(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    )
  );
  const responses = await Promise.all(promises);

  return responses.map(({ data }) => data);
};

export const getForecast = async (
  {
    lat,
    lon,
  }: {
    lat: number;
    lon: number;
  },
  apiKey: string
) => {
  const response = await axios.get<ForecastData>(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  return response.data.list;
};
