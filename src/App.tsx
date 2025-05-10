
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/career" element={<Career />} />
      <Route path="/exam" element={<ExamPrep />} />
      <Route path="/events" element={<Events />} />
      <Route path="/linkedin" element={<LinkedIn />} />
      <Route path="/night-owl" element={<NightOwl />} />
      <Route path="/community" element={<Community />} />
      <Route path="/proctored" element={<Proctored />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/readme" element={<ReadMe />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
