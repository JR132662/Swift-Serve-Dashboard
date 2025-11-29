"use client";

import * as React from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";
import { IconChevronDown } from "@tabler/icons-react";

type AccordionType = "single" | "multiple";

type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: AccordionType;
  collapsible?: boolean;
  className?: string;
  [key: string]: any;
};

export function Accordion({ children, className, ...props }: React.PropsWithChildren<AccordionProps>) {
  return (
    // cast props to any to avoid Radix union prop type incompatibilities in our wrapper
    <RadixAccordion.Root {...(props as any)} className={`w-full ${className ?? ""}`}>
      {children}
    </RadixAccordion.Root>
  );
}

export function AccordionItem({ children, className, ...props }: any) {
  return (
    <RadixAccordion.Item
      {...props}
      className={`border-b py-2 ${className ?? ""}`}
    >
      {children}
    </RadixAccordion.Item>
  );
}

export function AccordionTrigger({ children, className, ...props }: any) {
  return (
    <RadixAccordion.Header className="flex">
      <RadixAccordion.Trigger
        {...props}
        className={`flex w-full items-center justify-between text-left font-medium px-4 py-3 rounded-md hover:bg-neutral-300/40 transition-colors ${className ?? ""}`}>
        <span className="flex-1">{children}</span>
        <IconChevronDown className="ml-4 h-5 w-5 text-neutral-400" />
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
}

export function AccordionContent({ children, className, ...props }: any) {
  return (
    <RadixAccordion.Content
      {...props}
      className={`px-4 pb-4 pt-2 text-sm text-neutral-300 ${className ?? ""}`}
    >
      <div className="leading-relaxed">{children}</div>
    </RadixAccordion.Content>
  );
}

export default Accordion;
