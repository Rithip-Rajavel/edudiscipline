# EduDiscipline - Student Disciplinary Management System

A comprehensive React Native application designed to help educational institutions track, manage, and resolve student behavioral issues. The app provides a centralized platform for administrators and teachers to document incidents and for parents to receive real-time updates.

## Features

### Core Functionality
- **Incident Recording**: Digital form to log details of disciplinary incidents including student ID, type of infraction, location, and severity
- **Automatic Notifications**: Real-time push notifications or SMS alerts sent to parents immediately after an incident is logged
- **Behavioral Tracking**: System to accumulate student demerits over time for identifying high-risk behavioral patterns
- **Role-Based Access**: Different access levels for Admin/Disciplinary Board, Teachers/Faculty, and Student/Parent portals
- **Analytics & Reporting**: Dashboard featuring heat mapping of incidents and performance reports for data-driven decisions

### Key Modules
- **Authentication**: Secure login system with role-based access control
- **Dashboard**: Overview with statistics and recent activities
- **Incident Management**: Create, view, update, and delete incident reports
- **Student Management**: Search, view, and manage student profiles
- **Achievement Tracking**: Record and track positive student achievements
- **Analytics**: Comprehensive reporting and data visualization

## Technical Stack

### Framework & Libraries
- **React Native**: Cross-platform mobile development
- **React Navigation**: Navigation and routing
- **React Native Paper**: Material Design UI components
- **Axios**: HTTP client for API communication
- **React Native Vector Icons**: Icon library
- **React Native Element Dropdown**: Custom dropdown components
- **React Native Date Picker**: Date selection component
- **Async Storage**: Local data persistence

### Backend Integration
- **RESTful API**: Full CRUD operations for all entities
- **JWT Authentication**: Secure token-based authentication
- **Real-time Updates**: Push notifications for immediate alerts

## Project Structure

```
src/
├── api/          # Network calls and API endpoints
├── assets/       # Icons and branding images
├── components/   # Reusable UI elements
├── constants/    # Theme colors, text strings, screen names
├── context/      # React Context for state management
├── navigation/   # Stack/Tab navigators
├── screens/      # Full-screen views
│   ├── auth/      # Authentication screens
│   ├── main/      # Dashboard and main screens
│   ├── incidents/ # Incident management
│   ├── students/  # Student management
│   ├── achievements/ # Achievement tracking
│   ├── profile/   # User profile
│   └── analytics/ # Analytics and reporting
├── types/        # TypeScript type definitions
└── utils/        # Helper functions and utilities
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Metro bundler

### Installation

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd edudiscipline
   ```

2. **Install dependencies**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **iOS Setup (if developing for iOS)**
   ```sh
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

### Running the Application

1. **Start Metro bundler**
   ```sh
   npm start
   # or
   yarn start
   ```

2. **Run on Android**
   ```sh
   npm run android
   # or
   yarn android
   ```

3. **Run on iOS**
   ```sh
   npm run ios
   # or
   yarn ios
   ```

## API Configuration

The app connects to a backend API. Update the API base URL in `src/constants/index.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:8080'; // Development
// export const API_BASE_URL = 'https://api.edudiscipline.com'; // Production
```

## Key Features in Detail

### Incident Management
- **Quick Incident**: Fast reporting using student identifier (roll number, ID card, or mobile)
- **Detailed Incident**: Comprehensive form with all incident details
- **Incident Types**: Late Arrival, Misconduct, Absence, Violation, Warning, Other
- **Severity Levels**: Low, Medium, High, Critical
- **Search & Filter**: Advanced search and filtering capabilities

### Student Management
- **Student Profiles**: Complete student information with disciplinary history
- **Risk Assessment**: Automatic risk level calculation based on incident history
- **Performance Metrics**: Balance between incidents and achievements
- **Department-wise Views**: Filter and view students by department

### Analytics Dashboard
- **Incident Trends**: Visual representation of incident patterns over time
- **Department Statistics**: Comparative analysis across departments
- **Risk Identification**: Top risk students and intervention points
- **Export Reports**: Generate and export analytical reports

## Authentication & Security

- **Multi-factor Authentication**: Secure login process
- **Role-based Access Control**: Different permissions for different user types
- **Token Management**: JWT-based authentication with automatic refresh
- **Secure Storage**: Encrypted local storage for sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the EduDiscipline team at support@edudiscipline.com.

---

**Built with ❤️ for educational institutions**
