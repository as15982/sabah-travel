

import React, { useState, useRef, useEffect } from 'react';
import { DayPlan, ItineraryItem, FlightInfo } from '../types';
import { MapPin, Clock, Plane, ArrowRight, Pencil, Check, X, ArrowDown, GripVertical, Image as ImageIcon } from 'lucide-react';
import EditableImage from './EditableImage';

interface ItineraryListProps {
  dayPlan: DayPlan;
  onUpdate: (updatedDay: DayPlan) => void;
}

// --- Helper Functions for Time Calculation ---

const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const parseTravelTime = (travelStr?: string): number => {
  if (!travelStr) return 0;
  // Extract first number found in string, default to 15 if none (assuming "Grab 15 min")
  const match = travelStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 15; 
};

// --- Sub-components ---

const FlightCard = ({ flight }: { flight: FlightInfo }) => {
  const formatAirport = (text: string) => {
    const parts = text.split('｜');
    return (
      <>
        <span className="block font-bold text-sabah-dark">{parts[0]}</span>
        {parts[1] && <span className="block text-[10px] text-gray-400 mt-0.5">{parts[1]}</span>}
      </>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-5 shadow-card mb-8 border border-white/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-red-600"></div>
      <div className="flex justify-between items-center mb-6 mt-1">
        <div className="flex flex-col">
          <span className="text-4xl font-sans font-bold text-sabah-dark">{flight.departureCode}</span>
          <span className="text-2xl font-serif text-sabah-blue font-bold">{flight.departureTime}</span>
        </div>
        <div className="flex flex-col items-center flex-1 px-4 text-gray-300">
           <div className="mb-2">
              <Plane size={32} className="text-gray-300 transform -rotate-45" strokeWidth={1.5} />
           </div>
          <div className="w-full h-[1px] bg-gray-300 border-t border-dashed border-gray-400"></div>
          <span className="text-[10px] text-gray-400 font-bold mt-1">直飛</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-4xl font-sans font-bold text-sabah-dark">{flight.arrivalCode}</span>
          <span className="text-2xl font-serif text-sabah-blue font-bold">{flight.arrivalTime}</span>
        </div>
      </div>
      <div className="flex justify-between items-start text-xs text-gray-500 font-sans mb-4 gap-4">
        <div className="flex-1 text-left leading-tight">{formatAirport(flight.departureAirport)}</div>
        <div className="flex-1 text-right leading-tight">{formatAirport(flight.arrivalAirport)}</div>
      </div>
      <div className="bg-gray-50/80 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
        <div className="w-6 h-6 flex-shrink-0">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1024px-AirAsia_New_Logo.svg.png" alt="AirAsia" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-sabah-dark">{flight.airline}</span>
          <span className="text-[10px] text-gray-400">{flight.aircraft}</span>
        </div>
      </div>
    </div>
  );
};

const LocationLink = ({ location, coords, className }: { location: string, coords: any, className?: string }) => (
  <a 
    href={coords.url || `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
    target="_blank"
    rel="noreferrer"
    onClick={(e) => e.stopPropagation()}
    className={`flex items-start gap-1.5 text-gray-500 text-xs hover:text-sabah-blue transition-colors group/link ${className}`}
  >
    <MapPin size={12} className="mt-0.5 flex-shrink-0 text-sabah-blue group-hover/link:scale-110 transition-transform" />
    <span className="font-sans leading-relaxed border-b border-transparent group-hover/link:border-sabah-blue/30">{location}</span>
  </a>
);

// Note Component - only editable if passed isEditing=true
const EditableNote = ({ 
  initialNote, 
  onSave,
  isEditing 
}: { 
  initialNote: string | undefined, 
  onSave: (note: string) => void,
  isEditing: boolean
}) => {
  const [value, setValue] = useState(initialNote || '');

  // If not editing and no note, render nothing (Requirement 1)
  if (!isEditing && !initialNote) {
      return null;
  }

  if (isEditing) {
    return (
      <div className="bg-white p-2 rounded-xl border border-sabah-blue/50 shadow-sm animate-fade-in w-full mt-2">
        <textarea 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full text-xs font-serif text-gray-700 bg-transparent outline-none resize-none h-16 mb-2"
          placeholder="輸入備註..."
        />
        <div className="flex justify-end gap-2">
            <button onClick={() => onSave(value)} className="px-3 py-1 rounded-full bg-sabah-blue text-white text-xs font-bold hover:bg-blue-600">
                儲存備註
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 p-3 rounded-xl border border-gray-100/50 group/note relative min-h-[40px] w-full mt-2">
      <p className="text-xs text-gray-500 font-serif font-medium leading-relaxed">
        💡 {initialNote}
      </p>
    </div>
  );
};

// Item Card Props
interface ItemCardProps {
    item: ItineraryItem;
    onSaveNote: (id: string, note: string, optionIndex?: number) => void;
    onSaveImage: (id: string, image: string, optionIndex?: number) => void;
    isEditing: boolean;
    onStartDrag: (e: React.DragEvent) => void;
    onLongPressStart: () => void;
    onLongPressEnd: () => void;
    pressProgress: number; // 0 to 100
}

const SingleItemCard = ({ item, onSaveNote, onSaveImage, isEditing, onStartDrag, onLongPressStart, onLongPressEnd, pressProgress }: ItemCardProps) => (
  <div 
    className={`flex-1 bg-white/85 backdrop-blur-md rounded-[24px] p-5 shadow-card border transition-all duration-300 flex flex-col gap-1 relative overflow-hidden select-none
    ${isEditing ? 'border-sabah-blue ring-2 ring-sabah-blue/20' : 'border-white/40 hover:shadow-soft'}`}
    onTouchStart={onLongPressStart}
    onTouchEnd={onLongPressEnd}
    onMouseDown={onLongPressStart}
    onMouseUp={onLongPressEnd}
    onMouseLeave={onLongPressEnd}
  >
     {/* Progress Bar for Long Press */}
     {pressProgress > 0 && pressProgress < 100 && (
        <div className="absolute top-0 left-0 h-1 bg-sabah-blue transition-all duration-100 ease-linear" style={{ width: `${pressProgress}%` }}></div>
     )}

     {/* Edit Badge */}
     {isEditing && (
         <div className="absolute top-2 right-2 bg-sabah-blue text-white text-[9px] px-2 py-0.5 rounded-full font-bold animate-fade-in pointer-events-none">
             編輯模式
         </div>
     )}

     <div className="flex gap-4">
        {/* Drag Handle */}
        <div 
            className="flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500"
            draggable
            onDragStart={onStartDrag}
            onMouseDown={(e) => e.stopPropagation()} // Prevent long press logic on handle
            onTouchStart={(e) => e.stopPropagation()}
        >
            <GripVertical size={20} />
        </div>

        <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <Clock size={10} />
                    {item.type === 'food' ? '餐飲' : 
                    item.type === 'transport' ? '交通' : 
                    item.type === 'activity' ? '行程' : '休息'}
                </div>
            </div>
            
            <h3 className="text-lg font-serif font-bold text-sabah-dark mb-2 leading-tight">{item.activity}</h3>
            <LocationLink location={item.location} coords={item.coords} className="mb-1" />
        </div>
        
        {/* Image Area - Only render if Editing OR Image exists */}
        {(isEditing || item.imageUrl) && (
            <div className="w-20 h-20 flex-shrink-0 rounded-2xl shadow-sm border border-white bg-gray-50 overflow-hidden relative">
                {isEditing ? (
                    <EditableImage 
                        src={item.imageUrl} 
                        alt={item.activity} 
                        onImageChange={(newSrc) => onSaveImage(item.id, newSrc)}
                        className="w-full h-full"
                        placeholderIcon={<Pencil size={20} />}
                    />
                ) : (
                    <img src={item.imageUrl} alt={item.activity} className="w-full h-full object-cover pointer-events-none" />
                )}
            </div>
        )}
     </div>
     
     <EditableNote 
        initialNote={item.notes} 
        onSave={(newNote) => onSaveNote(item.id, newNote)} 
        isEditing={isEditing}
    />
  </div>
);

const MultiOptionCard = ({ item, onSaveNote, onSaveImage, isEditing, onStartDrag, onLongPressStart, onLongPressEnd, pressProgress }: ItemCardProps) => (
  <div 
    className="flex-1 min-w-0"
    onTouchStart={onLongPressStart}
    onTouchEnd={onLongPressEnd}
    onMouseDown={onLongPressStart}
    onMouseUp={onLongPressEnd}
    onMouseLeave={onLongPressEnd}
  >
    <div className="flex items-center gap-2 mb-2 px-2 relative">
       {/* Drag Handle for Multi-Card Group */}
       <div 
            className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 mr-2"
            draggable
            onDragStart={onStartDrag}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
            <GripVertical size={20} />
        </div>

      <span className="text-[10px] bg-white/50 text-sabah-orange border border-sabah-orange/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">二選一</span>
      <div className="flex-1 h-[1px] bg-white/30"></div>
      <span className="text-[10px] text-white font-medium flex items-center gap-1 opacity-80">向右滑動 <ArrowRight size={10} /></span>
      
      {/* Progress Bar for Long Press (Group Level) */}
      {pressProgress > 0 && pressProgress < 100 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-sabah-blue transition-all duration-100 ease-linear z-10" style={{ width: `${pressProgress}%` }}></div>
      )}
    </div>
    
    <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 snap-x no-scrollbar">
      {item.options?.map((opt, idx) => (
        <div key={idx} className={`min-w-[85%] snap-center bg-white/85 backdrop-blur-md rounded-[24px] p-4 shadow-card border flex flex-col gap-3 select-none
         ${isEditing ? 'border-sabah-blue' : 'border-white/40'}`}>
            <div className="flex gap-3">
                <div className="flex-1">
                    <h3 className="text-base font-serif font-bold text-sabah-dark mb-2 leading-tight line-clamp-2">{opt.activity}</h3>
                    <LocationLink location={opt.location} coords={opt.coords} className="mb-1" />
                </div>
                
                {/* Image Area - Only render if Editing OR Image exists */}
                {(isEditing || opt.imageUrl) && (
                    <div className="w-16 h-16 flex-shrink-0 rounded-xl shadow-sm border border-white bg-gray-100 overflow-hidden">
                        {isEditing ? (
                             <EditableImage 
                                src={opt.imageUrl} 
                                alt={opt.activity} 
                                onImageChange={(newSrc) => onSaveImage(item.id, newSrc, idx)}
                                className="w-full h-full"
                            />
                        ) : (
                             <img src={opt.imageUrl} alt={opt.activity} className="w-full h-full object-cover pointer-events-none" />
                        )}
                    </div>
                )}
            </div>
            <EditableNote 
                initialNote={opt.notes} 
                onSave={(newNote) => onSaveNote(item.id, newNote, idx)} 
                isEditing={isEditing}
            />
        </div>
      ))}
    </div>
  </div>
);

const TravelTime = ({ time }: { time: string }) => (
    <div className="flex items-center gap-2 ml-[18px] h-10 border-l-[2px] border-dashed border-gray-300 pl-4 relative my-1">
        <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur px-2 py-1 rounded-full border border-gray-100 shadow-sm">
            <ArrowDown size={10} className="text-gray-400" />
            <span className="text-[10px] font-bold text-gray-500">{time}</span>
        </div>
    </div>
);

const ItineraryList: React.FC<ItineraryListProps> = ({ dayPlan, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Drag and Drop Refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Long Press State
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pressProgress, setPressProgress] = useState(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Handlers ---

  const handleSaveNote = (itemId: string, newNote: string, optionIndex?: number) => {
    const updatedItems = dayPlan.items.map(item => {
      if (item.id === itemId) {
        if (optionIndex !== undefined && item.options) {
          const newOptions = [...item.options];
          newOptions[optionIndex] = { ...newOptions[optionIndex], notes: newNote };
          return { ...item, options: newOptions };
        }
        return { ...item, notes: newNote };
      }
      return item;
    });
    onUpdate({ ...dayPlan, items: updatedItems });
  };

  const handleSaveImage = (itemId: string, newImage: string, optionIndex?: number) => {
    const updatedItems = dayPlan.items.map(item => {
      if (item.id === itemId) {
        if (optionIndex !== undefined && item.options) {
          const newOptions = [...item.options];
          newOptions[optionIndex] = { ...newOptions[optionIndex], imageUrl: newImage };
          return { ...item, options: newOptions };
        }
        return { ...item, imageUrl: newImage };
      }
      return item;
    });
    onUpdate({ ...dayPlan, items: updatedItems });
  };

  // --- Drag and Drop Logic ---

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    // Set a transparent ghost image or styling
    e.dataTransfer.effectAllowed = "move";
    // Close any open edit mode
    setEditingId(null);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index;
  };

  const recalculateSchedule = (items: ItineraryItem[]): ItineraryItem[] => {
    if (items.length === 0) return items;

    const newItems = [...items];
    // Start with the time of the first item (assuming it stays fixed or is the anchor)
    // Actually, if we drag Item 1 to Item 0, the new Item 0 should take the original start time?
    // Let's assume the day starts at the time of the *current* first item.
    let currentMinutes = parseTime(items[0].time); // Use the time of the item currently at top

    // However, if we moved a later item to the top, we probably want to keep the day's start time consistent (e.g. 09:00)
    // So let's grab the earliest time from the original list or just keep the top item's time?
    // Strategy: The new first item gets the original first item's start time.
    // Wait, simpler: The first item in the list defines the start.
    // Let's just iterate.
    
    // We need the *original* start time of the day to anchor the schedule.
    // Let's assume the time on the item at index 0 *after sort* should be set to the time of index 0 *before sort*?
    // Or just use the time currently on the item at index 0? 
    // Let's use the time of the item that ended up at index 0 for now, OR better:
    // We should probably have a "Day Start Time" in DayPlan. Since we don't, we'll infer it from the first item of the current state.
    
    // Actually, to make "recalculate" work, we essentially re-flow times from the first item downwards.
    // We will preserve the time of the NEW first item as the anchor.
    
    for (let i = 0; i < newItems.length; i++) {
        if (i === 0) {
            // First item: keep its time or set to a fixed start? 
            // If we drag a 10:00 item to 09:00 slot, it should probably become 09:00.
            // But without a fixed "Day Start" variable, this is tricky.
            // Let's just calculate subsequent items based on i-1.
            currentMinutes = parseTime(newItems[i].time);
        } else {
            const prevItem = newItems[i - 1];
            const prevStartTime = parseTime(prevItem.time);
            const prevDuration = prevItem.duration || 60; // Default 60 mins if missing
            const travelMinutes = parseTravelTime(prevItem.travelTime);
            
            const newStartMinutes = prevStartTime + prevDuration + travelMinutes;
            newItems[i] = {
                ...newItems[i],
                time: formatTime(newStartMinutes)
            };
        }
    }
    return newItems;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
        const _items = [...dayPlan.items];
        const draggedItemContent = _items[dragItem.current];
        _items.splice(dragItem.current, 1);
        _items.splice(dragOverItem.current, 0, draggedItemContent);
        
        // Recalculate times
        // We force the new first item to take the time of the *original* first item to maintain the day's schedule start
        const originalStartTime = dayPlan.items[0].time;
        _items[0].time = originalStartTime;

        const recalculatedItems = recalculateSchedule(_items);
        
        onUpdate({ ...dayPlan, items: recalculatedItems });
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // --- Long Press Logic ---

  const startLongPress = (id: string) => {
    // If already editing this one, do nothing (or maybe toggle off?)
    if (editingId === id) return;
    
    setPressProgress(0);
    
    // Progress animation for 2000ms
    // Update every 50ms, need 40 steps. 100/40 = 2.5 per step.
    progressIntervalRef.current = setInterval(() => {
        setPressProgress(old => Math.min(old + 2.5, 100));
    }, 50);

    timerRef.current = setTimeout(() => {
        // Trigger Edit Mode
        if (navigator.vibrate) navigator.vibrate(50);
        setEditingId(id);
        setPressProgress(0); // Reset UI
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }, 2000); // 2 seconds
  };

  const cancelLongPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setPressProgress(0);
  };

  // Close edit mode when clicking outside (simple implementation)
  useEffect(() => {
      const handleClick = (e: MouseEvent) => {
          // Logic to close if needed, but for now we leave it open until another is opened
      };
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);


  return (
    <div className="pb-24 animate-fade-in relative z-10 pt-4">
      <div className="px-6">
        {/* Flight Info */}
        {dayPlan.flight && <FlightCard flight={dayPlan.flight} />}

        {/* Timeline */}
        <div className="space-y-2 relative">
          
          {dayPlan.items.map((item, index) => (
            <React.Fragment key={item.id}>
                <div 
                    className="flex gap-4 group"
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDragEnd}
                >
                    {/* Time Column */}
                    <div className="flex flex-col items-center pt-1">
                        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shadow-sm z-10 transition-colors duration-300 relative
                        ${item.type === 'food' ? 'bg-sabah-orange text-white' : 
                            item.type === 'relax' ? 'bg-sabah-green text-white' : 
                            item.type === 'transport' ? 'bg-sabah-yellow text-sabah-dark' :
                            'bg-sabah-blue text-white'}`}>
                            <span className="text-[11px] font-bold font-serif tracking-wider">
                            {item.time}
                            </span>
                        </div>
                    </div>

                    {/* Content Card */}
                    {item.options && item.options.length > 0 ? (
                        <MultiOptionCard 
                            item={item} 
                            onSaveNote={handleSaveNote} 
                            onSaveImage={handleSaveImage}
                            isEditing={editingId === item.id}
                            onStartDrag={(e) => handleDragStart(e, index)}
                            onLongPressStart={() => startLongPress(item.id)}
                            onLongPressEnd={cancelLongPress}
                            pressProgress={editingId === item.id ? 0 : (item.id === dayPlan.items.find(i => i.id === item.id)?.id && pressProgress > 0 ? pressProgress : 0)}
                        />
                    ) : (
                        <SingleItemCard 
                            item={item} 
                            onSaveNote={handleSaveNote} 
                            onSaveImage={handleSaveImage} 
                            isEditing={editingId === item.id}
                            onStartDrag={(e) => handleDragStart(e, index)}
                            onLongPressStart={() => startLongPress(item.id)}
                            onLongPressEnd={cancelLongPress}
                            pressProgress={item.id === dayPlan.items.find(i => i.id === item.id)?.id && pressProgress > 0 ? pressProgress : 0} // Simplify passing logic
                        />
                    )}
                </div>
                
                {/* Render Travel Time between items if it exists on the current item (representing travel TO next) */}
                {item.travelTime && index < dayPlan.items.length - 1 && (
                    <TravelTime time={item.travelTime} />
                )}
                 {/* Gap if no travel time but not last item */}
                {!item.travelTime && index < dayPlan.items.length - 1 && (
                     <div className="h-4 ml-[23px] border-l-[2px] border-gray-300/30"></div>
                )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryList;