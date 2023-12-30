"use client";

import * as React from "react";
import { BsMoonStars, BsSun, BsDisplay } from "react-icons/bs";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="bordered" size="sm">
          {theme === "light" ? (
            <BsSun />
          ) : theme === "dark" ? (
            <BsMoonStars />
          ) : (
            <BsDisplay />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="light" onClick={() => setTheme("light")}>
          Light
        </DropdownItem>
        <DropdownItem key="dark" onClick={() => setTheme("dark")}>
          Dark
        </DropdownItem>
        <DropdownItem key="system" onClick={() => setTheme("system")}>
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
