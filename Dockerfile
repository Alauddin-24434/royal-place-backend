FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

EXPOSE 5000

# Start in production mode
CMD ["pnpm", "run", "start"]
