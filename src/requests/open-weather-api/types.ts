type MainWeatherData = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
};

type WeatherCondition = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type LocationData = {
  country: string;
  lat: number;
  local_names: Record<string, string>;
  lon: number;
  name: string;
  state: string;
};

export type WeatherData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  main: MainWeatherData;
};

export type ForecastData = {
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
  };
  list: {
    main: MainWeatherData;
    weather: WeatherCondition[];
    dt_txt: string;
    dt: number;
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
  }[];
};
