const fs = require('fs');
let c = fs.readFileSync('src/pages/AdminPanel.jsx', 'utf8');

// 1. Layout
c = c.replace(
    '<div className="flex min-h-screen bg-slate-50 text-slate-800 font-serif">',
    '<div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 text-slate-800 font-serif w-full max-w-[100vw] overflow-hidden">'
);

// 2. Sidebar wrap
c = c.replace(
    '<div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 shadow-sm">',
    '<div className="w-full lg:w-64 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-4 lg:p-6 flex flex-col gap-4 lg:gap-8 shadow-sm z-10 lg:h-screen lg:sticky top-0">'
);

// 3. Nav flex
c = c.replace(
    '<nav className="flex flex-col gap-4">',
    '<nav className="flex flex-row lg:flex-col gap-2 lg:gap-4 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">'
);

// 4. WhiteSpace nowrap to nav buttons
c = c.replace(/className=\{`flex items-center/g, 'className={`shrink-0 whitespace-nowrap flex items-center');

// 5. Hide "Logged in" on small screens
c = c.replace(
    '<div className="mt-auto p-4 bg-indigo-50 rounded-xl border border-slate-200">',
    '<div className="hidden lg:block mt-auto p-4 bg-indigo-50 rounded-xl border border-slate-200">'
);

// 6. Main content padding
c = c.replace(
    '<div className="flex-1 p-8 overflow-y-auto">',
    '<div className="flex-1 p-4 md:p-8 overflow-y-auto w-full min-w-0 max-w-full">'
); 

// 7. Table wrappers
c = c.replace(/className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"/g, 'className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto"');

// 8. Form padding
c = c.replace(
    /className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"/g,
    'className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white p-4 md:p-8 rounded-2xl border border-slate-200 shadow-sm"'
);

// 9. Fix the missed dark block
c = c.replace(
    /className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-\[#1e293b\] p-6 rounded-2xl border border-slate-200 shadow-xl mb-8"/g,
    'className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8"'
);

// 10. Fix movie card list grid container
c = c.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">',
    '<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8 items-start">'
);

// 11. Mobile fixes for add cast member row
c = c.replace(
    '<div className="flex justify-between items-center mb-4">',
    '<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">'
);
c = c.replace(
    '<div className="md:col-span-2 flex gap-4 mt-6">',
    '<div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-6">'
);

fs.writeFileSync('src/pages/AdminPanel.jsx', c);
console.log('Responsiveness fixes applied');
