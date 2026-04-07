import movie1 from '../assets/movie_1.png';
import movie2 from '../assets/movie_2.png';
import movie3 from '../assets/movie_3.png';

export const MOVIES = [
  {
    id: 1,
    title: "Fight Club",
    description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    fullDescription: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more. Together, they establish a secret society that eventually spirals out of control into a cult-like revolutionary movement.",
    genre: "Action / Drama",
    rating: "4.9",
    duration: "2h 19m",
    releaseDate: "1999-10-15",
    poster: movie1,
    status: "Now Playing",
    cast: [
      { name: "Brad Pitt", role: "Tyler Durden" },
      { name: "Edward Norton", role: "The Narrator" },
      { name: "Helena Bonham Carter", role: "Marla Singer" },
      { name: "Meat Loaf", role: "Robert Paulson" }
    ]
  },
  {
    id: 2,
    title: "Cyberpunk 2077",
    description: "In a world of cybernetic enhancements, a mercenary takes on a high-stakes heist in Night City.",
    fullDescription: "In a world dominated by mega-corporations and cybernetic enhancements, V, a mercenary in the neon-drenched metropolis of Night City, takes on a high-stakes heist to steal a unique brain implant that grants immortality.",
    genre: "Sci-Fi / Action",
    rating: "4.8",
    duration: "2h 45m",
    releaseDate: "2026-05-20",
    poster: movie1,
    status: "Now Playing",
    cast: [
      { name: "Keanu Reeves", role: "Johnny Silverhand" },
      { name: "Cherami Leigh", role: "V" },
      { name: "Gavin Drea", role: "Jackie Welles" }
    ]
  },
  {
    id: 3,
    title: "Shadow Protocol",
    description: "A rogue agent must infiltrate a high-security facility to stop a global catastrophe.",
    fullDescription: "When the IMF is implicated in a global terrorist plot, a rogue agent must go 'Ghost Protocol' to clear the agency's name and prevent a catastrophic nuclear launch.",
    genre: "Thriller / Spy",
    rating: "4.5",
    duration: "2h 12m",
    releaseDate: "2026-06-15",
    poster: movie2,
    status: "Now Playing",
    cast: [
      { name: "Tom Cruise", role: "Ethan Hunt" },
      { name: "Simon Pegg", role: "Benji Dunn" },
      { name: "Rebecca Ferguson", role: "Ilsa Faust" }
    ]
  },
  {
    id: 4,
    title: "Sunset Serenade",
    description: "A poignant drama about a young musician finding love and loss on the California coast.",
    fullDescription: "A poignant drama exploring the lives of two musicians as they navigate their way through romance and professional struggles in the beautiful but harsh landscape of corporate California.",
    genre: "Romance / Drama",
    rating: "4.2",
    duration: "1h 55m",
    releaseDate: "2026-07-10",
    poster: movie3,
    status: "Coming Soon",
    cast: [
      { name: "Ryan Gosling", role: "Musician" },
      { name: "Emma Stone", role: "Aspiring Actress" }
    ]
  },
  {
    id: 5,
    title: "Neon Nights",
    description: "In a neon-drenched future, a detective investigates a murder that leads to the highest levels of power.",
    fullDescription: "In a neon-drenched futuristic city where the rain never stops, a hard-boiled detective uncovers a conspiracy that could bring down the city's ruling elite.",
    genre: "Sci-Fi / Noir",
    rating: "4.1",
    duration: "2h 05m",
    releaseDate: "2026-08-05",
    poster: movie1,
    status: "Now Playing",
    cast: [
        { name: "Harrison Ford", role: "Rick Deckard" },
        { name: "Ryan Gosling", role: "Officer K" }
    ]
  },
  {
    id: 9,
    title: "The Ghost Runner",
    description: "A tracker must hunt down a phantom killer who can phase through solid objects.",
    fullDescription: "In a high-stakes game of cat and mouse, a specialized tracker is hired to hunt down a phantom killer with the unique ability to phase through solid objects.",
    genre: "Action / Thriller",
    rating: "4.6",
    duration: "1h 48m",
    releaseDate: "2026-04-10",
    poster: movie2,
    status: "Now Playing",
    cast: [
        { name: "Cillian Murphy", role: "The Tracker" },
        { name: "Emily Blunt", role: "The Client" }
    ]
  }
];

export const THEATERS = [
  {
    id: "t1",
    name: "PVR: ICON, Palladium",
    location: "Lower Parel, Mumbai",
    basePrice: 350,
    screens: [
      { id: "s1", type: "IMAX 2D", rows: 10, cols: 12 },
      { id: "s2", type: "4DX", rows: 8, cols: 10 }
    ]
  },
  {
    id: "t2",
    name: "INOX: Insignia",
    location: "Nariman Point, Mumbai",
    basePrice: 550,
    screens: [
      { id: "s3", type: "LUXE", rows: 6, cols: 8 }
    ]
  },
  {
    id: "t3",
    name: "Cinepolis: VIP",
    location: "Andheri West, Mumbai",
    basePrice: 450,
    screens: [
      { id: "s4", type: "VIP", rows: 8, cols: 12 }
    ]
  }
];

// Helper to generate next 3 days
export const getBookingDays = () => {
  const days = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      fullDate: d.toISOString().split('T')[0]
    });
  }
  return days;
};

export const SHOW_SLOTS = ["10:30 AM", "01:45 PM", "04:30 PM", "07:15 PM", "10:00 PM"];
