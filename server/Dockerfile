# Stage 1: Build
FROM node:18-alpine AS builder

# Enable corepack to use Yarn v4
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy root yarn config and lockfile
COPY .yarnrc.yml ./
COPY yarn.lock ./
COPY package.json ./

# Copy all relevant workspace packages (server and shared code in games)
COPY server/package.json server/package.json
COPY games/package.json games/package.json

# Install only necessary dependencies for server + games
RUN yarn workspaces focus --all

# Copy source code for both workspaces
COPY server/tsconfig.json server/tsconfig.json
COPY server/webpack.config.js server/webpack.config.js
COPY server/src server/src
COPY games games

# Build the server app
WORKDIR /app/server
RUN yarn build

# Stage 2: Production Image
FROM node:18-alpine AS runner

WORKDIR /app

RUN corepack enable

# Copy compiled code and dependencies
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./

# Production install if needed (optional; often not needed if modules are already copied)
# RUN yarn workspaces focus --production server

EXPOSE 8080

CMD ["node", "dist/bundle.js"]
