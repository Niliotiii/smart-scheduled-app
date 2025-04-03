import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AppTopBar() {
  const { selectedTeam, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="h-14 border-b border-border bg-background px-4 flex items-center justify-between">
      <div className="font-semibold">{selectedTeam?.name}</div>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => navigate('/profile')}
      >
        <span>{user?.name || user?.email}</span>
        <User className="h-4 w-4" />
      </Button>
    </div>
  );
}
