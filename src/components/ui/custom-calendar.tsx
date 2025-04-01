
import React from "react";
import { Calendar as CalendarComponent, CalendarProps } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DayContent } from "react-day-picker";

type CustomCalendarProps = CalendarProps & {
  eventCounts?: Record<string, number>;
};

export function CustomCalendar({ className, eventCounts, ...props }: CustomCalendarProps) {
  return (
    <CalendarComponent 
      className={cn("rounded-md border", className)}
      {...props}
      components={{
        DayContent: (props) => {
          // Get event count for this day if it exists
          const date = props.date?.toString();
          const eventCount = date ? eventCounts?.[date] : undefined;
          
          return (
            <div className="relative">
              <DayContent {...props} />
              {eventCount && eventCount > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-pinterest-red"></div>
              )}
            </div>
          );
        }
      }}
    />
  );
}
