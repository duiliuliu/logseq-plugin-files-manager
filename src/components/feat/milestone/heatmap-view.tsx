import { useMemo, useState, useEffect } from 'react';
import { eachDayOfInterval, format, parseISO, getDay, addMonths, subMonths } from 'date-fns';
import { cn } from "@/lib/utils";
import { Milestone } from './milestone';
import Tooltip from '@/components/customs/tooltip';
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeatmapViewProps {
    milestones: Milestone[];
    isWideMode: boolean;
    onUpdateMilestone?: (milestone: Milestone) => void;
    onHiddenMilestone?: (milestone: Milestone) => void;
    onAddMilestone?: (milestone: Milestone) => void;
}

export function HeatmapView({ milestones, isWideMode }: HeatmapViewProps) {
    const selectedYear = new Date().getFullYear();
    const [activeDay, setActiveDay] = useState<string | null>(null);
    const [startDate, setStartDate] = useState(new Date(selectedYear, 0, 1));
    const [monthsToShow, setMonthsToShow] = useState(isWideMode ? 8 : 4);


    console.log(activeDay)

    useEffect(() => {
        setMonthsToShow(isWideMode ? 6 : 4);
    }, [isWideMode]);

    const yearDays = useMemo(() => {
        const end = addMonths(startDate, monthsToShow);
        return eachDayOfInterval({ start: startDate, end }).map(day => ({ date: day, weekDay: getDay(day) }));
    }, [startDate, monthsToShow]);

    const getIntensity = (date: Date) => {
        const count = milestones.filter(m =>
            format(parseISO(m.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).length
        if (count === 0) return 'bg-gray-200'
        if (count === 1) return 'bg-blue-300'
        if (count === 2) return 'bg-blue-400'
        return 'bg-blue-500'
    }

    const rows = useMemo(() => {
        const weeks: Date[][] = [];
        yearDays.forEach(dayData => {
            const weekIndex = dayData.weekDay;
            if (!weeks[weekIndex]) {
                weeks[weekIndex] = [];
            }
            weeks[weekIndex].push(dayData.date);
        });
        return weeks;
    }, [yearDays]);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handlePrevious = () => {
        setStartDate(prevDate => subMonths(prevDate, monthsToShow));
    };

    const handleNext = () => {
        setStartDate(prevDate => addMonths(prevDate, monthsToShow));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrevious}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-lg">
                        {format(startDate, 'MMM yyyy')} - {format(addMonths(startDate, monthsToShow - 1), 'MMM yyyy')}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleNext}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {rows.map((week, index) => (
                    <div key={`week-${index}`} className="flex flex-row gap-0.25">
                        <span className='w-6 h-4 rounded-sm text-sm text-gray-400' style={{ "fontSize": "xx-small" }}>{weekDays[index]}</span>
                        {week.map(dayData => (
                            <Tooltip
                                key={format(dayData, 'yyyy-MM-dd')}
                                icon={
                                    <div className={cn("w-6 h-6 rounded-sm transition-colors", getIntensity(dayData))}>
                                        <button className="cursor-pointer w-full h-full"
                                            onClick={() => setActiveDay(format(dayData, 'yyyy-MM-dd'))}
                                        />
                                    </div>
                                }
                                text={format(dayData, 'yyyy-MM-dd')}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

