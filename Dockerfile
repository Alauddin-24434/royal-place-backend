# Use Node.js 18 Alpine image for smaller size
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code and config files (including tsconfig.json)
COPY . .

# Build TypeScript to JavaScript (creates dist/)
RUN npm run build

# Expose the port your app listens on
EXPOSE 5000

# Start the app from compiled JS
CMD ["node", "dist/server.js"]
