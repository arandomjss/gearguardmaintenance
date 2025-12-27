import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Printer, 
  Settings, 
  Star, 
  User, 
  Calendar,
  Clock
} from 'lucide-react';

// Status Pipeline Steps
const STEPS = ["New Request", "In Progress", "Repaired", "Scrap"];

// --- HARDCODED DATA ---
const MOCK_DATA = {
  id: 1,
  subject: "Oil Leakage in Conveyor Belt",
  request_date: "2023-10-25",
  schedule_date: "2023-10-27T10:00",
  duration_hours: 4,
  priority: "3", // 3 stars
  status: "In Progress",
  type: "corrective",
  description: "Detected oil leakage near the main motor assembly. Needs urgent seal replacement.",
  
  // Relations
  creator_name: "Anas Makari",
  technician_name: "Marc Demo",
  maintenance_for: "Internal Maintenance",
  company: "My Company (San Francisco)",
  
  equipment: {
    name: "Conveyor Belt M-01",
    category: "Motors",
    id: 101
  }
};

export default function MaintenanceDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  // Initialize with Mock Data directly
  const [request, setRequest] = useState<any>(MOCK_DATA);
  const [status, setStatus] = useState<string>(MOCK_DATA.status);
  const [priority, setPriority] = useState<string>(MOCK_DATA.priority);
  const [maintenanceType, setMaintenanceType] = useState<string>(MOCK_DATA.type);

  // You can keep this effect if you want to TRY fetching real data later
  useEffect(() => {
    console.log("Maintenance Details Loaded for ID:", id);
    // If you want to fetch real data, put your Supabase logic here.
    // For now, we just rely on the MOCK_DATA above.
  }, [id]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in bg-white min-h-screen border rounded-xl shadow-sm">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" onClick={() => navigate('/maintenance')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Maintenance
          </Button>
          <div className="text-sm text-muted-foreground hidden sm:block">
            Maintenance Requests / <span className="text-foreground font-medium">{request.subject}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2"/> Print</Button>
          <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2"/> Actions</Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="border border-border rounded-lg overflow-hidden shadow-sm">
        
        {/* Header: Title & Status Pipeline */}
        <div className="bg-white p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b">
          <div className="flex items-center gap-4">
             <h1 className="text-2xl font-bold truncate">{request.subject}</h1>
             <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">#{id || 'NEW'}</span>
          </div>

          {/* Status Pipeline Pill */}
          <div className="flex items-center text-sm font-medium border rounded-md overflow-hidden bg-muted/10 w-full xl:w-auto overflow-x-auto">
            {STEPS.map((step, index) => {
              const isActive = step === status;
              const isPast = STEPS.indexOf(status) > index;
              
              return (
                <button
                  key={step}
                  onClick={() => setStatus(step)}
                  className={cn(
                    "flex-1 xl:flex-none px-4 py-2 transition-colors border-r last:border-r-0 whitespace-nowrap text-center",
                    isActive ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted",
                    isPast && "text-primary bg-primary/5"
                  )}
                >
                  {step}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 bg-white">
          
          {/* Left Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Created By</Label>
              <div className="col-span-2 font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {request.creator_name[0]}
                </div>
                {request.creator_name}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Equipment</Label>
              <div className="col-span-2">
                <Select defaultValue={request.equipment.name}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={request.equipment.name}>{request.equipment.name}</SelectItem>
                    <SelectItem value="drill">Drill Press X2</SelectItem>
                    <SelectItem value="laptop">Dell Latitude</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Category</Label>
              <div className="col-span-2 border-b border-border pb-1 text-sm">{request.equipment.category}</div>
            </div>

             <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Request Date</Label>
              <div className="col-span-2">
                 <Input type="date" defaultValue={request.request_date} className="h-9" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-start gap-4 pt-2">
              <Label className="text-muted-foreground font-normal mt-1">Type</Label>
              <div className="col-span-2">
                <RadioGroup 
                  value={maintenanceType} 
                  onValueChange={setMaintenanceType}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="corrective" id="r1" />
                    <Label htmlFor="r1" className="font-normal cursor-pointer">Corrective</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="preventive" id="r2" />
                    <Label htmlFor="r2" className="font-normal cursor-pointer">Preventive</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Team</Label>
              <div className="col-span-2 border-b border-border pb-1 text-sm">{request.maintenance_for}</div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Technician</Label>
              <div className="col-span-2 border-b border-border pb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <User className="h-4 w-4 text-muted-foreground" />
                   <span>{request.technician_name}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Scheduled</Label>
              <div className="col-span-2 flex items-center gap-2 relative">
                <Calendar className="h-4 w-4 text-muted-foreground absolute left-3 z-10" />
                <Input type="datetime-local" defaultValue={request.schedule_date} className="h-9 pl-9" />
              </div>
            </div>

             <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Duration</Label>
              <div className="col-span-2 flex items-center gap-2 relative">
                <Clock className="h-4 w-4 text-muted-foreground absolute left-3 z-10" />
                <Input type="number" defaultValue={request.duration_hours} className="w-24 h-9 pl-9" />
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Priority</Label>
              <div className="col-span-2 flex items-center gap-1">
                {[1, 2, 3].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setPriority(star.toString())}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={cn(
                        "h-5 w-5", 
                        parseInt(priority) >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Company</Label>
              <div className="col-span-2 border-b border-border pb-1 text-sm">{request.company}</div>
            </div>
          </div>

        </div>

        {/* Bottom Tabs */}
        <div className="bg-muted/10 border-t border-border p-4">
           <Tabs defaultValue="description" className="w-full">
            <TabsList className="bg-transparent border-b w-full justify-start h-auto p-0 rounded-none">
              <TabsTrigger 
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="notes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Internal Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4 bg-white mt-0 border border-t-0 rounded-b-lg min-h-[100px]">
              <p className="text-gray-700 text-sm">{request.description}</p>
            </TabsContent>
            <TabsContent value="notes" className="p-4 bg-white mt-0 border border-t-0 rounded-b-lg min-h-[100px]">
              <p className="text-muted-foreground text-sm italic">No internal notes added yet.</p>
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  );
}