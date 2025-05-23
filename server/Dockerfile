# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root-level yarn.lock and server/package.json
COPY yarn.lock ./
COPY server/package.json ./package.json
COPY server/tsconfig.json ./tsconfig.json
COPY server/webpack.config.js ./webpack.config.js

# Copy server source files
COPY server/src ./src

# Install dependencies and build
RUN yarn install --frozen-lockfile
RUN yarn build

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

# Copy dist output and package.json
COPY --from=builder /app/dist ./dist
COPY server/package.json ./package.json
COPY yarn.lock ./yarn.lock

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Expose default Fly.io port
EXPOSE 8080

# Start the app
CMD ["node", "dist/bundle.js"]
