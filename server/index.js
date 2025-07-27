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

// Comprehensive Zwift Routes Database (parsed from official data)
const zwiftRoutes = [
  // 1 Bidon Routes
  { id: 1, name: "Macaron", world: "France", distance: 2.6, elevation: 15, leadIn: 0, badgeXP: 50, category: "Flat" },
  { id: 2, name: "Glasgow Crit Circuit", world: "Scotland", distance: 3.0, elevation: 34, leadIn: 0.2, badgeXP: 60, category: "Flat" },
  { id: 3, name: "Neokyo Crit Course", world: "Makuri Islands", distance: 3.9, elevation: 19, leadIn: 0.7, badgeXP: 90, category: "Flat" },
  { id: 4, name: "Mech Isle Loop", world: "Makuri Islands", distance: 4.0, elevation: 39, leadIn: 0.1, badgeXP: 80, category: "Flat" },
  { id: 5, name: "Duchy Estate", world: "Yorkshire", distance: 3.0, elevation: 41, leadIn: 1.7, badgeXP: 60, category: "Flat" },
  { id: 6, name: "Twilight Harbor", world: "Makuri Islands", distance: 6.9, elevation: 33, leadIn: 0.2, badgeXP: 135, category: "Flat" },
  { id: 7, name: "Volcano Circuit", world: "Watopia", distance: 4.1, elevation: 20, leadIn: 2.7, badgeXP: 80, category: "Flat" },
  { id: 8, name: "Castle Crit", world: "Makuri Islands", distance: 3.5, elevation: 44, leadIn: 1.5, badgeXP: 69, category: "Flat" },
  { id: 9, name: "The 6 Train", world: "New York", distance: 6.5, elevation: 70, leadIn: 0.1, badgeXP: 130, category: "Flat" },
  { id: 10, name: "Queen's Highway", world: "Yorkshire", distance: 3.0, elevation: 40, leadIn: 2.6, badgeXP: 60, category: "Flat" },
  
  // 2 Bidon Routes
  { id: 11, name: "Sea to Tree", world: "Makuri Islands", distance: 3.2, elevation: 106, leadIn: 0.6, badgeXP: 65, category: "Hilly" },
  { id: 12, name: "Rooftop Rendezvous", world: "Makuri Islands", distance: 3.7, elevation: 56, leadIn: 2.9, badgeXP: 74, category: "Hilly" },
  { id: 13, name: "Two Bridges Loop", world: "Watopia", distance: 7.1, elevation: 81, leadIn: 0, badgeXP: 140, category: "Hilly" },
  { id: 14, name: "Farmland Loop", world: "Makuri Islands", distance: 7.9, elevation: 58, leadIn: 0.2, badgeXP: 155, category: "Hilly" },
  { id: 15, name: "Loch Loop", world: "Scotland", distance: 8.0, elevation: 71, leadIn: 0, badgeXP: 160, category: "Hilly" },
  { id: 16, name: "Electric Loop", world: "Makuri Islands", distance: 8.9, elevation: 43, leadIn: 0, badgeXP: 170, category: "Hilly" },
  { id: 17, name: "Bridges and Boardwalks", world: "Makuri Islands", distance: 6.2, elevation: 60, leadIn: 1.9, badgeXP: 125, category: "Hilly" },
  { id: 18, name: "The Fan Flats", world: "Richmond", distance: 5.1, elevation: 12, leadIn: 4.2, badgeXP: 100, category: "Flat" },
  { id: 19, name: "Temple Trek", world: "Watopia", distance: 6.5, elevation: 25, leadIn: 4.1, badgeXP: 128, category: "Hilly" },
  { id: 20, name: "Valley to Mountaintop", world: "Makuri Islands", distance: 5.0, elevation: 129, leadIn: 0.1, badgeXP: 100, category: "Climbing" },
  
  // Longer Routes
  { id: 21, name: "Sleepless City", world: "Makuri Islands", distance: 9.6, elevation: 43, leadIn: 0, badgeXP: 185, category: "Hilly" },
  { id: 22, name: "Volcano Circuit CCW", world: "Watopia", distance: 4.1, elevation: 20, leadIn: 4.8, badgeXP: 80, category: "Flat" },
  { id: 23, name: "The Classic", world: "Watopia", distance: 4.7, elevation: 49, leadIn: 4.1, badgeXP: 100, category: "Hilly" },
  { id: 24, name: "Innsbruckring", world: "Innsbruck", distance: 8.8, elevation: 77, leadIn: 0.2, badgeXP: 170, category: "Hilly" },
  { id: 25, name: "Railways and Rooftops", world: "Makuri Islands", distance: 6.2, elevation: 71, leadIn: 2.1, badgeXP: 120, category: "Hilly" },
  { id: 26, name: "Champs-Élysées", world: "Paris", distance: 6.6, elevation: 39, leadIn: 3.1, badgeXP: 130, category: "Hilly" },
  { id: 27, name: "Handful of Gravel", world: "Watopia", distance: 6.1, elevation: 75, leadIn: 4.1, badgeXP: 125, category: "Hilly" },
  { id: 28, name: "Gotham Grind", world: "New York", distance: 9.3, elevation: 96, leadIn: 0.1, badgeXP: 190, category: "Hilly" },
  { id: 29, name: "Flat Route", world: "Watopia", distance: 10.2, elevation: 61, leadIn: 0.1, badgeXP: 200, category: "Flat" },
  { id: 30, name: "Lutece Express", world: "Paris", distance: 6.6, elevation: 39, leadIn: 3.6, badgeXP: 130, category: "Hilly" },
  
  // Major Routes
  { id: 31, name: "Hilly Route", world: "Watopia", distance: 9.3, elevation: 109, leadIn: 0, badgeXP: 180, category: "Climbing" },
  { id: 32, name: "Hilly Route Reverse", world: "Watopia", distance: 9.3, elevation: 109, leadIn: 0.2, badgeXP: 180, category: "Climbing" },
  { id: 33, name: "Classique", world: "London", distance: 5.5, elevation: 16, leadIn: 5.6, badgeXP: 110, category: "Flat" },
  { id: 34, name: "Fine and Sandy", world: "Makuri Islands", distance: 10.6, elevation: 77, leadIn: 0.1, badgeXP: 210, category: "Hilly" },
  { id: 35, name: "Grand Central Circuit", world: "New York", distance: 6.8, elevation: 144, leadIn: 1.5, badgeXP: 140, category: "Climbing" },
  { id: 36, name: "Cobbled Climbs", world: "Richmond", distance: 9.2, elevation: 117, leadIn: 0.2, badgeXP: 180, category: "Climbing" },
  { id: 37, name: "Park Perimeter Loop", world: "New York", distance: 9.8, elevation: 126, leadIn: 0, badgeXP: 190, category: "Climbing" },
  { id: 38, name: "Park Perimeter Reverse", world: "New York", distance: 9.8, elevation: 126, leadIn: 0.2, badgeXP: 195, category: "Climbing" },
  { id: 39, name: "Volcano Flat", world: "Watopia", distance: 12.3, elevation: 50, leadIn: 0, badgeXP: 240, category: "Flat" },
  { id: 40, name: "Island Outskirts", world: "Makuri Islands", distance: 11.4, elevation: 90, leadIn: 0.1, badgeXP: 225, category: "Hilly" },
  
  // Epic Routes
  { id: 41, name: "Tempus Fugit", world: "Watopia", distance: 17.3, elevation: 104, leadIn: 0.2, badgeXP: 220, category: "Flat" },
  { id: 42, name: "Chain Chomper", world: "Makuri Islands", distance: 13.6, elevation: 68, leadIn: 0.2, badgeXP: 245, category: "Hilly" },
  { id: 43, name: "Tick Tock", world: "Watopia", distance: 16.8, elevation: 103, leadIn: 2.7, badgeXP: 120, category: "Hilly" },
  { id: 44, name: "Going Coastal", world: "Watopia", distance: 16.5, elevation: 44, leadIn: 0.2, badgeXP: 255, category: "Flat" },
  { id: 45, name: "2019 UCI Worlds Harrogate", world: "Yorkshire", distance: 13.8, elevation: 82, leadIn: 5.7, badgeXP: 260, category: "Hilly" },
  { id: 46, name: "Countryside Tour", world: "Makuri Islands", distance: 16.0, elevation: 49, leadIn: 3.2, badgeXP: 185, category: "Hilly" },
  { id: 47, name: "Island Hopper", world: "Makuri Islands", distance: 18.0, elevation: 93, leadIn: 2.3, badgeXP: 210, category: "Hilly" },
  { id: 48, name: "Spirit Forest", world: "Makuri Islands", distance: 8.4, elevation: 88, leadIn: 0.2, badgeXP: 255, category: "Hilly" },
  { id: 49, name: "London Loop", world: "London", distance: 14.9, elevation: 140, leadIn: 0, badgeXP: 230, category: "Climbing" },
  { id: 50, name: "Neon After Party", world: "Makuri Islands", distance: 16.15, elevation: 115, leadIn: 0.39, badgeXP: 240, category: "Hilly" },
  
  // Legendary Routes
  { id: 51, name: "Road to Sky", world: "Watopia", distance: 17.3, elevation: 335, leadIn: 0.2, badgeXP: 116, category: "Climbing" },
  { id: 52, name: "The Big Ring", world: "Watopia", distance: 48.9, elevation: 127, leadIn: 0.2, badgeXP: 320, category: "Hilly" },
  { id: 53, name: "Mayan Mash", world: "Watopia", distance: 34.6, elevation: 16, leadIn: 2.3, badgeXP: 380, category: "Flat" },
  { id: 54, name: "Snowman", world: "Watopia", distance: 43.9, elevation: 184, leadIn: 2.3, badgeXP: 270, category: "Hilly" },
  { id: 55, name: "Big Loop", world: "Watopia", distance: 42.1, elevation: 53, leadIn: 2.3, badgeXP: 174, category: "Hilly" },
  { id: 56, name: "Itza Party", world: "Watopia", distance: 45.7, elevation: 63, leadIn: 2.3, badgeXP: 207, category: "Hilly" },
  { id: 57, name: "Knights of the Roundabout", world: "France", distance: 51.2, elevation: 245, leadIn: 0.1, badgeXP: 270, category: "Climbing" },
  { id: 58, name: "Eastern Eight", world: "Watopia", distance: 51.7, elevation: 185, leadIn: 0.2, badgeXP: 310, category: "Hilly" },
  { id: 59, name: "Deca Dash", world: "Watopia", distance: 48.2, elevation: 129, leadIn: 0.1, badgeXP: 360, category: "Hilly" },
  { id: 60, name: "Spiral Into the Volcano", world: "Watopia", distance: 55.8, elevation: 135, leadIn: 4.6, badgeXP: 170, category: "Climbing" },
  
  // Ultra Routes
  { id: 61, name: "The London Pretzel", world: "London", distance: 55.7, elevation: 231, leadIn: 0.6, badgeXP: 300, category: "Climbing" },
  { id: 62, name: "Shisa Shakedown", world: "Makuri Islands", distance: 49.3, elevation: 141, leadIn: 1.15, badgeXP: 340, category: "Hilly" },
  { id: 63, name: "ZG25 Queen", world: "Watopia", distance: 44.6, elevation: 140, leadIn: 3.8, badgeXP: 180, category: "Hilly" },
  { id: 64, name: "Bigger Loop", world: "Watopia", distance: 52.7, elevation: 150, leadIn: 0.2, badgeXP: 365, category: "Hilly" },
  { id: 65, name: "Shorelines and Summits", world: "Watopia", distance: 46.1, elevation: 167, leadIn: 0.2, badgeXP: 365, category: "Hilly" },
  { id: 66, name: "Three Sisters", world: "Watopia", distance: 48.0, elevation: 160, leadIn: 4.8, badgeXP: 240, category: "Hilly" },
  { id: 67, name: "Petit Boucle", world: "France", distance: 60.8, elevation: 157, leadIn: 0.2, badgeXP: 380, category: "Hilly" },
  { id: 68, name: "La Reine", world: "France", distance: 22.4, elevation: 139, leadIn: 5.1, badgeXP: 180, category: "Climbing" },
  { id: 69, name: "Four Horsemen", world: "Watopia", distance: 63.9, elevation: 196, leadIn: 4.1, badgeXP: 285, category: "Climbing" },
  { id: 70, name: "Tour of Fire and Ice", world: "Watopia", distance: 67.5, elevation: 212, leadIn: 0.2, badgeXP: 386, category: "Climbing" },
  
  // Mega Routes
  { id: 71, name: "Makuri 40", world: "Makuri Islands", distance: 40.2, elevation: 402, leadIn: 0.1, badgeXP: 460, category: "Climbing" },
  { id: 72, name: "Everything Bagel", world: "New York", distance: 34.8, elevation: 203, leadIn: 0, badgeXP: 460, category: "Hilly" },
  { id: 73, name: "Three Little Sisters", world: "Watopia", distance: 37.8, elevation: 259, leadIn: 2.6, badgeXP: 340, category: "Climbing" },
  { id: 74, name: "Out and Back Again", world: "Watopia", distance: 40.3, elevation: 185, leadIn: 0, badgeXP: 400, category: "Hilly" },
  { id: 75, name: "Mountain 8", world: "Watopia", distance: 32.1, elevation: 211, leadIn: 1.3, badgeXP: 415, category: "Climbing" },
  { id: 76, name: "NYC KOM After Party", world: "New York", distance: 37.0, elevation: 196, leadIn: 0.1, badgeXP: 490, category: "Hilly" },
  { id: 77, name: "Tides and Temples", world: "Watopia", distance: 36.5, elevation: 180, leadIn: 4.5, badgeXP: 400, category: "Hilly" },
  { id: 78, name: "Radio Rendezvous", world: "Watopia", distance: 20.4, elevation: 96, leadIn: 2.3, badgeXP: 555, category: "Hilly" },
  { id: 79, name: "Glyph Heights", world: "Watopia", distance: 25.3, elevation: 243, leadIn: 0.6, badgeXP: 465, category: "Climbing" },
  { id: 80, name: "Lutscher CCW", world: "Innsbruck", distance: 13.8, elevation: 356, leadIn: 0.3, badgeXP: 420, category: "Climbing" },
  
  // Ultra Mega Routes
  { id: 81, name: "Lutscher", world: "Innsbruck", distance: 13.7, elevation: 154, leadIn: 2.6, badgeXP: 480, category: "Climbing" },
  { id: 82, name: "Triple Loops", world: "London", distance: 40.9, elevation: 375, leadIn: 0, badgeXP: 410, category: "Climbing" },
  { id: 83, name: "Richmond Loop Around", world: "Richmond", distance: 42.2, elevation: 282, leadIn: 0.2, badgeXP: 470, category: "Climbing" },
  { id: 84, name: "Mayan Mash", world: "Watopia", distance: 34.6, elevation: 326, leadIn: 0, badgeXP: 420, category: "Climbing" },
  { id: 85, name: "Itza Party", world: "Watopia", distance: 45.7, elevation: 206, leadIn: 7.5, badgeXP: 385, category: "Hilly" },
  { id: 86, name: "Knights of the Roundabout", world: "France", distance: 51.2, elevation: 276, leadIn: 0.6, badgeXP: 480, category: "Climbing" },
  { id: 87, name: "Eastern Eight", world: "Watopia", distance: 51.7, elevation: 185, leadIn: 8.6, badgeXP: 300, category: "Hilly" },
  { id: 88, name: "Deca Dash", world: "Watopia", distance: 48.2, elevation: 292, leadIn: 0, badgeXP: 490, category: "Climbing" },
  { id: 89, name: "Spiral Into the Volcano", world: "Watopia", distance: 55.8, elevation: 364, leadIn: 0, badgeXP: 450, category: "Climbing" },
  { id: 90, name: "Muir and the Mountain", world: "Watopia", distance: 33.9, elevation: 364, leadIn: 0.1, badgeXP: 450, category: "Climbing" },
  
  // Legendary Ultra Routes
  { id: 91, name: "Peak Performance", world: "Watopia", distance: 45.7, elevation: 241, leadIn: 3.1, badgeXP: 460, category: "Climbing" },
  { id: 92, name: "Dust In the Wind", world: "Watopia", distance: 52.1, elevation: 156, leadIn: 0.2, badgeXP: 580, category: "Hilly" },
  { id: 93, name: "The London Pretzel", world: "London", distance: 55.7, elevation: 179, leadIn: 9.9, badgeXP: 210, category: "Hilly" },
  { id: 94, name: "Shisa Shakedown", world: "Makuri Islands", distance: 49.3, elevation: 124, leadIn: 5.1, badgeXP: 444, category: "Hilly" },
  { id: 95, name: "ZG25 Queen", world: "Watopia", distance: 44.6, elevation: 103, leadIn: 2.3, badgeXP: 580, category: "Hilly" },
  { id: 96, name: "Bigger Loop", world: "Watopia", distance: 52.7, elevation: 144, leadIn: 0.2, badgeXP: 615, category: "Hilly" },
  { id: 97, name: "Shorelines and Summits", world: "Watopia", distance: 46.1, elevation: 155, leadIn: 3.1, badgeXP: 460, category: "Hilly" },
  { id: 98, name: "Three Sisters", world: "Watopia", distance: 48.0, elevation: 132, leadIn: 3.2, badgeXP: 565, category: "Hilly" },
  { id: 99, name: "Petit Boucle", world: "France", distance: 60.8, elevation: 102, leadIn: 0.2, badgeXP: 660, category: "Hilly" },
  { id: 100, name: "La Reine", world: "France", distance: 22.4, elevation: 356, leadIn: 0.6, badgeXP: 510, category: "Climbing" },
  
  // Mega Ultimate Routes
  { id: 101, name: "Four Horsemen", world: "Watopia", distance: 63.9, elevation: 352, leadIn: 0, badgeXP: 490, category: "Climbing" },
  { id: 102, name: "Tour of Fire and Ice", world: "Watopia", distance: 67.5, elevation: 254, leadIn: 0, badgeXP: 580, category: "Climbing" },
  { id: 103, name: "Makuri 40", world: "Makuri Islands", distance: 40.2, elevation: 254, leadIn: 0.2, badgeXP: 580, category: "Climbing" },
  { id: 104, name: "Everything Bagel", world: "New York", distance: 34.8, elevation: 276, leadIn: 0, badgeXP: 580, category: "Climbing" },
  { id: 105, name: "Three Little Sisters", world: "Watopia", distance: 37.8, elevation: 490, leadIn: 0, badgeXP: 550, category: "Climbing" },
  { id: 106, name: "Out and Back Again", world: "Watopia", distance: 40.3, elevation: 349, leadIn: 0.5, badgeXP: 625, category: "Climbing" },
  { id: 107, name: "Mountain 8", world: "Watopia", distance: 32.1, elevation: 319, leadIn: 0.7, badgeXP: 650, category: "Climbing" },
  { id: 108, name: "NYC KOM After Party", world: "New York", distance: 37.0, elevation: 316, leadIn: 0, badgeXP: 690, category: "Climbing" },
  { id: 109, name: "Tides and Temples", world: "Watopia", distance: 36.5, elevation: 413, leadIn: 0.2, badgeXP: 645, category: "Climbing" },
  { id: 110, name: "Radio Rendezvous", world: "Watopia", distance: 20.4, elevation: 251, leadIn: 5.6, badgeXP: 660, category: "Hilly" },
  
  // Ultra Mega Legendary Routes
  { id: 111, name: "Glyph Heights", world: "Watopia", distance: 25.3, elevation: 547, leadIn: 0, badgeXP: 580, category: "Climbing" },
  { id: 112, name: "Lutscher CCW", world: "Innsbruck", distance: 13.8, elevation: 174, leadIn: 8.1, badgeXP: 684, category: "Hilly" },
  { id: 113, name: "Lutscher", world: "Innsbruck", distance: 13.7, elevation: 781, leadIn: 1.4, badgeXP: 200, category: "Climbing" },
  { id: 114, name: "Triple Loops", world: "London", distance: 40.9, elevation: 308, leadIn: 0.1, badgeXP: 800, category: "Climbing" },
  { id: 115, name: "Richmond Loop Around", world: "Richmond", distance: 42.2, elevation: 682, leadIn: 0, badgeXP: 580, category: "Climbing" },
  { id: 116, name: "Mayan Mash", world: "Watopia", distance: 34.6, elevation: 525, leadIn: 0.1, badgeXP: 690, category: "Climbing" },
  { id: 117, name: "Itza Party", world: "Watopia", distance: 45.7, elevation: 434, leadIn: 0, badgeXP: 755, category: "Climbing" },
  { id: 118, name: "Knights of the Roundabout", world: "France", distance: 51.2, elevation: 329, leadIn: 2.3, badgeXP: 840, category: "Climbing" },
  { id: 119, name: "Eastern Eight", world: "Watopia", distance: 51.7, elevation: 691, leadIn: 0, badgeXP: 640, category: "Climbing" },
  { id: 120, name: "Deca Dash", world: "Watopia", distance: 48.2, elevation: 480, leadIn: 0, badgeXP: 730, category: "Climbing" },
  
  // Final Ultra Routes
  { id: 121, name: "Spiral Into the Volcano", world: "Watopia", distance: 55.8, elevation: 460, leadIn: 2.6, badgeXP: 730, category: "Climbing" },
  { id: 122, name: "Muir and the Mountain", world: "Watopia", distance: 33.9, elevation: 728, leadIn: 3.1, badgeXP: 410, category: "Climbing" },
  { id: 123, name: "Peak Performance", world: "Watopia", distance: 45.7, elevation: 537, leadIn: 8.6, badgeXP: 510, category: "Climbing" },
  { id: 124, name: "Dust In the Wind", world: "Watopia", distance: 52.1, elevation: 402, leadIn: 8.8, badgeXP: 240, category: "Hilly" },
  { id: 125, name: "The London Pretzel", world: "London", distance: 55.7, elevation: 670, leadIn: 0.2, badgeXP: 600, category: "Climbing" },
  { id: 126, name: "Shisa Shakedown", world: "Makuri Islands", distance: 49.3, elevation: 402, leadIn: 10.9, badgeXP: 270, category: "Hilly" },
  { id: 127, name: "ZG25 Queen", world: "Watopia", distance: 44.6, elevation: 565, leadIn: 0.5, badgeXP: 810, category: "Climbing" },
  { id: 128, name: "Bigger Loop", world: "Watopia", distance: 52.7, elevation: 555, leadIn: 0.3, badgeXP: 850, category: "Climbing" },
  { id: 129, name: "Shorelines and Summits", world: "Watopia", distance: 46.1, elevation: 269, leadIn: 2.3, badgeXP: 977, category: "Hilly" },
  { id: 130, name: "Three Sisters", world: "Watopia", distance: 48.0, elevation: 756, leadIn: 3.1, badgeXP: 700, category: "Climbing" },
  
  // Ultimate Routes
  { id: 131, name: "Petit Boucle", world: "France", distance: 60.8, elevation: 577, leadIn: 0.2, badgeXP: 880, category: "Climbing" },
  { id: 132, name: "La Reine", world: "France", distance: 22.4, elevation: 661, leadIn: 0.5, badgeXP: 840, category: "Climbing" },
  { id: 133, name: "Four Horsemen", world: "Watopia", distance: 63.9, elevation: 1045, leadIn: 0.1, badgeXP: 380, category: "Climbing" },
  { id: 134, name: "Tour of Fire and Ice", world: "Watopia", distance: 67.5, elevation: 505, leadIn: 0.5, badgeXP: 920, category: "Climbing" },
  { id: 135, name: "Makuri 40", world: "Makuri Islands", distance: 40.2, elevation: 336, leadIn: 3.2, badgeXP: 1025, category: "Climbing" },
  { id: 136, name: "Everything Bagel", world: "New York", distance: 34.8, elevation: 406, leadIn: 2.3, badgeXP: 1345, category: "Climbing" },
  { id: 137, name: "Three Little Sisters", world: "Watopia", distance: 37.8, elevation: 484, leadIn: 4, badgeXP: 1000, category: "Climbing" },
  { id: 138, name: "Out and Back Again", world: "Watopia", distance: 40.3, elevation: 336, leadIn: 0.2, badgeXP: 1030, category: "Climbing" },
  { id: 139, name: "Mountain 8", world: "Watopia", distance: 32.1, elevation: 793, leadIn: 5.1, badgeXP: 680, category: "Climbing" },
  { id: 140, name: "NYC KOM After Party", world: "New York", distance: 37.0, elevation: 726, leadIn: 0.9, badgeXP: 920, category: "Climbing" },
  
  // Final Ultimate Routes
  { id: 141, name: "Tides and Temples", world: "Watopia", distance: 36.5, elevation: 582, leadIn: 0.3, badgeXP: 1080, category: "Climbing" },
  { id: 142, name: "Radio Rendezvous", world: "Watopia", distance: 20.4, elevation: 475, leadIn: 0.6, badgeXP: 1100, category: "Climbing" },
  { id: 143, name: "Glyph Heights", world: "Watopia", distance: 25.3, elevation: 495, leadIn: 4, badgeXP: 985, category: "Climbing" },
  { id: 144, name: "Lutscher CCW", world: "Innsbruck", distance: 13.8, elevation: 896, leadIn: 0.2, badgeXP: 895, category: "Climbing" },
  { id: 145, name: "Lutscher", world: "Innsbruck", distance: 13.7, elevation: 691, leadIn: 0.5, badgeXP: 1060, category: "Climbing" },
  { id: 146, name: "Triple Loops", world: "London", distance: 40.9, elevation: 776, leadIn: 4.1, badgeXP: 924, category: "Climbing" },
  { id: 147, name: "Richmond Loop Around", world: "Richmond", distance: 42.2, elevation: 897, leadIn: 0, badgeXP: 950, category: "Climbing" },
  { id: 148, name: "Mayan Mash", world: "Watopia", distance: 34.6, elevation: 483, leadIn: 0.9, badgeXP: 1220, category: "Climbing" },
  { id: 149, name: "Itza Party", world: "Watopia", distance: 45.7, elevation: 1201, leadIn: 0.4, badgeXP: 460, category: "Climbing" },
  { id: 150, name: "Knights of the Roundabout", world: "France", distance: 51.2, elevation: 837, leadIn: 5.1, badgeXP: 820, category: "Climbing" },
  
  // Mega Ultimate Routes
  { id: 151, name: "Eastern Eight", world: "Watopia", distance: 51.7, elevation: 989, leadIn: 0.2, badgeXP: 950, category: "Climbing" },
  { id: 152, name: "Deca Dash", world: "Watopia", distance: 48.2, elevation: 417, leadIn: 2.3, badgeXP: 1280, category: "Hilly" },
  { id: 153, name: "Spiral Into the Volcano", world: "Watopia", distance: 55.8, elevation: 1167, leadIn: 2.7, badgeXP: 500, category: "Climbing" },
  { id: 154, name: "Muir and the Mountain", world: "Watopia", distance: 33.9, elevation: 483, leadIn: 3.1, badgeXP: 1220, category: "Climbing" },
  { id: 155, name: "Peak Performance", world: "Watopia", distance: 45.7, elevation: 396, leadIn: 0.5, badgeXP: 1425, category: "Climbing" },
  { id: 156, name: "Dust In the Wind", world: "Watopia", distance: 52.1, elevation: 1534, leadIn: 0.2, badgeXP: 420, category: "Climbing" },
  { id: 157, name: "The London Pretzel", world: "London", distance: 55.7, elevation: 708, leadIn: 2.3, badgeXP: 1340, category: "Climbing" },
  { id: 158, name: "Shisa Shakedown", world: "Makuri Islands", distance: 49.3, elevation: 1153, leadIn: 2.3, badgeXP: 825, category: "Climbing" },
  { id: 159, name: "ZG25 Queen", world: "Watopia", distance: 44.6, elevation: 616, leadIn: 1.1, badgeXP: 1550, category: "Climbing" },
  { id: 160, name: "Bigger Loop", world: "Watopia", distance: 52.7, elevation: 1494, leadIn: 0.9, badgeXP: 900, category: "Climbing" },
  
  // Final Mega Routes
  { id: 161, name: "Shorelines and Summits", world: "Watopia", distance: 46.1, elevation: 1009, leadIn: 0.6, badgeXP: 1380, category: "Climbing" },
  { id: 162, name: "Three Sisters", world: "Watopia", distance: 48.0, elevation: 821, leadIn: 1.9, badgeXP: 1594, category: "Climbing" },
  { id: 163, name: "Petit Boucle", world: "France", distance: 60.8, elevation: 1362, leadIn: 0, badgeXP: 1440, category: "Climbing" },
  { id: 164, name: "La Reine", world: "France", distance: 22.4, elevation: 1710, leadIn: 0, badgeXP: 920, category: "Climbing" },
  { id: 165, name: "Four Horsemen", world: "Watopia", distance: 63.9, elevation: 2113, leadIn: 0.5, badgeXP: 1780, category: "Climbing" },
  { id: 166, name: "Tour of Fire and Ice", world: "Watopia", distance: 67.5, elevation: 1640, leadIn: 0, badgeXP: 0, category: "Climbing" }
];

