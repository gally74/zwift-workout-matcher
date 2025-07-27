const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const xml2js = require('xml2js');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/xml' || file.originalname.endsWith('.zwo')) {
      cb(null, true);
    } else {
      cb(new Error('Only ZWO files are allowed'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Comprehensive Zwift routes database with all worlds
const zwiftRoutes = [
  // WATOPIA ROUTES
  {
    id: 1,
    name: "Watopia's Waistband",
    distance: 5.5,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "A flat, fast route perfect for recovery rides",
    category: "Recovery",
    world: "Watopia",
    estimatedTime: { easy: 15, medium: 12, hard: 10 },
    features: ["flat", "fast", "recovery", "beginner"],
    intensity: "low"
  },
  {
    id: 2,
    name: "Volcano Climb",
    distance: 8.2,
    elevation: 320,
    difficulty: "Hard",
    terrain: "Climbing",
    description: "Steep climb up the volcano, great for threshold work",
    category: "Climbing",
    world: "Watopia",
    estimatedTime: { easy: 25, medium: 20, hard: 15 },
    features: ["climbing", "threshold", "sustained", "challenging"],
    intensity: "high"
  },
  {
    id: 3,
    name: "Fuego Flats",
    distance: 12.8,
    elevation: 180,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Rolling hills with some punchy climbs",
    category: "Endurance",
    world: "Watopia",
    estimatedTime: { easy: 35, medium: 28, hard: 22 },
    features: ["rolling", "endurance", "varied", "moderate"],
    intensity: "medium"
  },
  {
    id: 4,
    name: "Alpe du Zwift",
    distance: 12.2,
    elevation: 1078,
    difficulty: "Very Hard",
    terrain: "Climbing",
    description: "The iconic climb, perfect for sustained threshold work",
    category: "Climbing",
    world: "Watopia",
    estimatedTime: { easy: 45, medium: 35, hard: 25 },
    features: ["climbing", "threshold", "sustained", "iconic", "challenging"],
    intensity: "very_high"
  },
  {
    id: 5,
    name: "Tempus Fugit",
    distance: 18.8,
    elevation: 95,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Long flat road, ideal for sweet spot training",
    category: "Sweet Spot",
    world: "Watopia",
    estimatedTime: { easy: 50, medium: 40, hard: 30 },
    features: ["flat", "sweet_spot", "sustained", "long"],
    intensity: "medium"
  },
  {
    id: 6,
    name: "Box Hill",
    distance: 6.8,
    elevation: 245,
    difficulty: "Medium",
    terrain: "Climbing",
    description: "Repeated climbs, great for interval training",
    category: "Intervals",
    world: "Watopia",
    estimatedTime: { easy: 20, medium: 16, hard: 12 },
    features: ["climbing", "intervals", "repeated", "moderate"],
    intensity: "high"
  },
  {
    id: 7,
    name: "Hilly Route",
    distance: 9.2,
    elevation: 420,
    difficulty: "Hard",
    terrain: "Climbing",
    description: "Hilly route with multiple climbs",
    category: "Climbing",
    world: "Watopia",
    estimatedTime: { easy: 28, medium: 22, hard: 17 },
    features: ["climbing", "hills", "varied", "challenging"],
    intensity: "high"
  },
  {
    id: 8,
    name: "Mountain Route",
    distance: 15.5,
    elevation: 850,
    difficulty: "Very Hard",
    terrain: "Climbing",
    description: "Long mountain route with sustained climbing",
    category: "Climbing",
    world: "Watopia",
    estimatedTime: { easy: 55, medium: 42, hard: 32 },
    features: ["climbing", "mountain", "sustained", "endurance"],
    intensity: "very_high"
  },
  {
    id: 9,
    name: "Flat Route",
    distance: 11.2,
    elevation: 65,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Flat route for steady state training",
    category: "Endurance",
    world: "Watopia",
    estimatedTime: { easy: 30, medium: 24, hard: 18 },
    features: ["flat", "steady", "endurance", "beginner"],
    intensity: "low"
  },
  {
    id: 10,
    name: "Rolling Hills",
    distance: 13.8,
    elevation: 320,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Rolling hills with varied terrain",
    category: "Endurance",
    world: "Watopia",
    estimatedTime: { easy: 38, medium: 30, hard: 23 },
    features: ["rolling", "hills", "varied", "moderate"],
    intensity: "medium"
  },

  // LONDON ROUTES
  {
    id: 11,
    name: "London Loop",
    distance: 8.5,
    elevation: 120,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Scenic London route with minimal elevation",
    category: "Recovery",
    world: "London",
    estimatedTime: { easy: 22, medium: 18, hard: 14 },
    features: ["flat", "scenic", "recovery", "urban"],
    intensity: "low"
  },
  {
    id: 12,
    name: "London Classique",
    distance: 11.2,
    elevation: 180,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Classic London route with some hills",
    category: "Endurance",
    world: "London",
    estimatedTime: { easy: 30, medium: 24, hard: 18 },
    features: ["rolling", "classic", "urban", "moderate"],
    intensity: "medium"
  },
  {
    id: 13,
    name: "London 8",
    distance: 8.0,
    elevation: 95,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Fast 8-mile route through London",
    category: "Recovery",
    world: "London",
    estimatedTime: { easy: 21, medium: 17, hard: 13 },
    features: ["flat", "fast", "urban", "beginner"],
    intensity: "low"
  },
  {
    id: 14,
    name: "London PRL Full",
    distance: 44.5,
    elevation: 580,
    difficulty: "Very Hard",
    terrain: "Rolling",
    description: "Full London PRL route - endurance challenge",
    category: "Endurance",
    world: "London",
    estimatedTime: { easy: 120, medium: 95, hard: 75 },
    features: ["long", "endurance", "challenging", "urban"],
    intensity: "very_high"
  },

  // RICHMOND ROUTES
  {
    id: 15,
    name: "Richmond UCI Worlds",
    distance: 10.2,
    elevation: 150,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "World Championship course with technical sections",
    category: "Racing",
    world: "Richmond",
    estimatedTime: { easy: 28, medium: 22, hard: 17 },
    features: ["racing", "technical", "rolling", "championship"],
    intensity: "medium"
  },
  {
    id: 16,
    name: "Richmond Flat",
    distance: 7.8,
    elevation: 85,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Flat Richmond route for steady training",
    category: "Recovery",
    world: "Richmond",
    estimatedTime: { easy: 20, medium: 16, hard: 12 },
    features: ["flat", "steady", "recovery", "beginner"],
    intensity: "low"
  },
  {
    id: 17,
    name: "Richmond Hilly",
    distance: 12.5,
    elevation: 280,
    difficulty: "Hard",
    terrain: "Climbing",
    description: "Hilly Richmond route with challenging climbs",
    category: "Climbing",
    world: "Richmond",
    estimatedTime: { easy: 35, medium: 28, hard: 21 },
    features: ["climbing", "hills", "challenging", "varied"],
    intensity: "high"
  },

  // INNSBRUCK ROUTES
  {
    id: 18,
    name: "Innsbruck KOM",
    distance: 7.8,
    elevation: 380,
    difficulty: "Hard",
    terrain: "Climbing",
    description: "Steep climb through the Austrian mountains",
    category: "Climbing",
    world: "Innsbruck",
    estimatedTime: { easy: 25, medium: 20, hard: 15 },
    features: ["climbing", "mountain", "steep", "austrian"],
    intensity: "high"
  },
  {
    id: 19,
    name: "Innsbruckring",
    distance: 6.8,
    elevation: 120,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Flat circuit around Innsbruck",
    category: "Recovery",
    world: "Innsbruck",
    estimatedTime: { easy: 18, medium: 14, hard: 11 },
    features: ["flat", "circuit", "recovery", "austrian"],
    intensity: "low"
  },
  {
    id: 20,
    name: "Innsbruck UCI Worlds",
    distance: 15.8,
    elevation: 580,
    difficulty: "Very Hard",
    terrain: "Climbing",
    description: "World Championship course with major climbs",
    category: "Climbing",
    world: "Innsbruck",
    estimatedTime: { easy: 45, medium: 35, hard: 27 },
    features: ["climbing", "championship", "challenging", "mountain"],
    intensity: "very_high"
  },

  // YORKSHIRE ROUTES
  {
    id: 21,
    name: "Yorkshire",
    distance: 15.3,
    elevation: 280,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Rolling Yorkshire countryside with punchy climbs",
    category: "Endurance",
    world: "Yorkshire",
    estimatedTime: { easy: 42, medium: 33, hard: 25 },
    features: ["rolling", "countryside", "endurance", "punchy"],
    intensity: "medium"
  },
  {
    id: 22,
    name: "Yorkshire 2014 UCI Worlds Course",
    distance: 12.8,
    elevation: 220,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "2014 World Championship course",
    category: "Racing",
    world: "Yorkshire",
    estimatedTime: { easy: 35, medium: 28, hard: 21 },
    features: ["racing", "championship", "rolling", "moderate"],
    intensity: "medium"
  },

  // NEW YORK ROUTES
  {
    id: 23,
    name: "New York",
    distance: 9.8,
    elevation: 180,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Rolling route through New York",
    category: "Endurance",
    world: "New York",
    estimatedTime: { easy: 26, medium: 21, hard: 16 },
    features: ["rolling", "urban", "endurance", "moderate"],
    intensity: "medium"
  },
  {
    id: 24,
    name: "New York KOM After Party",
    distance: 6.2,
    elevation: 120,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Flat route after the KOM",
    category: "Recovery",
    world: "New York",
    estimatedTime: { easy: 16, medium: 13, hard: 10 },
    features: ["flat", "recovery", "urban", "beginner"],
    intensity: "low"
  },
  {
    id: 25,
    name: "New York KOM",
    distance: 8.8,
    elevation: 320,
    difficulty: "Hard",
    terrain: "Climbing",
    description: "Challenging climb in New York",
    category: "Climbing",
    world: "New York",
    estimatedTime: { easy: 24, medium: 19, hard: 14 },
    features: ["climbing", "challenging", "urban", "steep"],
    intensity: "high"
  },

  // FRANCE ROUTES
  {
    id: 26,
    name: "France",
    distance: 11.2,
    elevation: 220,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Rolling French countryside",
    category: "Endurance",
    world: "France",
    estimatedTime: { easy: 30, medium: 24, hard: 18 },
    features: ["rolling", "countryside", "endurance", "moderate"],
    intensity: "medium"
  },
  {
    id: 27,
    name: "France Petit Boucle",
    distance: 15.8,
    elevation: 380,
    difficulty: "Hard",
    terrain: "Climbing",
    description: "Small loop with climbing sections",
    category: "Climbing",
    world: "France",
    estimatedTime: { easy: 42, medium: 33, hard: 25 },
    features: ["climbing", "loop", "challenging", "varied"],
    intensity: "high"
  },
  {
    id: 28,
    name: "France Casse-Pattes",
    distance: 8.5,
    elevation: 180,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Leg-breaking route with varied terrain",
    category: "Endurance",
    world: "France",
    estimatedTime: { easy: 23, medium: 18, hard: 14 },
    features: ["rolling", "varied", "challenging", "moderate"],
    intensity: "medium"
  },

  // ITALY ROUTES
  {
    id: 29,
    name: "Italy",
    distance: 10.8,
    elevation: 240,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Rolling Italian countryside",
    category: "Endurance",
    world: "Italy",
    estimatedTime: { easy: 29, medium: 23, hard: 17 },
    features: ["rolling", "countryside", "endurance", "moderate"],
    intensity: "medium"
  },
  {
    id: 30,
    name: "Italy Road to Sky",
    distance: 17.2,
    elevation: 1080,
    difficulty: "Very Hard",
    terrain: "Climbing",
    description: "Epic climb to the sky",
    category: "Climbing",
    world: "Italy",
    estimatedTime: { easy: 55, medium: 42, hard: 32 },
    features: ["climbing", "epic", "mountain", "challenging"],
    intensity: "very_high"
  },
  {
    id: 31,
    name: "Italy R.G.V.",
    distance: 12.8,
    elevation: 320,
    difficulty: "Hard",
    terrain: "Climbing",
    description: "Rolling route with climbing sections",
    category: "Climbing",
    world: "Italy",
    estimatedTime: { easy: 35, medium: 28, hard: 21 },
    features: ["climbing", "rolling", "varied", "challenging"],
    intensity: "high"
  },

  // SCOTLAND ROUTES
  {
    id: 32,
    name: "Scotland",
    distance: 11.5,
    elevation: 260,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Rolling Scottish countryside",
    category: "Endurance",
    world: "Scotland",
    estimatedTime: { easy: 31, medium: 25, hard: 19 },
    features: ["rolling", "countryside", "endurance", "moderate"],
    intensity: "medium"
  },
  {
    id: 33,
    name: "Scotland The Muckle Yin",
    distance: 18.8,
    elevation: 480,
    difficulty: "Hard",
    terrain: "Climbing",
    description: "The big one - challenging Scottish route",
    category: "Climbing",
    world: "Scotland",
    estimatedTime: { easy: 50, medium: 40, hard: 30 },
    features: ["climbing", "challenging", "long", "varied"],
    intensity: "high"
  },

  // MAKURI ISLANDS ROUTES
  {
    id: 34,
    name: "Makuri Islands",
    distance: 9.2,
    elevation: 160,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Flat route through the islands",
    category: "Recovery",
    world: "Makuri Islands",
    estimatedTime: { easy: 24, medium: 19, hard: 14 },
    features: ["flat", "islands", "recovery", "beginner"],
    intensity: "low"
  },
  {
    id: 35,
    name: "Makuri Islands Neokyo All-Nighter",
    distance: 13.5,
    elevation: 220,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Night ride through Neokyo",
    category: "Endurance",
    world: "Makuri Islands",
    estimatedTime: { easy: 36, medium: 29, hard: 22 },
    features: ["rolling", "night", "urban", "moderate"],
    intensity: "medium"
  },
  {
    id: 36,
    name: "Makuri Islands Neokyo Crit City",
    distance: 6.8,
    elevation: 85,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Fast criterium circuit",
    category: "Racing",
    world: "Makuri Islands",
    estimatedTime: { easy: 18, medium: 14, hard: 11 },
    features: ["flat", "crit", "fast", "racing"],
    intensity: "medium"
  },
  {
    id: 37,
    name: "Makuri Islands Neokyo Downtown Titans",
    distance: 8.5,
    elevation: 140,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Downtown route with some hills",
    category: "Endurance",
    world: "Makuri Islands",
    estimatedTime: { easy: 22, medium: 18, hard: 14 },
    features: ["rolling", "urban", "downtown", "moderate"],
    intensity: "medium"
  },
  {
    id: 38,
    name: "Makuri Islands Neokyo Express",
    distance: 7.2,
    elevation: 95,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Express route through Neokyo",
    category: "Recovery",
    world: "Makuri Islands",
    estimatedTime: { easy: 19, medium: 15, hard: 11 },
    features: ["flat", "express", "urban", "beginner"],
    intensity: "low"
  },
  {
    id: 39,
    name: "Makuri Islands Neokyo Hammer",
    distance: 10.8,
    elevation: 180,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Hammer route with varied terrain",
    category: "Endurance",
    world: "Makuri Islands",
    estimatedTime: { easy: 29, medium: 23, hard: 17 },
    features: ["rolling", "hammer", "varied", "moderate"],
    intensity: "medium"
  },
  {
    id: 40,
    name: "Makuri Islands Neokyo Kom",
    distance: 9.5,
    elevation: 320,
    difficulty: "Hard",
    terrain: "Climbing",
    description: "King of the Mountain route",
    category: "Climbing",
    world: "Makuri Islands",
    estimatedTime: { easy: 25, medium: 20, hard: 15 },
    features: ["climbing", "kom", "challenging", "urban"],
    intensity: "high"
  },
  {
    id: 41,
    name: "Makuri Islands Neokyo Sleepless City",
    distance: 12.2,
    elevation: 200,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Sleepless city night ride",
    category: "Endurance",
    world: "Makuri Islands",
    estimatedTime: { easy: 32, medium: 26, hard: 20 },
    features: ["rolling", "night", "urban", "moderate"],
    intensity: "medium"
  },
  {
    id: 42,
    name: "Makuri Islands Neokyo Suki",
    distance: 8.8,
    elevation: 120,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Suki route through the city",
    category: "Recovery",
    world: "Makuri Islands",
    estimatedTime: { easy: 23, medium: 18, hard: 14 },
    features: ["flat", "suki", "urban", "beginner"],
    intensity: "low"
  },
  {
    id: 43,
    name: "Makuri Islands Neokyo Tick Tock",
    distance: 11.5,
    elevation: 160,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Tick tock route with time pressure",
    category: "Endurance",
    world: "Makuri Islands",
    estimatedTime: { easy: 30, medium: 24, hard: 18 },
    features: ["rolling", "tick_tock", "urban", "moderate"],
    intensity: "medium"
  },
  {
    id: 44,
    name: "Makuri Islands Neokyo Yume",
    distance: 7.8,
    elevation: 100,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Dream route through the city",
    category: "Recovery",
    world: "Makuri Islands",
    estimatedTime: { easy: 20, medium: 16, hard: 12 },
    features: ["flat", "yume", "urban", "beginner"],
    intensity: "low"
  },
  {
    id: 45,
    name: "Makuri Islands Neokyo Zin",
    distance: 9.8,
    elevation: 140,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Zin route with some elevation",
    category: "Endurance",
    world: "Makuri Islands",
    estimatedTime: { easy: 26, medium: 21, hard: 16 },
    features: ["rolling", "zin", "urban", "moderate"],
    intensity: "medium"
  },

  // PARIS ROUTES
  {
    id: 46,
    name: "Paris",
    distance: 10.5,
    elevation: 180,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Rolling route through Paris",
    category: "Endurance",
    world: "Paris",
    estimatedTime: { easy: 28, medium: 22, hard: 17 },
    features: ["rolling", "paris", "urban", "moderate"],
    intensity: "medium"
  },
  {
    id: 47,
    name: "Paris Champs-Élysées",
    distance: 6.8,
    elevation: 95,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Famous Champs-Élysées circuit",
    category: "Racing",
    world: "Paris",
    estimatedTime: { easy: 18, medium: 14, hard: 11 },
    features: ["flat", "champs", "racing", "famous"],
    intensity: "medium"
  },
  {
    id: 48,
    name: "Paris Champs-Élysées Laps",
    distance: 6.8,
    elevation: 95,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Multiple laps of Champs-Élysées",
    category: "Racing",
    world: "Paris",
    estimatedTime: { easy: 18, medium: 14, hard: 11 },
    features: ["flat", "laps", "racing", "repeated"],
    intensity: "medium"
  },

  // BOLOGNA ROUTES
  {
    id: 49,
    name: "Bologna",
    distance: 11.2,
    elevation: 240,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Rolling route through Bologna",
    category: "Endurance",
    world: "Bologna",
    estimatedTime: { easy: 30, medium: 24, hard: 18 },
    features: ["rolling", "bologna", "urban", "moderate"],
    intensity: "medium"
  },
  {
    id: 50,
    name: "Bologna Time Trial",
    distance: 12.8,
    elevation: 180,
    difficulty: "Medium",
    terrain: "Rolling",
    description: "Time trial route through Bologna",
    category: "Racing",
    world: "Bologna",
    estimatedTime: { easy: 34, medium: 27, hard: 20 },
    features: ["rolling", "tt", "racing", "moderate"],
    intensity: "high"
  },

  // CRIT CITY ROUTES
  {
    id: 51,
    name: "Crit City",
    distance: 4.0,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Fast criterium circuit",
    category: "Racing",
    world: "Crit City",
    estimatedTime: { easy: 10, medium: 8, hard: 6 },
    features: ["flat", "crit", "fast", "racing"],
    intensity: "medium"
  },
  {
    id: 52,
    name: "Crit City Bell Lap",
    distance: 4.0,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Bell lap criterium",
    category: "Racing",
    world: "Crit City",
    estimatedTime: { easy: 10, medium: 8, hard: 6 },
    features: ["flat", "crit", "bell_lap", "racing"],
    intensity: "medium"
  },
  {
    id: 53,
    name: "Crit City Classique",
    distance: 4.0,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Classic criterium",
    category: "Racing",
    world: "Crit City",
    estimatedTime: { easy: 10, medium: 8, hard: 6 },
    features: ["flat", "crit", "classic", "racing"],
    intensity: "medium"
  },
  {
    id: 54,
    name: "Crit City Downtown Dolphin",
    distance: 4.0,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Downtown dolphin criterium",
    category: "Racing",
    world: "Crit City",
    estimatedTime: { easy: 10, medium: 8, hard: 6 },
    features: ["flat", "crit", "downtown", "racing"],
    intensity: "medium"
  },
  {
    id: 55,
    name: "Crit City Downtown Titans",
    distance: 4.0,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Downtown titans criterium",
    category: "Racing",
    world: "Crit City",
    estimatedTime: { easy: 10, medium: 8, hard: 6 },
    features: ["flat", "crit", "downtown", "racing"],
    intensity: "medium"
  },
  {
    id: 56,
    name: "Crit City Express",
    distance: 4.0,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Express criterium",
    category: "Racing",
    world: "Crit City",
    estimatedTime: { easy: 10, medium: 8, hard: 6 },
    features: ["flat", "crit", "express", "racing"],
    intensity: "medium"
  },
  {
    id: 57,
    name: "Crit City Hammer",
    distance: 4.0,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Hammer criterium",
    category: "Racing",
    world: "Crit City",
    estimatedTime: { easy: 10, medium: 8, hard: 6 },
    features: ["flat", "crit", "hammer", "racing"],
    intensity: "medium"
  },
  {
    id: 58,
    name: "Crit City Sleepless City",
    distance: 4.0,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Sleepless city criterium",
    category: "Racing",
    world: "Crit City",
    estimatedTime: { easy: 10, medium: 8, hard: 6 },
    features: ["flat", "crit", "night", "racing"],
    intensity: "medium"
  },
  {
    id: 59,
    name: "Crit City Tick Tock",
    distance: 4.0,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Tick tock criterium",
    category: "Racing",
    world: "Crit City",
    estimatedTime: { easy: 10, medium: 8, hard: 6 },
    features: ["flat", "crit", "tick_tock", "racing"],
    intensity: "medium"
  },
  {
    id: 60,
    name: "Crit City Yume",
    distance: 4.0,
    elevation: 45,
    difficulty: "Easy",
    terrain: "Flat",
    description: "Dream criterium",
    category: "Racing",
    world: "Crit City",
    estimatedTime: { easy: 10, medium: 8, hard: 6 },
    features: ["flat", "crit", "yume", "racing"],
    intensity: "medium"
  }
];

// ZWO file parser
function parseZwoFile(xmlContent) {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    
    parser.parseString(xmlContent, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const workout = result.workout;
        const workoutData = {
          name: workout.name?.[0] || 'Unknown Workout',
          description: workout.description?.[0] || '',
          sportType: workout.sportType?.[0] || 'Bike',
          totalDuration: 0,
          intervals: [],
          intensity: 'medium',
          focus: '',
          features: []
        };

        // Parse intervals
        if (workout.workout && workout.workout[0] && workout.workout[0].workoutstep) {
          const steps = workout.workout[0].workoutstep;
          let totalDuration = 0;
          let maxIntensity = 0;
          let intervals = [];
          let features = [];

          steps.forEach((step, index) => {
            const stepData = step.$ || {};
            const duration = parseInt(stepData.Duration) || 0;
            const power = parseFloat(stepData.Power) || 0;
            const intensityPercent = power / 100;

            totalDuration += duration;

            if (intensityPercent > maxIntensity) {
              maxIntensity = intensityPercent;
            }

            intervals.push({
              duration: duration,
              power: power,
              intensity: intensityPercent,
              type: getIntervalType(intensityPercent, duration)
            });

            // Analyze interval characteristics
            if (intensityPercent > 0.9) {
              features.push('vo2_max');
            } else if (intensityPercent > 0.75) {
              features.push('threshold');
            } else if (intensityPercent > 0.6) {
              features.push('sweet_spot');
            } else if (intensityPercent < 0.5) {
              features.push('recovery');
            }

            // Detect interval patterns
            if (duration < 300 && intensityPercent > 0.8) {
              features.push('short_intervals');
            } else if (duration > 600 && intensityPercent > 0.7) {
              features.push('long_intervals');
            }
          });

          workoutData.totalDuration = totalDuration;
          workoutData.intervals = intervals;
          workoutData.intensity = getIntensityLevel(maxIntensity);
          workoutData.features = [...new Set(features)]; // Remove duplicates
          workoutData.focus = determineWorkoutFocus(intervals);
        }

        resolve(workoutData);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function getIntervalType(intensity, duration) {
  if (intensity > 0.9) return 'VO2 Max';
  if (intensity > 0.75) return 'Threshold';
  if (intensity > 0.6) return 'Sweet Spot';
  if (intensity > 0.4) return 'Endurance';
  return 'Recovery';
}

function getIntensityLevel(maxIntensity) {
  if (maxIntensity > 0.9) return 'very_high';
  if (maxIntensity > 0.75) return 'high';
  if (maxIntensity > 0.6) return 'medium';
  return 'low';
}

function determineWorkoutFocus(intervals) {
  const types = intervals.map(i => i.type);
  const typeCounts = {};
  
  types.forEach(type => {
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const dominantType = Object.keys(typeCounts).reduce((a, b) => 
    typeCounts[a] > typeCounts[b] ? a : b
  );

  return dominantType;
}

// AI-powered route matching
function aiMatchWorkoutToRoutes(workoutData) {
  const matches = [];
  
  zwiftRoutes.forEach(route => {
    let score = 0;
    let reasons = [];
    let aiAnalysis = {};

    // 1. Intensity Matching (30% weight)
    const intensityScore = matchIntensity(workoutData.intensity, route.intensity);
    score += intensityScore.score * 0.3;
    reasons.push(...intensityScore.reasons);

    // 2. Duration Compatibility (25% weight)
    const durationScore = matchDuration(workoutData.totalDuration, route);
    score += durationScore.score * 0.25;
    reasons.push(...durationScore.reasons);

    // 3. Feature Matching (25% weight)
    const featureScore = matchFeatures(workoutData.features, route.features);
    score += featureScore.score * 0.25;
    reasons.push(...featureScore.reasons);

    // 4. Workout Focus Alignment (20% weight)
    const focusScore = matchFocus(workoutData.focus, route.category);
    score += focusScore.score * 0.2;
    reasons.push(...focusScore.reasons);

    if (score > 0) {
      matches.push({
        route: route,
        score: Math.round(score * 100) / 100,
        reasons: reasons,
        estimatedTime: estimateRouteTime(route, workoutData.intensity),
        aiAnalysis: {
          intensityMatch: intensityScore.score,
          durationMatch: durationScore.score,
          featureMatch: featureScore.score,
          focusMatch: focusScore.score
        }
      });
    }
  });

  return matches.sort((a, b) => b.score - a.score).slice(0, 5);
}

function matchIntensity(workoutIntensity, routeIntensity) {
  const intensityMap = { low: 1, medium: 2, high: 3, very_high: 4 };
  const workoutLevel = intensityMap[workoutIntensity] || 2;
  const routeLevel = intensityMap[routeIntensity] || 2;
  
  const difference = Math.abs(workoutLevel - routeLevel);
  let score = 0;
  let reasons = [];

  if (difference === 0) {
    score = 1.0;
    reasons.push('Perfect intensity match');
  } else if (difference === 1) {
    score = 0.7;
    reasons.push('Good intensity compatibility');
  } else if (difference === 2) {
    score = 0.3;
    reasons.push('Moderate intensity match');
  } else {
    score = 0.1;
    reasons.push('Intensity mismatch');
  }

  return { score, reasons };
}

function matchDuration(workoutDuration, route) {
  const routeTime = route.estimatedTime.medium; // Use medium pace as baseline
  const timeDiff = Math.abs(workoutDuration / 60 - routeTime);
  let score = 0;
  let reasons = [];

  if (timeDiff <= 5) {
    score = 1.0;
    reasons.push('Perfect duration match');
  } else if (timeDiff <= 10) {
    score = 0.8;
    reasons.push('Good duration compatibility');
  } else if (timeDiff <= 15) {
    score = 0.5;
    reasons.push('Moderate duration match');
  } else {
    score = 0.2;
    reasons.push('Duration mismatch');
  }

  return { score, reasons };
}

function matchFeatures(workoutFeatures, routeFeatures) {
  if (!workoutFeatures.length || !routeFeatures.length) {
    return { score: 0.5, reasons: ['Limited feature data for matching'] };
  }

  const commonFeatures = workoutFeatures.filter(f => routeFeatures.includes(f));
  const score = commonFeatures.length / Math.max(workoutFeatures.length, routeFeatures.length);
  let reasons = [];

  if (score > 0.7) {
    reasons.push('Excellent feature alignment');
  } else if (score > 0.4) {
    reasons.push('Good feature compatibility');
  } else if (score > 0.2) {
    reasons.push('Some feature overlap');
  } else {
    reasons.push('Limited feature compatibility');
  }

  if (commonFeatures.length > 0) {
    reasons.push(`Shared features: ${commonFeatures.join(', ')}`);
  }

  return { score, reasons };
}

function matchFocus(workoutFocus, routeCategory) {
  const focusMap = {
    'Recovery': ['Recovery'],
    'Endurance': ['Endurance', 'Sweet Spot'],
    'Sweet Spot': ['Sweet Spot', 'Endurance'],
    'Threshold': ['Climbing', 'Sweet Spot'],
    'VO2 Max': ['Climbing', 'Intervals']
  };

  const compatibleCategories = focusMap[workoutFocus] || [];
  const score = compatibleCategories.includes(routeCategory) ? 1.0 : 0.3;
  const reasons = score > 0.7 ? 
    [`Workout focus (${workoutFocus}) matches route category (${routeCategory})`] :
    [`Workout focus (${workoutFocus}) differs from route category (${routeCategory})`];

  return { score, reasons };
}

function estimateRouteTime(route, intensity) {
  const intensityMap = { low: 'easy', medium: 'medium', high: 'hard', very_high: 'hard' };
  const pace = intensityMap[intensity] || 'medium';
  return route.estimatedTime[pace];
}

function generateAIReasoning(workoutData, matches) {
  if (matches.length === 0) {
    return "No suitable routes found for this workout type.";
  }

  const topMatch = matches[0];
  const analysis = topMatch.aiAnalysis;
  
  return `AI Analysis: ${topMatch.route.name} scored ${topMatch.score}/1.0. 
    Intensity match: ${Math.round(analysis.intensityMatch * 100)}%, 
    Duration match: ${Math.round(analysis.durationMatch * 100)}%, 
    Feature match: ${Math.round(analysis.featureMatch * 100)}%, 
    Focus match: ${Math.round(analysis.focusMatch * 100)}%. 
    ${topMatch.reasons.slice(0, 3).join('. ')}`;
}

// Routes
app.get('/api/routes', (req, res) => {
  res.json(zwiftRoutes);
});

app.post('/api/upload-zwo', upload.single('zwoFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const xmlContent = fs.readFileSync(req.file.path, 'utf8');
    const workoutData = await parseZwoFile(xmlContent);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    const matches = aiMatchWorkoutToRoutes(workoutData);
    const reasoning = generateAIReasoning(workoutData, matches);
    
    res.json({
      workout: workoutData,
      matches: matches,
      reasoning: reasoning
    });
  } catch (error) {
    console.error('Error processing ZWO file:', error);
    res.status(500).json({ error: 'Error processing ZWO file: ' + error.message });
  }
});

app.post('/api/match-workout', (req, res) => {
  const { workoutData } = req.body;
  const matches = aiMatchWorkoutToRoutes(workoutData);
  const reasoning = generateAIReasoning(workoutData, matches);
  
  res.json({
    workout: workoutData,
    matches: matches,
    reasoning: reasoning
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 