import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import PageBackground from './PageBackground';

export default function AppLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <PageBackground />
      <Navbar />
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-5 md:px-10 py-8">
        <Outlet />
      </main>
    </div>
  );
}
