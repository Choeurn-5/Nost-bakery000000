"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  expandedValues: Set<string>;
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion sub-components must be used within an <Accordion>");
  }
  return context;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled?: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(
  null
);

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionTrigger and AccordionContent must be used within an <AccordionItem>"
    );
  }
  return context;
}

export interface AccordionProps {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  type = "single",
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: AccordionProps) {
  const getInitialValues = (): Set<string> => {
    const val = controlledValue !== undefined ? controlledValue : defaultValue;
    if (!val) return new Set<string>();
    if (Array.isArray(val)) return new Set<string>(val);
    return new Set<string>([val]);
  };

  const [uncontrolledValues, setUncontrolledValues] =
    React.useState<Set<string>>(getInitialValues);

  const isControlled = controlledValue !== undefined;
  const currentValues = React.useMemo(() => {
    if (isControlled) {
      if (!controlledValue) return new Set<string>();
      if (Array.isArray(controlledValue)) return new Set<string>(controlledValue);
      return new Set<string>([controlledValue]);
    }
    return uncontrolledValues;
  }, [isControlled, controlledValue, uncontrolledValues]);

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      let nextSet: Set<string>;

      if (type === "single") {
        if (currentValues.has(itemValue)) {
          nextSet = new Set<string>();
        } else {
          nextSet = new Set<string>([itemValue]);
        }
      } else {
        nextSet = new Set<string>(currentValues);
        if (nextSet.has(itemValue)) {
          nextSet.delete(itemValue);
        } else {
          nextSet.add(itemValue);
        }
      }

      if (!isControlled) {
        setUncontrolledValues(nextSet);
      }

      if (onValueChange) {
        if (type === "single") {
          const first = Array.from(nextSet)[0] || "";
          onValueChange(first);
        } else {
          onValueChange(Array.from(nextSet));
        }
      }
    },
    [type, currentValues, isControlled, onValueChange]
  );

  return (
    <AccordionContext.Provider
      value={{ expandedValues: currentValues, toggleItem, type }}
    >
      <div className={cn("divide-y divide-espresso/10", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    const { expandedValues } = useAccordionContext();
    const isOpen = expandedValues.has(value);
    const id = React.useId();
    const triggerId = `accordion-trigger-${id}`;
    const contentId = `accordion-content-${id}`;

    return (
      <AccordionItemContext.Provider
        value={{ value, isOpen, disabled, triggerId, contentId }}
      >
        <div
          ref={ref}
          className={cn(
            "transition-colors duration-150 py-1",
            disabled && "opacity-50 pointer-events-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconClassName?: string;
}

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, iconClassName, ...props }, ref) => {
  const { toggleItem } = useAccordionContext();
  const { value, isOpen, disabled, triggerId, contentId } =
    useAccordionItemContext();

  return (
    <h3 className="flex font-heading">
      <button
        ref={ref}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => toggleItem(value)}
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-left font-serif text-lg md:text-xl font-semibold text-espresso transition-all hover:text-golden min-h-[44px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden focus-visible:ring-offset-2 rounded-[8px]",
          className
        )}
        {...props}
      >
        <span className="flex-1 pr-4">{children}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-golden transition-transform duration-300 ease-out",
            isOpen && "rotate-180",
            iconClassName
          )}
          aria-hidden="true"
        />
      </button>
    </h3>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  const { isOpen, contentId, triggerId } = useAccordionItemContext();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: "auto",
            opacity: 1,
            transition: {
              height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
              opacity: { duration: 0.25, delay: 0.05 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
              opacity: { duration: 0.15 },
            },
          }}
          className="overflow-hidden"
        >
          <div
            ref={ref}
            className={cn(
              "pb-5 pt-1 text-sm md:text-base leading-relaxed text-espresso/80 font-sans",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
AccordionContent.displayName = "AccordionContent";
