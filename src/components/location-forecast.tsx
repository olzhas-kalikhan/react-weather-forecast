import { getForecast } from "@/requests/open-weather-api";
import { useQuery } from "@tanstack/react-query";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { useOpenWeather } from "@/store/open-weather";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import { TimeFrameSelect } from "./time-frame-select";
import type { ForecastData } from "@/requests/open-weather-api/types";
import { round } from "@/lib/utils";
import DateTick from "./date-tick";

const chartConfig = {
  temp: {
    label: "Temp",
    color: "#2563eb",
  },
  pressure: {
    label: "Pressure",
    color: "#d7dfdc",
  },
  humidity: {
    label: "Humidity",
    color: "#d0f9e8",
  },
  date: {
    label: "Date",
  },
} satisfies ChartConfig;

const getChartData = (data: ForecastData["list"], timeFrame: string) => {
  const result: {
    temp: number;
    date: Date;
    tempMin: number;
    windSpeed: number;
    tempMax: number;
    pressure: number;
    humidity: number;
  }[] = [];
  const timeFrameStep = parseInt(timeFrame) / 3;

  let j = 0;
  for (let i = 0; i < data.length; i++) {
    const weatherRecord = data[i];
    if (!result[j])
      result[j] = {
        temp: weatherRecord.main.temp,
        date: new Date(weatherRecord.dt * 1000),
        tempMin: weatherRecord.main.temp_min,
        windSpeed: weatherRecord.wind.speed,
        tempMax: weatherRecord.main.temp_max,
        pressure: weatherRecord.main.pressure,
        humidity: weatherRecord.main.humidity,
      };
    else {
      result[j].temp += weatherRecord.main.temp;
      result[j].tempMin += weatherRecord.main.temp_min;
      result[j].windSpeed += weatherRecord.wind.speed;
      result[j].tempMax += weatherRecord.main.temp_max;
      result[j].pressure += weatherRecord.main.pressure;
      result[j].humidity += weatherRecord.main.humidity;
    }
    if ((i + 1) % timeFrameStep === 0) {
      result[j].temp = round(result[j].temp / timeFrameStep);
      result[j].tempMin = round(result[j].tempMin / timeFrameStep);
      result[j].windSpeed = round(result[j].windSpeed / timeFrameStep);
      result[j].tempMax = round(result[j].tempMax / timeFrameStep);
      result[j].pressure = round(result[j].pressure / timeFrameStep, 0);
      result[j].humidity = round(result[j].humidity / timeFrameStep, 0);
      ++j;
    }
  }
  return result;
};

export default function LocationForecast() {
  const activeLocation = useOpenWeather.use.activeLocation();
  const apiKey = useOpenWeather.use.apiKey();
  const { data } = useQuery({
    queryKey: ["forecast", activeLocation?.id, apiKey],
    queryFn: () =>
      activeLocation ? getForecast(activeLocation, apiKey) : null,
    enabled: Boolean(activeLocation && apiKey),
  });
  const [activeChart, setActiveChart] = useState("weather");
  const [timeFrame, setTimeFrame] = useState("3");

  if (!data || !activeLocation) return null;
  const chartData = getChartData(data, timeFrame);

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            {activeLocation.name}, {activeLocation.country}
          </CardTitle>
          <CardDescription>Weather Data</CardDescription>
        </div>
        <div className="flex items-center flex-1">
          <TimeFrameSelect value={timeFrame} onValueChange={setTimeFrame} />
        </div>
        <div className="flex">
          {["weather", "wind", "pressure", "humidity"].map((key) => {
            // const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground capitalize">
                  {key}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ComposedChart accessibilityLayer data={chartData}>
            <Line
              dataKey="temp"
              fill="var(--color-temp)"
              hide={activeChart !== "weather"}
            />
            <Bar
              hide={activeChart !== "weather" && activeChart !== "pressure"}
              dataKey="pressure"
              yAxisId="pressureYAxis"
              fill="var(--color-pressure)"
            />
            <Bar
              hide={activeChart !== "weather" && activeChart !== "humidity"}
              dataKey="humidity"
              yAxisId="humidityYAxis"
              fill="var(--color-humidity)"
            />
            <Line
              dataKey="windSpeed"
              fill="var(--color-temp)"
              hide={activeChart !== "wind"}
            />

            <CartesianGrid />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  xAxisKey="date"
                  xAxisFormatter={(value: Date) => value.toLocaleString()}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <YAxis
              type="number"
              tickCount={20}
              domain={
                (activeChart === "weather" && [
                  (dataMin: number) => Math.floor(dataMin - 10),
                  (dataMax: number) => Math.ceil(dataMax + 10),
                ]) ||
                undefined
              }
            />
            <YAxis
              type="number"
              yAxisId="pressureYAxis"
              domain={(activeChart === "weather" && [0, 10000]) || undefined}
              hide={activeChart !== "pressure"}
            />
            <YAxis
              type="number"
              yAxisId="humidityYAxis"
              domain={(activeChart === "weather" && [0, 1000]) || undefined}
              hide={activeChart !== "humidity"}
            />
            <XAxis dataKey="date" tickMargin={10} tick={<DateTick />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
