

# 🏨 Royal Place — Hotel Management Backend API

Welcome to the backend of **Royal Place**, a robust hotel management system built with **Express.js**, **TypeScript**, and **MongoDB**. This API powers essential features such as room booking, user management, payments, and more. **Redis** is now used for caching and session management, managed via Docker Compose.

-----

## 🚀 Features

  - **User Authentication & Role Management**
  - **Room Booking System**
  - **Stripe Payment Integration**
  - **Hotel Amenities & Services**
  - **Customer Testimonials**
  - **Refund & Cancellation Prediction Endpoint**
  - **Redis Caching & Session Management** (New)

-----

## 🛠 Getting Started

### 1\. Clone the Repository

```bash
git clone https://github.com/Alauddin-24434/royal-place-backend.git
cd royal-place-backend
```

### 2\. Install Dependencies

This project exclusively uses **pnpm** (recommended).

```bash
pnpm install
```
-----

## 🔐 Environment Variables

Create a `.env` file in the project root with the following keys. Note the new `REDIS_URI`.

```env
# ----------------------
# App / Server Settings
# ----------------------
NODE_ENV=development
PORT=5000
# Run mode (true => Docker container, false => Local development)
DOCKER_CONTAINER=false

# ----------------------
# MongoDB
# ----------------------
MONGO_URI=

# ----------------------
# Redis
# ----------------------
REDIS_URI=

# ----------------------
# JWT / Authentication
# ----------------------
JWT_ACCESS_TOKEN_SECRET=8c26f00f08699f7c5c1b007946d55106e7176efc8e6b3b9f950f9b26fb3672a6
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_SECRET=efee9e64e21450ebfa5a97d0e767ebe2ed8b4e85027ba8d
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# ----------------------
# Payment (AamarPay)
# ----------------------
AAMARPAY_STORE_ID=
AAMARPAY_SIGNATURE_KEY=
CANCEL_URL=/api/payments/cancel
FAIL_URL=/api/payments/fail

# ----------------------
# ML / External APIs

# ----------------------
# Cloudinary Storage
# ----------------------
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

-----


## 🚀 Running the Project

### Local Development

For development without Docker, ensuring you have **MongoDB** and **Redis** running locally:

```bash
pnpm run dev
```

### Production Build

```bash
pnpm run build && pnpm start
```

-----

## 🐳 Dockerization with Docker Compose (Recommended)

This project uses **Docker Compose** to manage the application (`app`), **MongoDB** (`mongo`), and **Redis** (`redis`) services, making development and deployment easy and consistent.

### 1\. Start the Services (App, MongoDB, and Redis)

Use the following command to build the image and start all services in the background:

```bash
docker compose up -d
```

### 2\. View Service Logs

To monitor the application's output and debug any issues, stream the logs from the `app` service:

```bash
docker compose logs -f app
```

### 3\. Manage Redis

You can stop and restart individual services if needed.

#### Stop the Redis Service:

To stop only the **Redis** container without affecting the application or database:

| Operating System | Command |
| :--- | :--- |
| **Ubuntu/Linux & macOS** | `docker compose stop redis` |
| **Windows (PowerShell/CMD)** | `docker compose stop redis` |

#### Restart the Redis Service:

If you need to clear the Redis cache or restart the service:

| Operating System | Command |
| :--- | :--- |
| **Ubuntu/Linux & macOS** | `docker compose restart redis` |
| **Windows (PowerShell/CMD)** | `docker compose restart redis` |

### 4\. Stop and Remove All Services

When you're finished working, use this command to stop and remove all containers, networks, and volumes defined in the `docker-compose.yml` file:

```bash
docker compose down
```

-----

## 🤝 Contributing

Contributions are welcome\! Please open issues or submit pull requests for improvements and bug fixes.

-----

## 📫 Contact

For questions or support, please contact [alauddin150900@gmail.com].