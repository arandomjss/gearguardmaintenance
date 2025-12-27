import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase'; // <--- UPDATED IMPORT PATH
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Clock, 
  AlertCircle, 
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO 
} from 'date-fns';

// Define the shape of your table data
interface MaintenanceRequest {
  id: string;
  equipment_name: string;
  technician: string;
  request_date: string; 
  type: 'preventive' | 'corrective';
  status: string;
  priority: string;
}

const TECHNICIANS = ["All Technicians", "Marc Demo", "Mitchell Admin", "External Vendor"];

export default function MaintenanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTech, setSelectedTech] = useState("All Technicians");

  // Fetch directly from Supabase
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*');
      
      if (error) throw error;
      return data as MaintenanceRequest[];
    }
  });

  // Calendar Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Filter Logic
  const getEventsForDay = (day: Date) => {
    if (!events) return [];
    
    return events.filter(event => {
      // Handle timestamp strings from Supabase
      const eventDate = parseISO(event.request_date);
      
      const isSameDate = isSameDay(eventDate, day);
      const isTechMatch = selectedTech === "All Technicians" || event.technician === selectedTech;
      return isSameDate && isTechMatch;
    });
  };

  if (error) return <div className="p-8 text-red-500">Error connecting to Supabase. Check your keys! <br/> {String(error)}</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-primary" />
            Maintenance Schedule
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage corrective and preventive maintenance tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select 
              className="pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
            >
              {TECHNICIANS.map(tech => <option key={tech} value={tech}>{tech}</option>)}
            </select>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center justify-between bg-card p-4 rounded-t-xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold w-48">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center border rounded-md">
            <button onClick={prevMonth} className="p-2 hover:bg-muted"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={nextMonth} className="p-2 hover:bg-muted"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
        
        {isLoading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin h-4 w-4" /> Loading...</div>}
        
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-100 border border-red-500"></span> Corrective
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500"></span> Preventive
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="bg-card rounded-b-xl border border-t-0 border-border shadow-card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center font-semibold text-muted-foreground text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[140px]">
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div 
                key={day.toString()} 
                className={`
                  p-2 border-b border-r border-border transition-colors hover:bg-muted/10 relative
                  ${!isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : 'bg-card'}
                `}
              >
                <div className={`
                  text-sm font-medium mb-2 w-7 h-7 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-primary text-primary-foreground' : ''}
                `}>
                  {format(day, 'd')}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[90px] scrollbar-hide">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`
                        text-xs p-1.5 rounded border truncate cursor-pointer transition-all hover:scale-[1.02]
                        ${event.type === 'corrective' 
                          ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                          : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}
                      `}
                    >
                      <div className="flex items-center gap-1">
                        {event.type === 'corrective' ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span className="font-semibold">{event.equipment_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}