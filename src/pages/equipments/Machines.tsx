import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Wrench, Monitor, Laptop } from "lucide-react";

// Types matching your database schema
interface EquipmentType {
  id: string;
  name: string;
  employee: string;
  department: string;
  serial_number: string;
  technician: string;
  category: string;
  company: string;
}

// Mock Data matching your "Samsung Monitor" and "Acer Laptop" examples
const MOCK_MACHINES: EquipmentType[] = [
  {
    id: '1',
    name: 'Samsung Monitor 15"',
    employee: 'Tejas Modi',
    department: 'Admin',
    serial_number: 'MT/125/22778837',
    technician: 'Mitchell Admin',
    category: 'Monitors',
    company: 'My Company (San Francisco)'
  },
  {
    id: '2',
    name: 'Acer Laptop',
    employee: 'Bhaumik P',
    department: 'Technician',
    serial_number: 'MT/122/11112222',
    technician: 'Marc Demo',
    category: 'Computers',
    company: 'My Company (San Francisco)'
  },
  {
    id: '3',
    name: 'HP LaserJet Pro',
    employee: 'Office General',
    department: 'Operations',
    serial_number: 'PRT/009/998877',
    technician: 'Marc Demo',
    category: 'Printers',
    company: 'My Company (San Francisco)'
  }
];

export default function Machines() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-white border rounded-lg shadow-sm min-h-[80vh] flex flex-col animate-fade-in">
      {/* Header & Actions */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-gray-500" />
          <h1 className="text-xl font-bold text-gray-800">Machines & Tools</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search equipment..." 
              className="pl-9 h-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> New Equipment
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-bold text-gray-700 h-12 w-[250px]">Equipment Name</TableHead>
              <TableHead className="font-bold text-gray-700 h-12">Employee</TableHead>
              <TableHead className="font-bold text-gray-700 h-12">Department</TableHead>
              <TableHead className="font-bold text-gray-700 h-12">Serial Number</TableHead>
              <TableHead className="font-bold text-gray-700 h-12">Technician</TableHead>
              <TableHead className="font-bold text-gray-700 h-12">Category</TableHead>
              <TableHead className="font-bold text-gray-700 h-12">Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_MACHINES.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map((row) => (
              <TableRow 
                key={row.id} 
                className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => console.log("Navigate to details", row.id)}
              >
                <TableCell className="font-medium text-primary flex items-center gap-2">
                  {/* Dynamic Icon based on category */}
                  {row.category === 'Monitors' ? <Monitor className="h-4 w-4 text-gray-400" /> : 
                   row.category === 'Computers' ? <Laptop className="h-4 w-4 text-gray-400" /> :
                   <Wrench className="h-4 w-4 text-gray-400" />}
                  {row.name}
                </TableCell>
                <TableCell className="text-gray-600">{row.employee}</TableCell>
                <TableCell className="text-gray-600">{row.department}</TableCell>
                <TableCell className="text-gray-600 font-mono text-xs">{row.serial_number}</TableCell>
                <TableCell className="text-gray-600">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {row.technician}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">{row.category}</TableCell>
                <TableCell className="text-gray-500 text-sm">{row.company}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}