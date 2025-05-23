# 1. Use an official Node.js image
FROM node:18-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm ci

# 5. Copy source files
COPY . .

# 6. Build the app
RUN npm run build

# 7. Use a smaller image for production
FROM node:18-alpine AS runner

# 8. Set working directory
WORKDIR /app

# 9. Copy the built bundle and any needed assets
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# 10. Install production dependencies only
RUN npm ci --only=production

# 11. Expose port (default Fly.io internal port is 8080)
EXPOSE 8080

# 12. Start the app
CMD ["node", "dist/bundle.js"]
