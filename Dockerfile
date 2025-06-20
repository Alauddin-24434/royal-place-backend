FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install pnpm
RUN npm install -g pnpm

# Now install dependencies
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]