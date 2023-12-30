"use client";

import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { useState } from "react";

export default function LangSwitcher({ className }: { className: string }) {
  const [language, setLanguage] = useState("eng");
  return (
    <Dropdown>
      <DropdownTrigger className={className}>
        <Button isIconOnly variant="bordered" size="sm">
          {language}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="light" onClick={() => setLanguage("eng")}>
          eng
        </DropdownItem>
        <DropdownItem key="dark" onClick={() => setLanguage("urdu")}>
          urdu
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
