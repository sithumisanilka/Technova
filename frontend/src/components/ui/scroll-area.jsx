import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef,
  React.ComponentPropsWithoutRef
>(({ className, children, ...props }, ref) => (
  
    {children}
    
    
  
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef,
  React.ComponentPropsWithoutRef
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    
  
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
