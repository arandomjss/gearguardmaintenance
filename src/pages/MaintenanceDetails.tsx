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
  MoreHorizontal
} from 'lucide-react';

// Status Pipeline Steps
const STEPS = ["New Request", "In Progress", "Repaired", "Scrap"];

// --- MOCK DATABASE (Simulating separate pages) ---
const MOCK_DB: Record<string, any> = {
  "1": {
    title: "Website Redesign",
    equipment: "Server Rack A1",
    priority: "3",
    status: "In Progress",
    technician: "Sarah Connor",
    type: "preventive"
  },
  "2": {
    title: "Mobile App Development",
    equipment: "MacBook Pro M2",
    priority: "2",
    status: "New Request",
    technician: "Alex Morgan",
    type: "corrective"
  },
  "3": {
    title: "Security Audit",
    equipment: "Firewall Gateway",
    priority: "3",
    status: "Repaired",
    technician: "John Doe",
    type: "preventive"
  }
};

export default function MaintenanceDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // <--- This grabs the ID from the URL
  
  // Load data based on ID, or fallback to a default if ID doesn't exist
  const data = MOCK_DB[id || "1"] || MOCK_DB["1"];

  const [status, setStatus] = useState(data.status);
  const [priority, setPriority] = useState(data.priority);
  const [maintenanceType, setMaintenanceType] = useState(data.type);

  // Update state if ID changes
  useEffect(() => {
    setStatus(data.status);
    setPriority(data.priority);
    setMaintenanceType(data.type);
  }, [data]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in bg-white min-h-screen border rounded-xl shadow-sm">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" onClick={() => navigate('/maintenance')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Maintenance
          </Button>
          <div className="text-sm text-muted-foreground hidden sm:block">
            Maintenance Requests / <span className="text-foreground font-medium">{data.title}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2"/> Print</Button>
          <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2"/> Actions</Button>
        </div>
      </div>

      {/* Main Content Card (Odoo Style) */}
      <div className="border border-border rounded-lg overflow-hidden shadow-sm">
        
        {/* Header: Title & Status Pipeline */}
        <div className="bg-white p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b">
          <div className="flex items-center gap-4">
             <h1 className="text-2xl font-bold truncate">{data.title}</h1>
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
              <div className="col-span-2 font-medium">Mitchell Admin</div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Equipment</Label>
              <div className="col-span-2">
                <Select defaultValue={data.equipment}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={data.equipment}>{data.equipment}</SelectItem>
                    <SelectItem value="cnc">CNC Machine X2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Category</Label>
              <div className="col-span-2 border-b border-border pb-1">Electronics</div>
            </div>

             <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Request Date</Label>
              <div className="col-span-2">
                 <Input type="date" defaultValue="2025-12-18" className="h-8" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-start gap-4 pt-2">
              <Label className="text-muted-foreground font-normal mt-1">Maintenance Type</Label>
              <div className="col-span-2">
                <RadioGroup 
                  value={maintenanceType} 
                  onValueChange={setMaintenanceType}
                  className="flex flex-col space-y-2"
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
              <div className="col-span-2 border-b border-border pb-1">Internal Maintenance</div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Technician</Label>
              <div className="col-span-2 border-b border-border pb-1 flex items-center justify-between">
                <span>{data.technician}</span>
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Scheduled Date</Label>
              <div className="col-span-2 flex items-center gap-2">
                <Input type="datetime-local" defaultValue="2025-12-28T14:30" className="h-8" />
              </div>
            </div>

             <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-muted-foreground font-normal">Duration</Label>
              <div className="col-span-2 flex items-center gap-2">
                <Input type="number" defaultValue="0" className="w-20 h-8" />
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
              <div className="col-span-2 border-b border-border pb-1">My Company (San Francisco)</div>
            </div>
          </div>

        </div>

        {/* Bottom Tabs */}
        <div className="bg-muted/10 border-t border-border p-4">
           <Tabs defaultValue="notes" className="w-full">
            <TabsList className="bg-transparent border-b w-full justify-start h-auto p-0 rounded-none">
              <TabsTrigger 
                value="notes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Notes
              </TabsTrigger>
              <TabsTrigger 
                value="instructions"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Instructions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="p-4 bg-white mt-0 border border-t-0 rounded-b-lg min-h-[100px]">
              <p className="text-muted-foreground text-sm">Add internal notes here...</p>
            </TabsContent>
             <TabsContent value="instructions" className="p-4 bg-white mt-0 border border-t-0 rounded-b-lg min-h-[100px]">
              <p className="text-muted-foreground text-sm">Maintenance instructions go here...</p>
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  );
}