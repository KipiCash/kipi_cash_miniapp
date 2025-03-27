import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  onChange: (values: Option[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  maxSelected?: number;
}

export function MultiSelect({
  options = [],
  onChange,
  placeholder = "Select items...",
  emptyMessage = "No items found.",
  maxSelected,
}: MultiSelectProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option[]>([]);

  const handleUnselect = (option: Option) => {
    setSelected(selected.filter((s) => s.value !== option.value));
  };

  const handleSelect = (option: Option) => {
    if (maxSelected && selected.length >= maxSelected) return;
    setSelected([...selected, option]);
  };

  React.useEffect(() => {
    onChange(selected);
  }, [selected]);

  const filteredOptions = React.useMemo(() => {
    return options.filter(
      (option) =>
        !selected.some((s) => s.value === option.value) &&
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, selected, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between hover:bg-background h-full p-0"
        >
          <div className="flex flex-col items-start gap-1 ">
            <div className="flex flex-wrap gap-1 w-full overflow-y-auto max-h-[120px] min-h-[28px]">
              {selected.length > 0 ? (
                selected.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="hover:bg-secondary/80"
                  >
                    {option.label}
                    <span
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(option);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground pt-1 pl-2">
                  {placeholder}
                </span>
              )}
            </div>
          </div>
          <span className="opacity-50 text-xl">▼</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <div className="flex flex-col">
          <input
            className="flex h-10 w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="max-h-[200px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <p className="p-2 text-sm text-center text-muted-foreground">
                {emptyMessage}
              </p>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