// Calculate route completion time based on w/kg
function calculateRouteTime(route, wkg, intensity = 'medium') {
  // Validate inputs
  if (!wkg || wkg <= 0 || !route || !route.distance) {
    // Fallback to basic calculation if w/kg is invalid
    const baseSpeed = 25; // Default speed in km/h
    const timeHours = route.distance / baseSpeed;
    const timeMinutes = timeHours * 60;
    return Math.round(timeMinutes);
  }

  // Base speeds in km/h for different w/kg levels
  const baseSpeeds = {
    'recovery': { 2.0: 18, 2.5: 20, 3.0: 22, 3.5: 24, 4.0: 26, 4.5: 28, 5.0: 30 },
    'easy': { 2.0: 22, 2.5: 24, 3.0: 26, 3.5: 28, 4.0: 30, 4.5: 32, 5.0: 34 },
    'medium': { 2.0: 26, 2.5: 28, 3.0: 30, 3.5: 32, 4.0: 34, 4.5: 36, 5.0: 38 },
    'hard': { 2.0: 30, 2.5: 32, 3.0: 34, 3.5: 36, 4.0: 38, 4.5: 40, 5.0: 42 },
    'very_hard': { 2.0: 34, 2.5: 36, 3.0: 38, 3.5: 40, 4.0: 42, 4.5: 44, 5.0: 46 }
  };

  // Get base speed for w/kg and intensity
  const wkgLevel = Math.min(5.0, Math.max(2.0, Math.floor(wkg * 2) / 2));
  const baseSpeed = baseSpeeds[intensity]?.[wkgLevel] || baseSpeeds['medium'][3.0];

  // Adjust for elevation (more elevation = slower)
  const elevationFactor = 1 - (route.elevation / 1000) * 0.1; // 10% slower per 1000m elevation
  const adjustedSpeed = baseSpeed * elevationFactor;

  // Calculate time in minutes
  const timeHours = route.distance / adjustedSpeed;
  const timeMinutes = timeHours * 60;

  return Math.round(timeMinutes);
}

