# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and lockfile first for caching
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build TypeScript project
RUN pnpm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Copy dist and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

# Expose port
EXPOSE 5000

# Start app
CMD ["pnpm", "run", "start"]
