
import React from "react";
import { Button } from "@/components/ui/button";

interface OptionButtonsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

const OptionButtons: React.FC<OptionButtonsProps> = ({ options, onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, idx) => (
        <Button
          key={idx}
          variant="outline"
          className="px-2 py-1 text-xs rounded-full border-primary hover:bg-primary/10 transition"
          onClick={() => onSelect(opt)}
          disabled={disabled}
          tabIndex={0}
        >
          {opt}
        </Button>
      ))}
    </div>
  );
};

export default OptionButtons;