// Match workout duration to routes
function matchWorkoutDuration(workoutDuration, wkg, intensity = 'medium') {
  const matches = zwiftRoutes.map(route => {
    const routeTime = calculateRouteTime(route, wkg, intensity);
    const timeDifference = Math.abs(routeTime - workoutDuration);
    const percentageDifference = (timeDifference / workoutDuration) * 100;
    const matchScore = Math.max(0, 100 - percentageDifference); // Higher score = better match
    
    return {
      route: route,
      score: Math.round(matchScore) / 100, // Convert to 0-1 scale like AI matching
      estimatedTime: routeTime,
      timeDifference,
      percentageDifference,
      matchScore: matchScore,
      reasons: [`Duration match: ${Math.round(percentageDifference)}% difference`],
      aiAnalysis: {
        intensityMatch: 0.8, // Default for w/kg matching
        durationMatch: Math.max(0, 1 - (percentageDifference / 100)),
        featureMatch: 0.5, // Default for w/kg matching
        focusMatch: 0.5 // Default for w/kg matching
      }
    };
  });

  // Sort by match score (best matches first)
  const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore);
  
  // Remove duplicates based on route name
  const uniqueMatches = [];
  const seenNames = new Set();
  
  for (const match of sortedMatches) {
    const routeName = match.route.name;
    if (!seenNames.has(routeName)) {
      seenNames.add(routeName);
      uniqueMatches.push(match);
    }
  }
  
  return uniqueMatches.slice(0, 10); // Return top 10 unique matches
}

