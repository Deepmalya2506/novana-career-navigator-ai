import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Career from './pages/CareerRoadmap';
import ExamPrep from './pages/ExamPrep';
import Events from './pages/Events';
import LinkedIn from './pages/LinkedInGenerator';
import NightOwl from './pages/NightOwl';
import Community from './pages/Community';
import Proctored from './pages/ProctoredMode';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import ReadMe from './pages/ReadMe';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/career',
    element: <Career />
  },
  {
    path: '/exam',
    element: <ExamPrep />
  },
  {
    path: '/events',
    element: <Events />
  },
  {
    path: '/linkedin',
    element: <LinkedIn />
  },
  {
    path: '/night-owl',
    element: <NightOwl />
  },
  {
    path: '/community',
    element: <Community />
  },
  {
    path: '/proctored',
    element: <Proctored />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/readme',
    element: <ReadMe />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
