import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users } from "lucide-react";
// import { supabase } from '@/lib/supabase'; // Uncomment when ready to fetch real data

// --- TYPES BASED ON YOUR SCHEMA ---
// Based on the 'profiles' table
interface Profile {
  id: string;
  full_name: string;
  // role, team_id, etc.
}

// Based on the 'teams' table, joined with 'profiles'
interface TeamWithMembers {
  id: string;
  name: string;
  company: string;
  members: Profile[]; // A team has many members
}

// --- MOCK DATA (Matching your Excalidraw Sketch) ---
const MOCK_TEAMS: TeamWithMembers[] = [
  {
    id: 't1',
    name: 'Internal Maintenance',
    company: 'My Company (San Francisco)',
    members: [
      { id: 'p1', full_name: 'Anas Makari' }
    ]
  },
  {
    id: 't2',
    name: 'Metrology',
    company: 'My Company (San Francisco)',
    members: [
      { id: 'p2', full_name: 'Marc Demo' }
    ]
  },
  {
    id: 't3',
    name: 'Subcontractor',
    company: 'My Company (San Francisco)',
    members: [
      { id: 'p3', full_name: 'Maggie Davidson' }
    ]
  }
];

export default function Teams() {
  const [teams, setTeams] = useState<TeamWithMembers[]>(MOCK_TEAMS);
  const [isLoading, setIsLoading] = useState(false);

  // --- SUPABASE FETCHING EXAMPLE (Commented Out) ---
  /*
  useEffect(() => {
    async function fetchTeams() {
      setIsLoading(true);
      // Fetch teams and join with profiles to get members
      // This is a simplified example. Your actual query might differ.
      const { data, error } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          company,
          members:profiles(id, full_name)
        `);

      if (error) {
        console.error('Error fetching teams:', error);
      } else {
        // Supabase returns members as an array due to the join relationship
        setTeams(data as unknown as TeamWithMembers[]);
      }
      setIsLoading(false);
    }

    fetchTeams();
  }, []);
  */

  return (
    <div className="bg-white border rounded-lg shadow-sm animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <h1 className="text-xl font-bold text-gray-800">Teams</h1>
        </div>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-bold text-gray-700 h-12">Team Name</TableHead>
            <TableHead className="font-bold text-gray-700 h-12">Team Members</TableHead>
            <TableHead className="font-bold text-gray-700 h-12">Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Simple Loading State
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                Loading teams...
              </TableCell>
            </TableRow>
          ) : teams.length === 0 ? (
            // Empty State
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                No teams found.
              </TableCell>
            </TableRow>
          ) : (
            // Data Rows
            teams.map((team) => (
              <TableRow key={team.id} className="hover:bg-gray-50/50 cursor-pointer transition-colors">
                <TableCell className="font-medium text-primary">
                  {team.name}
                </TableCell>
                <TableCell>
                  {team.members.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {team.members.map((member, index) => (
                        <span key={member.id} className="text-gray-700">
                          {member.full_name}
                          {index < team.members.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No members</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">
                  {team.company}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}