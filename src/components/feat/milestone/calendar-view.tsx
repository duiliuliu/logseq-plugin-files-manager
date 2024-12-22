import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { eachDayOfInterval, format, parseISO, startOfMonth, endOfMonth, subMonths, addMonths, addDays } from 'date-fns';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Milestone } from './milestone';


interface CalendarViewProps {
  highlightColor?: string;
  milestones: Milestone[];
  isWideMode?: boolean;
  onDateClick?: (date: Date) => void;
  onUpdateMilestone?: (milestone: Milestone) => void;
  onHiddenMilestone?: (milestone: Milestone) => void;
  onAddMilestone?: (milestone: Milestone) => void;
}

export function CalendarView({
  highlightColor = "bg-green-500",
  onDateClick,
  milestones = [],
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDayMilestones = ((date: Date) => {
    return milestones.filter(milestone =>
      format(parseISO(milestone.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  });

  const daysInMonth = ((date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  });

  const getMonthView = ((month: Date) => {

    const days = daysInMonth(month);
    const firstDayOfMonth = days[0].getDay();
    const lastDayOfMonth = days[days.length - 1].getDay();
    const daysInWeek = 7; // Define the number of days in a week 
    const numberOfWeeks = Math.ceil((days.length / daysInWeek));   // Calculate the number of weeks in a month

    // Use CSS variables to control the size of each cell
    const cellWidth = 'var(--calendar-cell-width, 100px)'; // Default to 100px if not defined
    const cellHeight = 'var(--calendar-cell-height, 50px)'; // Default to 50px if not defined


    const weeks = useMemo(() => {
      const weeks: Date[][] = [];
      for (let i = 0; i < days.length; i += daysInWeek) {
        const weekStart = addDays(days[i], -1 * firstDayOfMonth);
        const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + daysInWeek - 1);
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

        weeks.push(weekDays);
      }
      return weeks;
    }, [month, days]);



    const getIntensity = (date: Date) => {
      const count = milestones.filter(m =>
        format(parseISO(m.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ).length
      if (count === 0) return 'border'
      if (count === 1) return 'border bg-blue-300'
      if (count === 2) return 'border bg-blue-400'
      return 'border bg-blue-500'
    }


    return (
      <div key={format(month, 'yyyy-MM')} className="space-y-4">

        <div className="grid grid-cols-7 gap-1" style={{ gridTemplateRows: `repeat(${numberOfWeeks}, ${cellHeight})` }}>
          {weeks.map(((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="flex flex-row gap-1">
              {week.map((day, dayIndex) => (
                <>
                  <div key={format(day, 'yyyy-MM-dd')} className={cn("h-8 w-8 rounded-sm border-gray-200 transition-colors", (weekIndex === 0 && dayIndex < firstDayOfMonth)
                    || (weekIndex === numberOfWeeks - 1 && dayIndex > lastDayOfMonth) ? "" : getIntensity(day))} style={{ width: cellWidth, height: cellHeight }}>


                    {

                      (weekIndex === 0 && dayIndex < firstDayOfMonth)
                        || (weekIndex === numberOfWeeks - 1 && dayIndex > lastDayOfMonth)
                        ? null
                        : <>
                          <div className="text-xs text-gray-500">{format(day, 'dd')}</div>
                          <button
                            onClick={() => onDateClick?.(day)}
                            className={cn(
                              "cursor-pointer", getDayMilestones(day).length > 0 ? highlightColor : "hover:bg-muted"
                            )}
                          />
                          {getDayMilestones(day).length > 0 && (
                            <div className="top-0 right-0 bg-opacity-80" >
                              {getDayMilestones(day).map((milestone => (
                                <div key={milestone.id} className="whitespace-nowrap" style={{ "fontSize": "xx-small" }}>
                                  {milestone.content}
                                </div>
                              )))}
                            </div>
                          )}
                        </>

                    }



                  </div>
                </>
              ))}
            </div>
          )))}
        </div>
      </div>
    );
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {getMonthView(currentDate)}
      </div>
    </div>
  );
}