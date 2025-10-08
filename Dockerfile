# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY bun.lock ./
COPY apps/sim/package.json ./apps/sim/
COPY packages/db/package.json ./packages/db/

# Install bun
RUN npm install -g bun

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application
WORKDIR /app/apps/sim
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy \
    BETTER_AUTH_SECRET=dummy \
    NODE_ENV=production \
    bun run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the application (both Next.js and Socket.IO server)
CMD ["bun", "run", "start:prod"]