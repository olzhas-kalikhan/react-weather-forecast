import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPTIONS = [
  {
    value: "3",
    label: "Every 3 hours",
  },
  {
    value: "6",
    label: "Every 6 hours",
  },
  {
    value: "12",
    label: "Every 12 hours",
  },
  {
    value: "24",
    label: "Every 24 hours",
  },
] as const;

export function TimeFrameSelect({
  value = "3",
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[300px]">
        <SelectValue aria-label={value}>
          {OPTIONS.find((option) => option.value === value)?.label ??
            "Please select value"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {OPTIONS.map((option) => (
            <SelectItem value={option.value} key={`timeFrame-${option.value}`}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
