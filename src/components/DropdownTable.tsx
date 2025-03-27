import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const role: { [key: string]: string } = {
  admin: "Administrador",
  client: "Cliente",
  exchanger: "Cambista",
  "": "Sin Rol",
};

export default function AdminDropdownMenu({
  changeValue,
  defaultValue,
  userId,
}: {
  changeValue: (value: string, id: string) => Promise<void>;
  defaultValue: string;
  userId: string;
}) {
  const [buttonText, setButtonText] = useState<string>(role[defaultValue]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-32">
          {buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuRadioGroup
          value={defaultValue}
          onValueChange={async (value) => {
            await changeValue(userId, value);
            setButtonText(role[value]);
          }}
        >
          <DropdownMenuRadioItem value="admin" disabled>
            Administrador
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="client">Cliente</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="exchanger">
            Cambista
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="" disabled>
            Sin Rol
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
