# netwrok-scanner

# Network Scanner - README

A production-grade network port scanner built with **Spring Boot 3.2**, **Java 21 Virtual Threads**, **React**, and **PostgreSQL**. Features concurrent port scanning, service identification, banner grabbing, and scheduled scans.

---

## **Features**

✅ **Concurrent Port Scanning** with Java 21 Virtual Threads  
✅ **Service Identification** via banner grabbing (HTTP, SSH, MySQL, Redis, PostgreSQL, etc.)  
✅ **Web Dashboard** with real-time scan monitoring  
✅ **Scheduled Scans** with cron expressions  
✅ **Scan History** with PostgreSQL persistence  
✅ **REST API** with Swagger documentation  
✅ **Docker Support** for easy deployment

---

## **Tech Stack**

| Component | Technology |
|-----------|------------|
| Backend | Spring Boot 3.2.1, Java 21 |
| Concurrency | Virtual Threads (Project Loom) |
| Database | PostgreSQL 16 |
| Frontend | React 18, Vite, Tailwind CSS |
| Containerization | Docker, Docker Compose |
| API Documentation | Swagger/OpenAPI 3 |

---

## **Prerequisites**

Before running locally, ensure you have:

- **Java 21** or higher ([Download](https://adoptium.net/))
- **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))
- **Node.js 18+** and **npm** ([Download](https://nodejs.org/))
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/get-started))
- **Git** ([Download](https://git-scm.com/))

### **Verify Prerequisites**

```bash
# Check Java version (must be 21+)
java -version

# Check Maven version
mvn -version

# Check Node.js version
node --version
npm --version

# Check Docker version
docker --version
docker-compose --version

# Check Git version
git --version
```

---

## **Quick Start (5 Minutes)**

### **Option 1: Using Docker (Recommended)**

```bash
# Clone the repository
git clone https://github.com/your-username/network-scanner-app.git
cd network-scanner-app

# Start all services with Docker Compose
docker-compose up --build

# Access the application:
# Frontend: http://localhost
# Backend API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
# PgAdmin: http://localhost:5050
```

**PgAdmin Login:**
- URL: `http://localhost:5050`
- Email: `admin@scanner.com`
- Password: `admin123`

**Stop services:**
```bash
docker-compose down
```

---

### **Option 2: Local Development (Manual Setup)**

Follow these steps to run without Docker:

---

## **Step-by-Step Local Setup**

### **Step 1: Clone the Repository**

```bash
# Clone the project
git clone https://github.com/your-username/network-scanner-app.git
cd network-scanner-app
```

---

### **Step 2: Start PostgreSQL Database**

#### **Option A: Using Docker (Easier)**

```bash
# Start only PostgreSQL with Docker
docker-compose up -d postgres

# Verify PostgreSQL is running
docker ps | grep postgres
```

#### **Option B: Install PostgreSQL Locally**

```bash
# macOS (using Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

**Create Database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Run these SQL commands:
CREATE DATABASE scanner_db;
CREATE USER scanner_user WITH PASSWORD 'scanner_pass';
GRANT ALL PRIVILEGES ON DATABASE scanner_db TO scanner_user;
\q
```

---

### **Step 3: Configure Backend**

```bash
cd backend

# Verify application.yml configuration
cat src/main/resources/application.yml

# Ensure database connection is correct:
# spring:
#   datasource:
#     url: jdbc:postgresql://localhost:5432/scanner_db
#     username: scanner_user
#     password: scanner_pass
```

---

### **Step 4: Build and Run Backend**

```bash
# Clean and install dependencies
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run

# You should see:
# Started NetworkScannerApplication in X.XXX seconds
# Application is running on: http://localhost:8080
```

**Keep this terminal open** - Backend is now running!

---

### **Step 5: Install Frontend Dependencies**

Open a **new terminal**:

```bash
cd network-scanner-app/frontend

# Install npm packages
npm install

# Verify installation
npm list --depth=0
```

---

### **Step 6: Run Frontend Development Server**

```bash
# Start Vite dev server
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

**Keep this terminal open** - Frontend is now running!

---

### **Step 7: Access the Application**

Open your browser and navigate to:

```
Frontend Dashboard: http://localhost:5173
Backend API: http://localhost:8080
Swagger Documentation: http://localhost:8080/swagger-ui.html
Health Check: http://localhost:8080/actuator/health
```

---

## **Running Your First Scan**

### **Via Web Dashboard**

1. Open `http://localhost:5173`
2. Click on **"New Scan"** tab
3. Enter:
   - **Target:** `127.0.0.1` (your localhost)
   - **Port Range:** `common` (scans 17 common ports)
   - **Timeout:** `2000` ms
4. Click **"Start Scan"**
5. View results in **"History"** tab

### **Via API (cURL)**

```bash
# Start a scan
curl -X POST http://localhost:8080/api/scans \
  -H "Content-Type: application/json" \
  -d '{
    "target": "127.0.0.1",
    "portRange": "common",
    "timeout": 2000
  }'

# Response:
# {
#   "jobId": 1,
#   "target": "127.0.0.1",
#   "status": "PENDING",
#   "totalPorts": 17
# }

# Check scan status (replace {jobId} with actual ID)
curl http://localhost:8080/api/scans/1

# Get scan results
curl http://localhost:8080/api/scans/1/results
```

---

## **Port Range Options**

### **1. Common Ports (Preset)**
```json
{
  "target": "127.0.0.1",
  "portRange": "common"
}
```
Scans: 21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 6379, 8080, 8443, 27017

### **2. Specific Ports**
```json
{
  "target": "192.168.1.1",
  "portRange": "80,443,8080,3306"
}
```

### **3. Port Range**
```json
{
  "target": "192.168.1.1",
  "portRange": "1-1000"
}
```

### **4. Mixed (Ports + Ranges)**
```json
{
  "target": "192.168.1.1",
  "portRange": "22,80,443,8000-8100,9000"
}
```

### **5. Full Scan (All Ports)**
```json
{
  "target": "192.168.1.1",
  "portRange": "1-65535"
}
```
⚠️ **Warning:** This scans all 65,535 ports and takes 30-60 minutes!

---

## **Database Access**

### **Option 1: PgAdmin (Web UI)**

```bash
# Start PgAdmin with Docker
docker-compose up -d pgadmin

# Access at: http://localhost:5050
# Email: admin@scanner.com
# Password: admin123
```

**Add Server Connection:**
1. Right-click **"Servers"** → **"Register"** → **"Server"**
2. **General Tab:**
   - Name: `Scanner Database`
3. **Connection Tab:**
   - Host: `localhost` (or `postgres` if inside Docker)
   - Port: `5432`
   - Database: `scanner_db`
   - Username: `scanner_user`
   - Password: `scanner_pass`
4. Click **"Save"**

### **Option 2: psql Command Line**

```bash
# Connect to database
psql -h localhost -U scanner_user -d scanner_db
# Password: scanner_pass

# View all tables
\dt

# View scan jobs
SELECT id, target, status, open_ports, created_at 
FROM scan_jobs 
ORDER BY created_at DESC 
LIMIT 10;

# View port results for a specific scan
SELECT port, is_open, service, banner 
FROM port_results 
WHERE scan_job_id = 1;

# Exit
\q
```

### **Option 3: Using Docker**

```bash
# Connect to PostgreSQL container
docker exec -it scanner-postgres psql -U scanner_user -d scanner_db

# Run queries...
```

---

## **Scheduled Scans**

### **Create a Scheduled Scan**

```bash
curl -X POST http://localhost:8080/api/scheduled-scans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Security Scan",
    "target": "127.0.0.1",
    "portRange": "common",
    "cronExpression": "0 0 * * *"
  }'
```

### **Cron Expression Examples**

| Expression | Description |
|------------|-------------|
| `0 0 * * *` | Daily at midnight |
| `0 */4 * * *` | Every 4 hours |
| `0 9 * * 1` | Every Monday at 9 AM |
| `*/30 * * * *` | Every 30 minutes |
| `0 0 1 * *` | First day of every month |

### **Manage Scheduled Scans**

```bash
# List all scheduled scans
curl http://localhost:8080/api/scheduled-scans

# Get specific scheduled scan
curl http://localhost:8080/api/scheduled-scans/1

# Enable/Disable a scheduled scan
curl -X PATCH http://localhost:8080/api/scheduled-scans/1/toggle

# Delete a scheduled scan
curl -X DELETE http://localhost:8080/api/scheduled-scans/1
```

---

## **API Endpoints**

### **Scan Management**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scans` | Start a new scan |
| GET | `/api/scans/{jobId}` | Get scan status |
| GET | `/api/scans/{jobId}/results` | Get scan results |
| GET | `/api/scans?page=0&size=10` | List all scans (paginated) |
| DELETE | `/api/scans/{jobId}` | Delete a scan |

### **Scheduled Scans**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scheduled-scans` | Create scheduled scan |
| GET | `/api/scheduled-scans` | List all scheduled scans |
| GET | `/api/scheduled-scans/{id}` | Get scheduled scan |
| PUT | `/api/scheduled-scans/{id}` | Update scheduled scan |
| PATCH | `/api/scheduled-scans/{id}/toggle` | Enable/disable |
| DELETE | `/api/scheduled-scans/{id}` | Delete scheduled scan |

### **Dashboard**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |

### **Swagger Documentation**

Access interactive API docs at: `http://localhost:8080/swagger-ui.html`

---

## **Troubleshooting**

### **Port 8080 Already in Use**

```bash
# Find process using port 8080
lsof -i:8080

# Kill the process
kill -9 $(lsof -ti:8080)

# Or change application port
# Edit: backend/src/main/resources/application.yml
# server:
#   port: 8081
```

### **Database Connection Failed**

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Or locally:
pg_isready -h localhost -p 5432

# Check credentials in application.yml
cat backend/src/main/resources/application.yml

# Test connection manually
psql -h localhost -U scanner_user -d scanner_db
```

### **Frontend Can't Connect to Backend**

```bash
# Check backend is running
curl http://localhost:8080/actuator/health

# Should return: {"status":"UP"}

# Check CORS configuration in:
# backend/src/main/java/com/security/scanner/config/CorsConfig.java

# Verify API URL in frontend:
# frontend/src/services/api.js
# const API_BASE_URL = 'http://localhost:8080/api';
```

### **Maven Build Fails**

```bash
# Clear Maven cache
mvn clean

# Update dependencies
mvn dependency:resolve

# Skip tests if needed
mvn clean install -DskipTests
```

### **npm Install Fails**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## **Development Scripts**

### **Start All Services (Script)**

Create `start-dev.sh` in project root:

```bash
cat > start-dev.sh << 'EOF'
#!/bin/bash

echo "========================================="
echo "Starting Network Scanner Development"
echo "========================================="

# Kill any process on port 8080
if lsof -ti:8080 > /dev/null 2>&1; then
    echo "Killing process on port 8080..."
    kill -9 $(lsof -ti:8080)
    sleep 2
fi

# Start PostgreSQL
echo "Starting PostgreSQL..."
docker-compose up -d postgres
sleep 5

# Start Backend
echo "Starting Backend..."
cd backend
mvn spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend
echo "Waiting for backend to start..."
sleep 20

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================="
echo "Services Started!"
echo "========================================="
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo "Swagger:  http://localhost:8080/swagger-ui.html"
echo ""
echo "Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "To stop: kill $BACKEND_PID $FRONTEND_PID && docker-compose down"
EOF

chmod +x start-dev.sh
```

**Run:**
```bash
./start-dev.sh
```

### **Test Database Connection**

```bash
cat > test-database.sh << 'EOF'
#!/bin/bash

docker exec -it scanner-postgres psql -U scanner_user -d scanner_db << SQL
\dt
SELECT COUNT(*) FROM scan_jobs;
SELECT id, target, status, open_ports FROM scan_jobs ORDER BY created_at DESC LIMIT 5;
SQL
EOF

chmod +x test-database.sh
./test-database.sh
```

### **Run Test Scan**

```bash
cat > test-scan.sh << 'EOF'
#!/bin/bash

echo "Starting test scan on localhost..."

RESPONSE=$(curl -s -X POST http://localhost:8080/api/scans \
  -H "Content-Type: application/json" \
  -d '{
    "target": "127.0.0.1",
    "portRange": "common",
    "timeout": 2000
  }')

JOB_ID=$(echo $RESPONSE | grep -o '"jobId":[0-9]*' | grep -o '[0-9]*')

echo "Scan started with Job ID: $JOB_ID"
echo "Waiting for scan to complete..."
sleep 10

echo ""
echo "Fetching results..."
curl -s http://localhost:8080/api/scans/$JOB_ID/results | python3 -m json.tool
EOF

chmod +x test-scan.sh
./test-scan.sh
```

---

## **Production Deployment**

### **Build for Production**

```bash
# Backend JAR
cd backend
mvn clean package -DskipTests
# Output: target/network-scanner-1.0.0.jar

# Frontend Build
cd ../frontend
npm run build
# Output: dist/
```

### **Deploy with Docker**

```bash
# Build images
docker-compose build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## **Configuration**

### **Backend Configuration**

File: `backend/src/main/resources/application.yml`

```yaml
server:
  port: 8080

scanner:
  default-timeout: 2000        # Socket timeout (ms)
  max-concurrent-ports: 500    # Max ports scanned simultaneously
  max-concurrent-hosts: 10     # Max hosts scanned simultaneously
  rate-limit-delay: 10         # Delay between scans (ms)
```

### **Frontend Configuration**

File: `frontend/src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## **Project Structure**

```
network-scanner-app/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/security/scanner/
│   │       ├── controller/     # REST Controllers
│   │       ├── service/        # Business Logic
│   │       ├── model/          # JPA Entities
│   │       ├── repository/     # Database Repos
│   │       ├── config/         # Configuration
│   │       └── dto/            # Data Transfer Objects
│   ├── src/main/resources/
│   │   └── application.yml     # Configuration
│   └── pom.xml                 # Maven Dependencies
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── services/           # API Services
│   │   └── App.jsx             # Main App
│   ├── package.json            # npm Dependencies
│   └── vite.config.js          # Vite Config
│
├── docker/                     # Docker Files
├── docker-compose.yml          # Docker Compose
└── README.md                   # This file
```

---

## **Environment Variables**

### **Backend**

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/scanner_db
SPRING_DATASOURCE_USERNAME=scanner_user
SPRING_DATASOURCE_PASSWORD=scanner_pass

# Server
SERVER_PORT=8080
```

### **Frontend**

```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## **Testing**

### **Test Backend**

```bash
cd backend

# Run unit tests
mvn test

# Run integration tests
mvn verify

# Run specific test
mvn test -Dtest=ScanJobServiceTest
```

### **Test Frontend**

```bash
cd frontend

# Run tests (if configured)
npm test
```

---

## **Monitoring**

### **Backend Health Check**

```bash
curl http://localhost:8080/actuator/health
```

### **View Metrics**

```bash
curl http://localhost:8080/actuator/metrics
```

### **View Logs**

```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Local logs
tail -f backend.log
tail -f frontend.log
```

---

## **Security Notes**

⚠️ **Important Security Considerations:**

1. **Only scan authorized systems** - Unauthorized port scanning may be illegal
2. **Change default passwords** in production
3. **Use HTTPS** in production
4. **Implement authentication** for production use
5. **Configure firewall rules** appropriately
6. **Rate limit scans** to avoid triggering IDS/IPS

---

## **License**

This project is licensed under the MIT License.

---

## **Contributing**

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## **Support**

For issues or questions:
- Open an issue on GitHub
- Contact: your-email@example.com

---

## **Acknowledgments**

Built with:
- Spring Boot & Java 21 Virtual Threads
- React & Tailwind CSS
- PostgreSQL
- Docker

---

**Happy Scanning! 🚀**
