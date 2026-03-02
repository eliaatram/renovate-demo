FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first - separate layer from source code
# If package.json hasn't changed, Docker reuses the cached npm ci layer
# even when source files change
COPY package.json package-lock.json ./

RUN npm ci

# Copy source code - this layer changes on every commit
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript + JavaScript
RUN npm run build

# ------------ Stage 2: Production ----------------
FROM node:20-alpine AS production

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first - separate layer from source code
# If package.json hasn't changed, Docker reuses the cached npm ci layer
# even when source files change
COPY package.json package-lock.json ./

# Install ONLY production dependencies
# --omit-dev excludes devDependencies (typescript, jest, eslint, etc...)
RUN npm ci --omit=dev --ignore-scripts

# Copy source code - this layer changes on every commit
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# The user to run the process as
# Runnins as root inside a container is a security risk
USER node

CMD ["node", "dist/index.js"]