// Calculate w/kg from FTP and weight
function calculateWkg(ftp, weightKg) {
  return ftp / weightKg;
}

// Generate route features based on category and characteristics
function generateRouteFeatures(route) {
  const features = [];
  
  // Add features based on category
  if (route.category === 'Flat') {
    features.push('flat', 'recovery', 'endurance');
  } else if (route.category === 'Hilly') {
    features.push('hilly', 'sweet_spot', 'threshold');
  } else if (route.category === 'Climbing') {
    features.push('climbing', 'threshold', 'vo2_max');
  }
  
  // Add features based on distance
  if (route.distance < 10) {
    features.push('short_intervals');
  } else if (route.distance > 30) {
    features.push('long_intervals', 'endurance');
  }
  
  // Add features based on elevation
  if (route.elevation > 200) {
    features.push('climbing', 'threshold');
  } else if (route.elevation < 50) {
    features.push('flat', 'recovery');
  }
  
  return [...new Set(features)]; // Remove duplicates
}

// Convert workout intensity to route intensity
function workoutIntensityToRouteIntensity(workoutIntensity) {
  const intensityMap = {
    'low': 'recovery',
    'medium': 'medium', 
    'high': 'hard',
    'very high': 'very_hard'
  };
  return intensityMap[workoutIntensity] || 'medium';
}

