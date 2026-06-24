# TaskUs — React + Spring Boot Todo App

Full-stack todo application with JWT authentication.

## Project Structure

```
taskus-react/
├── frontend/          ← React JS (port 3000)
└── backend/           ← Spring Boot (port 8080)
```

---

## Backend Setup (Spring Boot)

### Prerequisites
- Java 17+
- eSQL running locally

### 1. Create SQL Database
```sql
CREATE DATABASE todo_app_db;
```

### 2. Update application.properties
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/todo_app_db
spring.datasource.username=sql
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### 3. Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```
Backend will start on **http://localhost:8080**

---

## Frontend Setup (React)

### Prerequisites
- Node.js 18+

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start the App
```bash
npm start
```
Frontend will open at **http://localhost:3000**

> The `proxy` field in `package.json` automatically proxies `/api` requests to `http://localhost:8080`, so no extra env setup needed for local development.

---

## API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Todos (Requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos?completed=true` | Filter by status |
| POST | `/api/todos` | Create todo |
| PATCH | `/api/todos/{id}` | Update todo |
| PATCH | `/api/todos/{id}/toggle` | Toggle completion |
| DELETE | `/api/todos/{id}` | Delete todo |
| GET | `/api/todos/count` | Get total count |

---

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios, Context API
- **Backend**: Spring Boot 4, Spring Security, JWT (JJWT 0.12.3), JPA/Hibernate, SQL, Lombok

---

## Production Deployment
Set environment variable on backend:
```
FRONTEND_URL=https://your-react-app.com
```
