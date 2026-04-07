const fs = require('fs');
let c = fs.readFileSync('src/pages/AdminPanel.jsx', 'utf8');

c = c.replace(/bg-\[#050505\]/g, 'bg-slate-50');
c = c.replace(/text-\[#e5e5e5\]/g, 'text-slate-800');
c = c.replace(/bg-\[#121212\]/g, 'bg-white');
c = c.replace(/text-white/g, 'text-slate-900');
c = c.replace(/text-\[#F0FF42\]\/[0-9]+/g, 'text-indigo-500');
c = c.replace(/text-\[#F0FF42\]/g, 'text-indigo-600');
c = c.replace(/bg-\[#F0FF42\]\/[0-9]+/g, 'bg-indigo-50');
c = c.replace(/bg-\[#F0FF42\]/g, 'bg-indigo-600');
c = c.replace(/border-\[#F0FF42\]\/[0-9]+/g, 'border-slate-200');
c = c.replace(/border-\[#F0FF42\]/g, 'border-indigo-600');
c = c.replace(/ring-\[#F0FF42\]\/[0-9]+/g, 'ring-indigo-500/50');
c = c.replace(/ring-\[#F0FF42\]/g, 'ring-indigo-500');
c = c.replace(/hover:bg-\[#8251FF\]/g, 'hover:bg-indigo-700');
c = c.replace(/bg-\[#8251FF\]\/20/g, 'bg-indigo-100');
c = c.replace(/hover:bg-\[#8251FF\]\/30/g, 'hover:bg-indigo-200');
c = c.replace(/shadow-\[0_0_15px_rgba\(240,255,66,[0-9.]+\)\]/g, 'shadow-sm'); // replaced all neon shadows with subtle shadows
c = c.replace(/shadow-2xl/g, 'shadow-sm'); // light minimalist themes don't use heavy shadows
c = c.replace(/bg-black/g, 'bg-white'); 
c = c.replace(/border-slate-800/g, 'border-slate-200');

// Text Colors (Grays)
c = c.replace(/text-slate-400/g, 'text-slate-600');
c = c.replace(/text-slate-200/g, 'text-slate-700');
c = c.replace(/text-slate-300/g, 'text-slate-600');

// Backgrounds & effects
c = c.replace(/hover:bg-slate-800\/50/g, 'hover:bg-slate-50');
c = c.replace(/bg-white\/5/g, 'bg-slate-100');
c = c.replace(/bg-white\/10/g, 'bg-slate-200');
c = c.replace(/hover:bg-white\/5/g, 'hover:bg-slate-50');
c = c.replace(/hover:bg-white\/10/g, 'hover:bg-slate-100');
c = c.replace(/border-white\/10/g, 'border-slate-200');
c = c.replace(/divide-white\/5/g, 'divide-slate-100');
c = c.replace(/divide-slate-800/g, 'divide-slate-100');
c = c.replace(/bg-slate-700\/50/g, 'bg-rose-50');
c = c.replace(/text-rose-500/g, 'text-rose-600');

// General Light theme borders
c = c.replace(/border-b border-indigo-[0-9]+/g, 'border-b border-slate-200');
c = c.replace(/bg-white border-b border-slate-200/g, 'bg-slate-50 border-b border-slate-200'); // for table headers

// Primary button text handling
c = c.replace(/text-black/g, 'text-white'); 
c = c.replace(/hover:text-black/g, 'hover:text-white');

// For specific inputs:
c = c.replace(/placeholder:text-gray-700/g, 'placeholder:text-slate-400');

// Custom tweaks for AdminPanel headers
c = c.replace(/bg-indigo-600 border border-indigo-600/g, 'bg-indigo-50 border border-indigo-200');

fs.writeFileSync('src/pages/AdminPanel.jsx', c);
console.log('Done!');
