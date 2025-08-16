# JWT Authentication System

This frontend application now includes a complete JWT authentication system that integrates with your Spring Boot backend.

## Features

- **Login Page** (`/login`) - User authentication
- **Signup Page** (`/signup`) - User registration with optional admin role
- **Protected Routes** - Todo app is only accessible after login
- **Automatic Token Management** - JWT tokens are automatically included in API requests
- **Token Expiration Handling** - Automatic logout on token expiration (1 hour)
- **Admin Support** - Admin users can see and manage all todos
- **Responsive Design** - Modern UI that works on all devices

## Backend API Endpoints Required

Your Spring Boot backend should have these endpoints:

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/signup
```

### Todo Endpoints (Protected)
```
GET /api/todos
GET /api/todos/{id}
POST /api/todos
PUT /api/todos/{id}
DELETE /api/todos/{id}
```

## API Request Format

### Login Request
```json
{
  "username": "alice",
  "password": "secret"
}
```

### Login Response
```json
{
  "token": "JWT..."
}
```

### Signup Request
```json
{
  "username": "alice",
  "password": "secret",
  "admin": false
}
```

### Signup Response
```json
{
  "token": "JWT..."
}
```

### Todo Structure
```json
{
  "id": 1,
  "title": "Buy milk",
  "completed": false
}
```

## How It Works

1. **Token Storage**: JWT tokens are stored in `localStorage` as `jwt_token`
2. **Automatic Headers**: All API requests automatically include the `Authorization: Bearer {token}` header
3. **Token Expiration**: If a request returns 401, the user is automatically logged out and redirected to login
4. **Protected Routes**: The todo app is wrapped in `ProtectedRoute` component that checks authentication
5. **Admin Roles**: Admin users get special privileges and can see all todos

## File Structure

```
src/
├── components/
│   ├── Login.js          # Login form component
│   ├── Signup.js         # Signup form component with admin option
│   ├── Header.js         # Header with user info, admin badge, and logout
│   ├── ProtectedRoute.js # Route protection component
│   ├── TodoList.js       # Todo list with CRUD operations
│   ├── Auth.css          # Authentication styles
│   └── Header.css        # Header styles
├── services/
│   ├── authService.js    # Authentication logic and API calls
│   └── todoService.js    # Updated todo API calls with auth
└── App.js                # Main app with routing
```

## Usage

1. **Start the app**: `npm start`
2. **Visit**: `http://localhost:3000`
3. **You'll be redirected to**: `/login` if not authenticated
4. **After login**: You'll be redirected to the todo app
5. **All API calls**: Automatically include your JWT token

## Security Features

- **Token Validation**: Every request validates the JWT token
- **Automatic Logout**: On token expiration or invalid token (1 hour expiry)
- **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
- **Route Protection**: Unauthenticated users can't access protected routes
- **Role-Based Access**: Admin users get special privileges

## Admin Functionality

- **Admin Signup**: Optional checkbox during signup to create admin users
- **Admin Badge**: Crown icon (👑) displayed in header for admin users
- **Extended Access**: Admin users can see and manage all todos in the system
- **Role Management**: Backend automatically assigns USER and ADMIN roles

## Customization

### Change API URLs
Update the `API_URL` constants in:
- `src/services/authService.js` (line 3)
- `src/services/todoService.js` (line 3)

### Modify Token Storage
The token storage logic is in `src/services/authService.js`. You can modify:
- Storage method (localStorage, sessionStorage, cookies)
- Token key names
- Expiration handling

### Update UI Styles
Modify the CSS files:
- `src/components/Auth.css` - Login/Signup styling
- `src/components/Header.css` - Header styling
- `src/App.css` - Main app layout

## Testing

1. **Start your Spring Boot backend** on port 8080
2. **Start the React app**: `npm start`
3. **Create a new account** at `/signup` (with or without admin privileges)
4. **Login** with your credentials
5. **Verify** that todo operations work with authentication
6. **Test admin features** by creating an admin account

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from `http://localhost:3000`
2. **401 Errors**: Check that your JWT token is valid and not expired (1 hour)
3. **Routing Issues**: Make sure `react-router-dom` is properly installed
4. **404 Errors**: May indicate access denied (masked as not found)

### Backend Requirements

Your Spring Boot backend should:
- Have JWT authentication configured with 1-hour expiry
- Accept `Authorization: Bearer {token}` headers
- Return proper error responses (401 for unauthorized, 404 for not found/access denied)
- Have CORS configured for your frontend domain
- Support admin roles (USER and ADMIN)

## Production Considerations

- **HTTPS**: Use HTTPS in production
- **Token Storage**: Consider httpOnly cookies instead of localStorage
- **Token Refresh**: Implement refresh token mechanism for longer sessions
- **Error Handling**: Add more sophisticated error handling
- **Loading States**: Add loading indicators for better UX
- **Admin Security**: Consider additional admin authentication for production 