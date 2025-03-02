import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { LocationCombobox } from "./location-combobox";
import { useOpenWeather } from "@/store/open-weather";

export default function Header() {
  const apiKey = useOpenWeather.use.apiKey();
  const isSystemApiKey = useOpenWeather.use.isSystemApiKey();
  const setApiKey = useOpenWeather.use.setApiKey();

  const [inputValue, setInputValue] = useState("");

  return (
    <header className="container p-2 flex gap-2 bg-white text-black justify-between">
      <div className="flex items-end gap-x-2">
        <LocationCombobox />
        {!isSystemApiKey && (
          <>
            <div className="flex flex-col gap-1">
              <Label htmlFor="api-key">OpenWeather API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value ?? "")}
              />
            </div>
            <Button
              disabled={apiKey === inputValue}
              onClick={() => setApiKey(inputValue)}
            >
              Set Key
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
