import React from 'react';
import { Menu } from 'lucide-react';

export default function Navbar({ onHamburger }) {
  return (
    <header className="w-full h-16 flex items-center justify-between px-4 bg-transparent border-b border-blue-medium sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button onClick={onHamburger} className="p-2 rounded-md hover:bg-blue-800 md:hidden">
          <Menu size={18} />
        </button>
        <div className="text-white font-semibold">Health Advisory</div>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-sm px-3 py-1 rounded bg-blue-accent text-black hover:brightness-95 transition">Set Reminder</button>
        <button className="p-2 rounded hover:bg-blue-800">Profile</button>
      </div>
    </header>
  );
}
