const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Showtime = require('./models/Showtime');
const dns = require('dns');

dotenv.config();

// Force DNS resolution for Atlas connectivity issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const movies = [
  {
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    fullDescription: "A dramatization of the life story of J. Robert Oppenheimer, the physicist who had a large role in the Manhattan Project that helped develop the atomic bomb. The film explores his complex legacy and the ethical dilemmas of scientific discovery.",
    genre: "Drama / History / Thriller",
    rating: "4.9",
    duration: "3h 00m",
    releaseDate: "2023-07-21",
    poster: "https://image.tmdb.org/t/p/w500/7p4JCF9ptaE7Ptc9SLxTPv7QdfH.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
    status: "Now Playing",
    cast: [
      { name: "Cillian Murphy", role: "J. Robert Oppenheimer" },
      { name: "Emily Blunt", role: "Kitty Oppenheimer" },
      { name: "Robert Downey Jr.", role: "Lewis Strauss" },
      { name: "Matt Damon", role: "Leslie Groves" }
    ]
  },
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    fullDescription: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    genre: "Sci-Fi / Adventure / Action",
    rating: "4.8",
    duration: "2h 46m",
    releaseDate: "2024-03-01",
    poster: "https://image.tmdb.org/t/p/w500/6ZUrvJSgUhXYHUJMIWBbabVLPn7.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    status: "Now Playing",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides" },
      { name: "Zendaya", role: "Chani" },
      { name: "Rebecca Ferguson", role: "Lady Jessica" },
      { name: "Austin Butler", role: "Feyd-Rautha Harkonnen" }
    ]
  },
  {
    title: "Interstellar",
    description: "When Earth becomes uninhabitable, a team of explorers travels through a wormhole in space to ensure humanity's survival.",
    fullDescription: "In a future where Earth is suffering from an extreme blight and famine, a group of explorers led by Joseph Cooper travels through a newly discovered wormhole in an attempt to find a new home for the human race.",
    genre: "Sci-Fi / Drama / Adventure",
    rating: "4.9",
    duration: "2h 49m",
    releaseDate: "2014-11-06",
    poster: "https://image.tmdb.org/t/p/w1280/nCbk19SIsKbSgeq1Pqc68SBR9vL.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xJHbt9vY69R7969MstI6Vp9hX0P.jpg",
    status: "Now Playing",
    cast: [
      { name: "Matthew McConaughey", role: "Cooper" },
      { name: "Anne Hathaway", role: "Brand" },
      { name: "Jessica Chastain", role: "Murph" },
      { name: "Michael Caine", role: "Professor Brand" }
    ]
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    fullDescription: "With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman has been able to keep a tight lid on crime in Gotham City. But when a vile young criminal calling himself the Joker suddenly throws the town into chaos, the caped Crusader begins to tread a fine line between heroism and vigilantism.",
    genre: "Action / Crime / Drama",
    rating: "4.9",
    duration: "2h 32m",
    releaseDate: "2008-07-18",
    poster: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDp9EXjBY0Mih6dHDbi.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/nMKdUUepfeLZ5uY7IBbn1IwrR65.jpg",
    status: "Now Playing",
    cast: [
      { name: "Christian Bale", role: "Bruce Wayne / Batman" },
      { name: "Heath Ledger", role: "Joker" },
      { name: "Aaron Eckhart", role: "Harvey Dent" },
      { name: "Gary Oldman", role: "James Gordon" }
    ]
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    fullDescription: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must redefine what it means to be a hero so he can save the people he loves most.",
    genre: "Animation / Action / Adventure",
    rating: "4.7",
    duration: "2h 20m",
    releaseDate: "2023-06-02",
    poster: "https://image.tmdb.org/t/p/w1280/8VtUvV4uH35N3L16w3QzF5Q5X8H.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/2vFufevLfbbuSLe73sw96gt969X.jpg",
    status: "Coming Soon",
    cast: [
      { name: "Shameik Moore", role: "Miles Morales" },
      { name: "Hailee Steinfeld", role: "Gwen Stacy" },
      { name: "Oscar Isaac", role: "Miguel O'Hara" }
    ]
  },
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    fullDescription: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved.",
    genre: "Action / Sci-Fi / Thriller",
    rating: "4.8",
    duration: "2h 28m",
    releaseDate: "2010-07-16",
    poster: "https://image.tmdb.org/t/p/w1280/qmY3y2PzR0Vp9D79FpWl16H3G3r.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/8ZTPR98R4G6Wp6X89V1I3xY3S8x.jpg",
    status: "Now Playing",
    cast: [
      { name: "Leonardo DiCaprio", role: "Cobb" },
      { name: "Joseph Gordon-Levitt", role: "Arthur" },
      { name: "Elliot Page", role: "Ariadne" },
      { name: "Tom Hardy", role: "Eames" }
    ]
  }
];

const theaters = [
  {
    name: "PVR: ICON, Palladium",
    location: "Lower Parel, Mumbai",
    basePrice: 350,
    screens: [
      { id: "s1", type: "IMAX 2D", rows: 10, cols: 12 },
      { id: "s2", type: "4DX", rows: 8, cols: 10 }
    ]
  },
  {
    name: "INOX: Insignia",
    location: "Nariman Point, Mumbai",
    basePrice: 550,
    screens: [
      { id: "s3", type: "LUXE", rows: 6, cols: 8 }
    ]
  },
  {
    name: "Cinepolis: VIP",
    location: "Andheri West, Mumbai",
    basePrice: 450,
    screens: [
      { id: "s4", type: "VIP", rows: 8, cols: 12 }
    ]
  },
  {
    name: "PVR Cinema: Juhu",
    location: "Juhu, Mumbai",
    basePrice: 300,
    screens: [
      { id: "s5", type: "Standard", rows: 12, cols: 15 }
    ]
  }
];

const times = ["10:30 AM", "01:45 PM", "05:00 PM", "08:15 PM", "11:30 PM"];

const seedDB = async () => {
    try {
      const uri = process.env.MONGO_URI;
      if (!uri) throw new Error('MONGO_URI is not defined in .env');
  
      await mongoose.connect(uri, {
        dbName: 'tickets'
      });
      console.log('Connected to MongoDB Atlas');
  
      await Movie.deleteMany();
      await Theater.deleteMany();
      await Showtime.deleteMany();
      console.log('Cleared existing data');
  
      const insertedMovies = await Movie.insertMany(movies);
      const insertedTheaters = await Theater.insertMany(theaters);
      console.log('Inserted Movies and Theaters');

      const showtimes = [];

      // Only create showtimes for movies that are "Now Playing"
      const liveMovies = insertedMovies.filter(m => m.status === 'Now Playing');

      insertedTheaters.forEach(theater => {
          liveMovies.forEach(movie => {
              // Assign each movie to a specific screen in the theater (alternating)
              const screenIndex = Math.floor(Math.random() * theater.screens.length);
              const screen = theater.screens[screenIndex];

              // Pick 3 random time slots for each movie at this theater
              const selectedTimes = [...times].sort(() => 0.5 - Math.random()).slice(0, 3);
              
              selectedTimes.forEach(time => {
                  showtimes.push({
                      movie: movie._id,
                      theater: theater._id,
                      startTime: time,
                      screen: screen.type
                  });
              });
          });
      });

      await Showtime.insertMany(showtimes);
      console.log(`Successfully seeded database with ${showtimes.length} showtimes`);
  
      process.exit(0);
    } catch (error) {
      console.error('Error seeding database:', error.message);
      process.exit(1);
    }
  };
  
  seedDB();
