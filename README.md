# Zwift Workout Route Matcher

An intelligent web application that matches Xert workouts with the perfect Zwift routes based on workout intensity, duration, focus, and route characteristics.

## Features

- **Smart Route Matching**: Algorithm that considers workout intensity, duration, and focus
- **Quick Workout Selection**: Pre-defined workout types for easy selection
- **Route Analysis**: Detailed information about each Zwift route
- **Match Scoring**: Each recommendation comes with a score and reasoning
- **Modern UI**: Beautiful, responsive interface built with React

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zwift-workout-route-matcher
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## How to Use

1. **Select a workout type** from the quick selection cards, or
2. **Enter custom workout details**:
   - Workout name
   - Intensity level
   - Duration
   - Workout focus
   - Description

3. **Click "Find Matching Routes"** to get recommendations

4. **Review the results**:
   - Each route comes with a match score (1-7)
   - Detailed reasoning for why the route matches
   - Route information including distance, elevation, and difficulty

## Matching Algorithm

The app uses a scoring system that considers:

- **Intensity Matching**: Low intensity workouts → Easy routes, High intensity → Hard routes
- **Duration Compatibility**: Route time estimates based on workout intensity
- **Focus Alignment**: Climbing workouts → Climbing routes, etc.
- **Terrain Suitability**: Flat routes for recovery, hilly routes for intervals

## Customization

### Adding More Routes

Edit `server/index.js` and add routes to the `zwiftRoutes` array:

```javascript
{
  id: 7,
  name: "New Route Name",
  distance: 10.5,
  elevation: 250,
  difficulty: "Medium",
  terrain: "Rolling",
  description: "Route description",
  category: "Endurance"
}
```

### Adding Workout Types

Add new workout types to the `workoutTypes` array:

```javascript
{
  name: "New Workout Type",
  intensity: "Medium",
  duration: "60-90 min",
  focus: "Specific focus area",
  targetRoutes: [1, 3, 5]
}
```

## Technology Stack

- **Frontend**: React.js with modern CSS
- **Backend**: Node.js with Express
- **Icons**: Lucide React
- **Styling**: Custom CSS with responsive design

## Future Enhancements

- Integration with Xert API for automatic workout import
- Integration with Zwift API for real-time route data
- User accounts and workout history
- Advanced filtering options
- Export functionality for workout plans
- Mobile app version

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your own Zwift training! 