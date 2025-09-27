import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    id: string;
    label: string;
    icon?: React.ElementType;
    disabled?: boolean;
  }[];
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export function Sidebar({ 
  className, 
  items, 
  activeItem,
  onItemClick,
  ...props 
}: SidebarProps) {
  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <ScrollArea className="h-full">
              {items.map((item) => (
                <Button
                  key={item.id}
                  variant={activeItem === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    item.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !item.disabled && onItemClick?.(item.id)}
                  disabled={item.disabled}
                >
                  {item.icon && (
                    <item.icon className="mr-2 h-4 w-4" />
                  )}
                  {item.label}
                </Button>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;