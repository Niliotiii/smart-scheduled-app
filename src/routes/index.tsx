import { PermissionGuard } from '@/components/PermissionGuard';
import { UnauthorizedPage } from '@/components/UnauthorizedPage';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import Assignments from '@/pages/Assignments';
import Index from '@/pages/Index';
import Invites from '@/pages/Invites';
import Login from '@/pages/Login';
import Schedules from '@/pages/Schedules';
import Teams from '@/pages/Teams';
import TeamView from '@/pages/TeamView';
import Users from '@/pages/Users';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/assignments',
        element: (
          <PermissionGuard permission="ViewAssignments">
            <Assignments />
          </PermissionGuard>
        ),
      },
      {
        path: '/schedules',
        element: (
          <PermissionGuard permission="ViewSchedules">
            <Schedules />
          </PermissionGuard>
        ),
      },
      {
        path: '/teams',
        element: (
          <PermissionGuard permission="ViewTeams">
            <Teams />
          </PermissionGuard>
        ),
      },
      {
        path: '/users',
        element: (
          <PermissionGuard permission="ViewUsers">
            <Users />
          </PermissionGuard>
        ),
      },
      {
        path: '/invites',
        element: (
          <PermissionGuard permission="ManageInvites">
            <Invites />
          </PermissionGuard>
        ),
      },
      {
        path: '/unauthorized',
        element: <UnauthorizedPage />,
      },
      {
        path: '/teams/:id',
        element: (
          <PermissionGuard permission="ViewTeam">
            <TeamView />
          </PermissionGuard>
        ),
      },
    ],
  },
]);
