FROM node:18

# Install pnpm (optional, আপনি npm বা pnpm যে ব্যবহার করেন সেটা)
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 5000

CMD ["pnpm", "start"]
