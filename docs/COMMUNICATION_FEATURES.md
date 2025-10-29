# Direct Communication Features - Citizen & City Hall

This document describes the direct communication and incident reporting features implemented in the Iluminara app.

## Overview

The app now provides a comprehensive communication channel between citizens and city hall officials, enabling real-time status updates and two-way messaging on reported incidents.

## Features Implemented

### 1. **Real-Time Incident Reporting System**

Citizens can create detailed incident reports with:
- Problem type selection (Pothole, Streetlight, Garbage, Traffic Sign, Sidewalk, Other)
- Detailed descriptions
- Photo attachments
- GPS location data
- Address information

**Location**: `app/report/*` screens

### 2. **Direct Communication Channel**

#### For Citizens:
- **View Report Status**: Real-time status tracking (Open, In Progress, Resolved, Rejected)
- **Read Comments**: View responses from City Hall officials
- **Vote on Reports**: Support important issues with voting
- **Track Progress**: See when status changes occur

#### For City Hall Officials:
- **Add Comments**: Send direct messages to citizens about their reports
- **Update Status**: Change report status to keep citizens informed
  - Mark as "In Progress" when work begins
  - Mark as "Resolved" when issue is fixed
  - Mark as "Rejected" if issue cannot be addressed
- **View Report Details**: Access all information submitted by citizens

**Location**: `app/reports/[id].tsx`

### 3. **Report Details Screen Features**

The enhanced report details screen includes:

#### Information Display
- Report type and current status badge
- Creation timestamp with relative time
- Full description
- Photo gallery (if available)
- Location details with coordinates
- Statistics (votes, views, comments)

#### Communication Section
- **Comments Display**: Shows all messages between citizen and city hall
  - Author name and role badges
  - Timestamp for each comment
  - Visual distinction for city hall vs citizen messages
- **Empty State**: Helpful message when no comments exist
- **Scroll Support**: Full scrollable comment history

#### City Hall Controls (When logged in as CITY_HALL role)
- **Status Update Buttons**:
  - In Progress (blue)
  - Resolved (green)
  - Rejected (red)
  - Visual feedback for current status
- **Comment Input**: 
  - Text input field for new messages
  - Character limit (500 chars)
  - Send button with loading state
  - Keyboard-aware scrolling

#### Citizen Actions
- **Vote Button**: Support reports with a single tap
  - Real-time vote count update
  - Loading state during API call
  - Success/error feedback
- **Pull to Refresh**: Swipe down to get latest updates
- **View on Map**: Integration with map view (existing feature)

### 4. **Real-Time Updates**

All features are connected to the backend API:
- **Voting**: `POST /reports/:id/vote`
- **Comments**: `POST /reports/:id/comments`
- **Status Updates**: `PATCH /reports/:id/status`
- **Report Details**: `GET /reports/:id`

The app automatically refreshes data after:
- Adding a new comment
- Updating report status
- Voting on a report
- Manual pull-to-refresh

## User Experience

### Citizen Flow
1. Create a report with photos and location
2. View report in list or map
3. Open report details to see status
4. Read comments from city hall
5. Vote to support the issue
6. Receive updates as status changes

### City Hall Flow
1. View all reports in their jurisdiction
2. Open report to see details
3. Add comment to communicate with citizen
4. Update status to reflect progress
5. Mark as resolved when fixed

## Technical Implementation

### State Management
- Uses `useReports` hook for all report operations
- Uses `useAuth` hook for user role detection
- Local state for UI interactions (voting, commenting, status updates)

### API Integration
- All features use the existing `ApiService.ts`
- Proper error handling with user-friendly alerts
- Loading states for better UX

### UI Components
- Responsive layouts for different screen sizes
- Keyboard-aware input for comments
- Pull-to-refresh for manual updates
- Empty states for better UX
- Role-based UI rendering (City Hall vs Citizen)

### Styling
- Consistent color scheme with app theme
- Visual badges for user roles
- Status color coding (Orange=Open, Blue=In Progress, Green=Resolved, Red=Rejected)
- Accessible touch targets
- Clear visual hierarchy

## Future Enhancements

Potential improvements:
- [ ] Real-time push notifications for status changes
- [ ] Photo attachments in comments
- [ ] Reply threads for comments
- [ ] Comment editing/deletion
- [ ] Report sharing to social media
- [ ] In-app notifications center
- [ ] Email notifications for status updates
- [ ] Advanced filtering in reports list
- [ ] Analytics dashboard for city hall

## Testing

To test the communication features:

### As Citizen:
1. Create a test account with role "CITIZEN"
2. Submit a new report
3. View the report details
4. Vote on the report
5. Check for comments from city hall
6. Pull to refresh to see updates

### As City Hall:
1. Create a test account with role "CITY_HALL"
2. View existing reports
3. Open a report details
4. Add a comment to the citizen
5. Update the report status
6. Verify changes are reflected immediately

### Test Scenarios:
- Empty comments state
- Adding first comment
- Multiple comments
- Status transitions
- Voting functionality
- Pull to refresh
- Error handling (network errors, invalid data)
- Keyboard behavior on comment input

## API Endpoints Used

All endpoints are documented in `docs/api/api-integration.md`:

- `GET /reports` - List all reports with filters
- `GET /reports/:id` - Get single report details
- `POST /reports/:id/vote` - Vote on a report
- `POST /reports/:id/comments` - Add comment (City Hall only)
- `PATCH /reports/:id/status` - Update status (City Hall only)

## Code Location

Main implementation:
- Report Details Screen: `app/reports/[id].tsx`
- API Service: `services/ApiService.ts`
- Reports Hook: `hooks/useReports.ts`
- Auth Hook: `hooks/useAuth.ts`
- API Types: `constants/Api.ts`

## Related Documentation

- [API Integration Guide](./api/api-integration.md)
- [API Examples](./api/examples.md)
- [Build Guide](../BUILD_GUIDE.md)
- [Environment Configuration](./ENVIRONMENT.md)
