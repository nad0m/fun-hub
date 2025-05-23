# Use a base image
FROM node:18-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy root-level yarn.lock into context
COPY ../yarn.lock ./yarn.lock

# Copy server package and all necessary config files
COPY . .

# Install all dependencies using root-level yarn.lock
RUN yarn install --frozen-lockfile

# Build the project
RUN yarn build

# Final minimal image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only the dist directory and package.json
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Install only production dependencies
COPY ../yarn.lock ./yarn.lock
RUN yarn install --frozen-lockfile --production

# Expose the port your app uses (Fly expects 8080 by default)
EXPOSE 8080

# Start your server
CMD ["node", "dist/bundle.js"]
