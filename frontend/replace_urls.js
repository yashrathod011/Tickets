const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'src/pages/Home.jsx',
    'src/pages/Movies.jsx',
    'src/pages/MyTickets.jsx',
    'src/pages/TheaterDetails.jsx',
    'src/pages/Theaters.jsx',
    'src/pages/MovieDetails.jsx',
    'src/pages/SeatSelection.jsx',
    'src/pages/BookingSummary.jsx',
    'src/pages/AdminPanel.jsx',
    'src/context/AuthContext.jsx'
];

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('const API_URL =')) {
        const importRegex = /(import .* from .*;?\s*)+/;
        const match = content.match(importRegex);
        if (match) {
            const apiVar = `\nconst API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';\n`;
            content = content.replace(match[0], match[0] + apiVar);
        }
    }

    // Replace single quotes containing localhost
    // e.g. 'http://localhost:5000/api/movies' -> `${API_URL}/api/movies`
    content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${API_URL}$1`');
    
    // Replace backticks containing localhost
    // e.g. `http://localhost:5000/api/movies/${id}` -> `${API_URL}/api/movies/${id}`
    content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${API_URL}$1`');

    fs.writeFileSync(filePath, content);
});
console.log('API URLs updated successfully.');