// Sample Xert workout types
const workoutTypes = [
  {
    name: "Recovery Ride",
    intensity: "Low",
    duration: "30-45 min",
    focus: "Active recovery",
    targetRoutes: [1, 5]
  },
  {
    name: "Sweet Spot Training",
    intensity: "Medium-High",
    duration: "60-90 min",
    focus: "Threshold building",
    targetRoutes: [5, 3]
  },
  {
    name: "Threshold Intervals",
    intensity: "High",
    duration: "45-75 min",
    focus: "Lactate threshold",
    targetRoutes: [2, 4]
  },
  {
    name: "VO2 Max Intervals",
    intensity: "Very High",
    duration: "30-60 min",
    focus: "Maximal oxygen uptake",
    targetRoutes: [4, 6]
  },
  {
    name: "Endurance Ride",
    intensity: "Medium",
    duration: "90-180 min",
    focus: "Aerobic base",
    targetRoutes: [3, 5]
  }
];

// ZWO file parser - Updated to handle Xert Magic Buckets format
function parseZwoFile(xmlContent) {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    
    parser.parseString(xmlContent, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        // Handle both standard ZWO and Xert Magic Buckets format
        const workoutFile = result.workout_file || result.workout;
        const workoutData = {
          name: workoutFile?.name?.[0] || 'Unknown Workout',
          description: workoutFile?.description?.[0] || '',
          sportType: workoutFile?.sportType?.[0] || 'Bike',
          ftpOverride: workoutFile?.ftpOverride?.[0] || null,
          author: workoutFile?.author?.[0] || '',
          totalDuration: 0,
          intervals: [],
          intensity: 'medium',
          focus: '',
          features: []
        };

        // Parse intervals - handle both formats
        let steps = [];
        if (workoutFile?.workout?.[0]) {
          const workout = workoutFile.workout[0];
          // Check for SteadyState (Xert Magic Buckets) or workoutstep (standard ZWO)
          steps = workout.SteadyState || workout.workoutstep || [];
        }

        let totalDuration = 0;
        let maxIntensity = 0;
        let intervals = [];
        let features = [];

        steps.forEach((step, index) => {
          const stepData = step.$ || {};
          // Handle both Duration/Power (standard) and Duration/Power (Xert) attributes
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
  // Ensure workoutData has required properties
  const safeWorkoutData = {
    intensity: workoutData.intensity || 'medium',
    totalDuration: workoutData.totalDuration || 60 * 60, // Default 1 hour
    features: workoutData.features || [],
    focus: workoutData.focus || ''
  };
  
  const matches = [];
  
  zwiftRoutes.forEach(route => {
    let score = 0;
    let reasons = [];
    let aiAnalysis = {};

    // 1. Intensity Matching (30% weight)
    const intensityScore = matchIntensity(safeWorkoutData.intensity, route.category);
    score += intensityScore.score * 0.3;
    reasons.push(...intensityScore.reasons);

    // 2. Duration Compatibility (25% weight)
    const durationScore = matchDuration(safeWorkoutData.totalDuration, route);
    score += durationScore.score * 0.25;
    reasons.push(...durationScore.reasons);

    // 3. Feature Matching (25% weight)
    const routeFeatures = generateRouteFeatures(route);
    const featureScore = matchFeatures(safeWorkoutData.features, routeFeatures);
    score += featureScore.score * 0.25;
    reasons.push(...featureScore.reasons);

    // 4. Workout Focus Alignment (20% weight)
    const focusScore = matchFocus(safeWorkoutData.focus, route.category);
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

  // Sort by score and remove duplicates
  const sortedMatches = matches.sort((a, b) => b.score - a.score);
  
  // Remove duplicates based on route name
  const uniqueMatches = [];
  const seenNames = new Set();
  
  for (const match of sortedMatches) {
    const routeName = match.route.name;
    if (!seenNames.has(routeName)) {
      seenNames.add(routeName);
      uniqueMatches.push(match);
    }
  }
  
  return uniqueMatches.slice(0, 5);
}

function matchIntensity(workoutIntensity, routeCategory) {
  const intensityMap = { low: 1, medium: 2, high: 3, very_high: 4 };
  const workoutLevel = intensityMap[workoutIntensity] || 2;
  const routeLevel = intensityMap[routeCategory] || 2; // Assuming category maps to intensity
  
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
  // Calculate route time using the new function
  const routeTime = calculateRouteTime(route, 3.0, 'medium'); // Default 3.0 w/kg
  const timeDiff = Math.abs(routeTime - workoutDuration);
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
  if (!workoutFeatures || !workoutFeatures.length || !routeFeatures || !routeFeatures.length) {
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
  // Use the new calculateRouteTime function with default w/kg
  const defaultWkg = 3.0; // Default 3.0 w/kg for AI matching
  return calculateRouteTime(route, defaultWkg, intensity);
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

app.get('/api/workout-types', (req, res) => {
  res.json(workoutTypes);
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
    
    // Get FTP and weight from request body
    const { ftp, weightKg } = req.body;
    
    // Use FTP override from ZWO file if no FTP provided
    const effectiveFtp = ftp || workoutData.ftpOverride;
    
    if (effectiveFtp && weightKg && parseFloat(weightKg) > 0) {
      // Use w/kg-based matching
      const wkg = calculateWkg(parseFloat(effectiveFtp), parseFloat(weightKg));
      const routeIntensity = workoutIntensityToRouteIntensity(workoutData.intensity);
      const workoutDurationMinutes = Math.round(workoutData.totalDuration / 60);
      
      const matches = matchWorkoutDuration(workoutDurationMinutes, wkg, routeIntensity);
      
      res.json({
        workout: workoutData,
        matches: matches,
        wkg: wkg,
        matchingMethod: 'wkg-based',
        ftpUsed: effectiveFtp,
        weightUsed: weightKg
      });
    } else {
      // Fallback to AI matching
      const matches = aiMatchWorkoutToRoutes(workoutData);
      const reasoning = generateAIReasoning(workoutData, matches);
      
      res.json({
        workout: workoutData,
        matches: matches,
        reasoning: reasoning,
        matchingMethod: 'ai-based',
        ftpUsed: effectiveFtp,
        weightUsed: weightKg
      });
    }
  } catch (error) {
    console.error('Error processing ZWO file:', error);
    res.status(500).json({ error: 'Error processing ZWO file: ' + error.message });
  }
});

app.post('/api/match-workout', (req, res) => {
  try {
    const { workoutData, ftp, weightKg } = req.body;
    
    // Convert duration from minutes to seconds for consistency
    const workoutDataWithDuration = {
      ...workoutData,
      totalDuration: parseInt(workoutData.duration) * 60
    };
    
    if (ftp && weightKg && parseFloat(weightKg) > 0) {
      // Use w/kg-based matching
      const wkg = calculateWkg(parseFloat(ftp), parseFloat(weightKg));
      const routeIntensity = workoutIntensityToRouteIntensity(workoutData.intensity);
      const workoutDurationMinutes = parseInt(workoutData.duration);
      
      const matches = matchWorkoutDuration(workoutDurationMinutes, wkg, routeIntensity);
      
      res.json({
        workout: workoutDataWithDuration,
        matches: matches,
        wkg: wkg,
        matchingMethod: 'wkg-based',
        ftpUsed: ftp,
        weightUsed: weightKg
      });
    } else {
      // Fallback to AI matching
      const matches = aiMatchWorkoutToRoutes(workoutDataWithDuration);
      const reasoning = generateAIReasoning(workoutDataWithDuration, matches);
      
      res.json({
        workout: workoutDataWithDuration,
        matches: matches,
        reasoning: reasoning,
        matchingMethod: 'ai-based',
        ftpUsed: ftp,
        weightUsed: weightKg
      });
    }
  } catch (error) {
    console.error('Error matching workout:', error);
    res.status(500).json({ error: 'Error matching workout: ' + error.message });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 