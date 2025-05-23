# 1. Use a Node.js base image
FROM node:18-alpine AS builder

# 2. Set working directory for the build
WORKDIR /app

# 3. Copy only relevant files
COPY yarn.lock ./
COPY server/package.json ./server/package.json
COPY server/tsconfig.json ./server/tsconfig.json
COPY server/webpack.config.js ./server/webpack.config.js

# 4. Copy the rest of the source files
COPY server/src ./server/src

# 5. Change working directory to /server
WORKDIR /app/server

# 6. Install deps from root yarn.lock
RUN yarn install --frozen-lockfile

# 7. Build the app
RUN yarn build

# 8. Final minimal image
FROM node:18-alpine AS runner

WORKDIR /app

# 9. Copy necessary runtime files
COPY --from=builder /app/server/dist ./dist
COPY server/package.json ./

# 10. Install only production dependencies
RUN yarn install --production --frozen-lockfile

# 11. Expose port (Fly default is 8080)
EXPOSE 8080

# 12. Run the app
CMD ["node", "dist/bundle.js"]
