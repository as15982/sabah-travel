
import React, { useRef, useEffect } from 'react';
import { DayPlan } from '../types';

interface DateSelectorProps {
  days: DayPlan[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DateSelector: React.FC<DateSelectorProps> = ({ days, selectedDate, onSelectDate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Logic to center the selected date could go here
    }
  }, [selectedDate]);

  return (
    <div className="w-full bg-transparent">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-2 px-1 pb-1 no-scrollbar snap-x"
      >
        {days.map((day) => {
          const isSelected = day.date === selectedDate;
          // Manual parsing to avoid dependency on date-fns and timezone issues
          const [year, month, d] = day.date.split('-').map(Number);
          const dateObj = new Date(year, month - 1, d);
          
          return (
            <button
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={`
                flex-shrink-0 flex flex-col items-center justify-center
                w-[42px] h-[54px] rounded-[14px] transition-all duration-300 snap-center border-[1.5px]
                ${isSelected 
                  ? 'bg-sabah-blue border-sabah-blue text-white shadow-md shadow-blue-500/30 scale-105' 
                  : 'bg-white/80 border-transparent text-gray-500 hover:bg-white hover:border-gray-100 backdrop-blur-sm'
                }
              `}
            >
              <span className={`text-[8px] font-sans font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                {WEEKDAYS[dateObj.getDay()]}
              </span>
              <span className={`text-lg font-serif font-bold -mt-0.5 ${isSelected ? 'text-white' : 'text-sabah-dark'}`}>
                {dateObj.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
