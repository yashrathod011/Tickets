const fs = require('fs');

const transformFile = (file, edits) => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        for (const [search, replace] of edits) {
            content = content.replace(search, replace);
        }
        fs.writeFileSync(file, content);
        console.log(`Transformed ${file}`);
    } catch (e) {
        console.error(`Error with ${file}: ${e.message}`);
    }
};

// 1. Home.jsx
transformFile('src/pages/Home.jsx', [
    [/px-8/g, 'px-4 md:px-8'],
    [/className="grid grid-cols-4/g, 'className="grid grid-cols-2 lg:grid-cols-4'],
    [/className="grid grid-cols-5/g, 'className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5']
]);

// 2. Movies.jsx & Theaters.jsx
const gridEdits = [
    [/px-12/g, 'px-4 md:px-12'],
    [/px-8/g, 'px-4 md:px-8'],
    [/className="grid grid-cols-4/g, 'className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'],
    [/className="grid grid-cols-5/g, 'className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5'],
    [/className="w-64/g, 'className="w-full md:w-64']
];
transformFile('src/pages/Movies.jsx', gridEdits);
transformFile('src/pages/Theaters.jsx', gridEdits);

// 3. MovieDetails.jsx
transformFile('src/pages/MovieDetails.jsx', [
    [/px-8/g, 'px-4 md:px-8'],
    [/<div className="flex gap-12/g, '<div className="flex flex-col md:flex-row gap-8 md:gap-12'],
    [/className="w-1\/3 shrink-0/g, 'className="w-full md:w-1/3 shrink-0'],
    [/<div className="text-4xl/g, '<div className="text-3xl md:text-4xl']
]);

// 4. TheaterDetails.jsx
transformFile('src/pages/TheaterDetails.jsx', [
    [/px-12/g, 'px-4 md:px-12'],
    [/px-8/g, 'px-4 md:px-8'],
    // Ensure movie/showtime rows wrap correctly
    [/<div className="flex gap-8/g, '<div className="flex flex-col md:flex-row gap-4 md:gap-8'],
    [/className="w-32/g, 'className="w-24 md:w-32']
]);

// 5. SeatSelection.jsx
transformFile('src/pages/SeatSelection.jsx', [
    [/px-12/g, 'px-4 md:px-12'],
    [/px-8/g, 'px-4 md:px-8'],
    [/<div className="flex gap-12/g, '<div className="flex flex-col lg:flex-row gap-8 lg:gap-12'],
    [/className="flex-1/g, 'className="flex-1 overflow-x-auto min-w-0 max-w-full pb-4 md:pb-0"'], // allow seat grid to scroll
    [/className="w-96/g, 'className="w-full lg:w-96'] // summary box on the right
]);

// 6. BookingSummary.jsx
transformFile('src/pages/BookingSummary.jsx', [
    [/px-12/g, 'px-4 md:px-12'],
    [/px-8/g, 'px-4 md:px-8'],
    [/<div className="grid grid-cols-3 gap-8">/g, '<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">'],
    [/<div className="col-span-2/g, '<div className="col-span-1 lg:col-span-2']
]);

// 7. Login.jsx & Signup.jsx
const authEdits = [
    [/className="w-96/g, 'className="w-full max-w-md'],
    [/px-8/g, 'px-4 md:px-8']
];
transformFile('src/pages/Login.jsx', authEdits);
transformFile('src/pages/Signup.jsx', authEdits);

// 8. MyTickets.jsx
transformFile('src/pages/MyTickets.jsx', [
    [/px-12/g, 'px-4 md:px-12'],
    [/px-8/g, 'px-4 md:px-8'],
    [/<div className="flex gap-6/g, '<div className="flex flex-col md:flex-row gap-4 md:gap-6'],
    [/<div className="w-1\/4/g, '<div className="w-full md:w-1/4'],
    [/className="flex-1 flex flex-col justify-center/g, 'className="flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 pl-0 md:pl-6']
]);

// 9. MovieCard.jsx
transformFile('src/components/MovieCard.jsx', [
    [/p-6/g, 'p-4 sm:p-6'],
    [/top-2 right-2/g, 'top-2 right-2 sm:top-2 sm:right-2']
]);

console.log('Mobile classes applied to pages!');
