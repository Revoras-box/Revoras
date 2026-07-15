"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  /** Optional count/notification badge shown after the label. */
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

/** Segmented navigation within a page (booking status filter, admin business queue filter). Panels are the `children`, one `<TabsPanel value="...">` per item. */
export function Tabs({ items, value, defaultValue, onValueChange, children, className }: TabsProps) {
  return (
    <RadixTabs.Root value={value} defaultValue={defaultValue ?? items[0]?.value} onValueChange={onValueChange} className={className}>
      <RadixTabs.List className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-3.5 py-2.5 text-sm font-medium text-muted",
              "transition-colors duration-(--duration-fast) ease-(--ease-out)",
              "hover:text-on-surface data-[state=active]:border-primary data-[state=active]:text-on-surface",
              "disabled:opacity-40 disabled:pointer-events-none"
            )}
          >
            {item.label}
            {item.badge}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {children}
    </RadixTabs.Root>
  );
}

export function TabsPanel({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  return (
    <RadixTabs.Content value={value} className={cn("pt-4 focus:outline-none", className)}>
      {children}
    </RadixTabs.Content>
  );
}
