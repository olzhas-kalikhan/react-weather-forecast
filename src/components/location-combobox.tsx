"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { getCoordinates } from "@/requests/open-weather-api";
import { useDebounce } from "@uidotdev/usehooks";
import { useOpenWeather } from "@/store/open-weather";

export function LocationCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);

  const apiKey = useOpenWeather.use.apiKey();
  const activeLocation = useOpenWeather.use.activeLocation();
  const setActiveLocation = useOpenWeather.use.setActiveLocation();

  const { data: locationsData } = useQuery({
    queryKey: ["locations", debouncedInputValue, apiKey],
    queryFn: () => getCoordinates(debouncedInputValue, apiKey),
    initialData: [],
    enabled: Boolean(apiKey && debouncedInputValue),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {activeLocation
            ? `${activeLocation.name}, ${activeLocation.country}`
            : "Select location..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search location..."
            className="h-9"
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {locationsData.map((location) => (
                <CommandItem
                  key={location.id}
                  value={location.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setActiveLocation(
                      activeLocation?.id === currentValue ? null : location
                    );
                    setOpen(false);
                  }}
                >
                  {location.name}, {location.country}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === location.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
