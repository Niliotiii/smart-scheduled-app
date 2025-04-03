import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Acesso Não Autorizado</h1>
      <p className="mt-4 text-muted-foreground">
        Você não tem permissão para acessar esta página
      </p>
      <Button className="mt-8" onClick={() => navigate('/')}>
        Voltar para Dashboard
      </Button>
    </div>
  );
}
