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
  const [showCreate, setShowCreate] = useState(false);

  // Fetch maintenance requests and enrich with equipment + technician names
  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const { data: reqs, error: reqErr } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('request_date', { ascending: true });
      if (reqErr) throw reqErr;

      const requests = (reqs || []) as any[];

      const equipmentIds = Array.from(new Set(requests.map(r => r.equipment_id).filter(Boolean) as number[]));
      const techIds = Array.from(new Set(requests.map(r => r.technician_id).filter(Boolean) as string[]));

      const equipmentMap: Record<number, string> = {};
      if (equipmentIds.length) {
        const { data: eqData, error: eqErr } = await supabase.from('equipment').select('id,name').in('id', equipmentIds);
        if (eqErr) console.warn('equipment fetch error', eqErr);
        (eqData || []).forEach((e: any) => equipmentMap[e.id] = e.name);
      }

      const techMap: Record<string, string> = {};
      if (techIds.length) {
        const { data: prData, error: prErr } = await supabase.from('profiles').select('id,full_name').in('id', techIds);
        if (prErr) console.warn('profiles fetch error', prErr);
        (prData || []).forEach((p: any) => techMap[p.id] = p.full_name);
      }

      // Map requests to calendar-friendly events
      const mapped = requests.map(r => {
        const dateStr = r.schedule_date || r.request_date || null;
        return {
          id: String(r.id),
          equipment_name: equipmentMap[r.equipment_id] || r.maintenance_for || 'Unknown',
          technician: r.technician_id ? (techMap[r.technician_id] || 'Unassigned') : 'Unassigned',
          request_date: dateStr,
          type: r.request_type || 'corrective',
          status: r.stage || r.status || 'new',
          priority: r.priority || 'normal',
        } as MaintenanceRequest;
      });

      return mapped;
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
      const dateToUse = event.request_date || event.request_date; // already filled with schedule_date first in mapping
      if (!dateToUse) return false;
      let eventDate: Date;
      try {
        eventDate = parseISO(dateToUse);
      } catch (e) {
        return false;
      }

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
          <Button onClick={() => setShowCreate(true)}>
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
                          <span className="ml-2 text-xs text-muted-foreground">{event.technician}</span>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

        {/* Create Request Modal (simple in-page) */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Create Maintenance Request</h3>
              <CreateRequestForm onClose={() => { setShowCreate(false); refetch(); }} />
            </div>
          </div>
        )}
    </div>
  );
}

  function CreateRequestForm({ onClose }: { onClose: () => void }) {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [equipmentId, setEquipmentId] = useState<number | ''>('');
    const [technicianId, setTechnicianId] = useState<string | ''>('');
    const [requestDate, setRequestDate] = useState('');
    const [scheduleDate, setScheduleDate] = useState('');
    const [type, setType] = useState<'preventive' | 'corrective'>('corrective');
    const [isSaving, setIsSaving] = useState(false);
    const [equipmentOptions, setEquipmentOptions] = useState<Array<{ id: number; name: string }>>([]);
    const [techOptions, setTechOptions] = useState<Array<{ id: string; full_name: string }>>([]);

    // load selects
    useQuery({
      queryKey: ['_create_meta'],
      queryFn: async () => {
        const [{ data: eqData }, { data: prData }] = await Promise.all([
          supabase.from('equipment').select('id,name'),
          supabase.from('profiles').select('id,full_name').eq('role', 'technician')
        ]);
        setEquipmentOptions(eqData || []);
        setTechOptions(prData || []);
        return true;
      }
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
        const payload: any = {
          subject,
          description,
          equipment_id: equipmentId || null,
          technician_id: technicianId || null,
          request_date: requestDate || null,
          schedule_date: scheduleDate || null,
          request_type: type,
          stage: 'new'
        };

        const { error } = await supabase.from('maintenance_requests').insert([payload]);
        if (error) throw error;
        alert('Created');
        onClose();
      } catch (err: any) {
        console.error('create failed', err);
        alert('Failed: ' + (err?.message || String(err)));
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-muted-foreground">Subject</label>
          <input className="w-full border border-border rounded px-3 py-2" value={subject} onChange={e => setSubject(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground">Description</label>
          <textarea className="w-full border border-border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted-foreground">Equipment</label>
            <select className="w-full border border-border rounded px-2 py-2" value={equipmentId as any} onChange={e => setEquipmentId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">(none)</option>
              {equipmentOptions.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Technician</label>
            <select className="w-full border border-border rounded px-2 py-2" value={technicianId as any} onChange={e => setTechnicianId(e.target.value)}>
              <option value="">(unassigned)</option>
              {techOptions.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted-foreground">Request Date</label>
            <input type="date" className="w-full border border-border rounded px-2 py-2" value={requestDate} onChange={e => setRequestDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Schedule Date</label>
            <input type="date" className="w-full border border-border rounded px-2 py-2" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={type} onChange={e => setType(e.target.value as any)} className="border border-border rounded px-2 py-2">
            <option value="corrective">Corrective</option>
            <option value="preventive">Preventive</option>
          </select>
          <div className="ml-auto flex gap-2">
            <button type="button" className="px-3 py-2 border rounded" onClick={() => onClose()}>Cancel</button>
            <button type="submit" className="px-3 py-2 bg-primary text-white rounded" disabled={isSaving}>{isSaving ? 'Saving...' : 'Create'}</button>
          </div>
        </div>
      </form>
    );
  }