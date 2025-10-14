import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef>(
  ({ className, ...props }, ref) => (
    
      
    
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef>(
  ({ className, ...props }, ref) => ,
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef>(
  ({ className, ...props }, ref) => (
    
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef>(
  ({ className, ...props }, ref) => (
    tr]:last:border-b-0", className)} {...props} />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef>(
  ({ className, ...props }, ref) => (
    
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef>(
  ({ className, ...props }, ref) => (
    
  ),
);
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
