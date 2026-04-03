# ============================================================
# Stage 1: base – install all dependencies
# ============================================================
FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

# ============================================================
# Stage 2: development – full deps + live reload
# ============================================================
FROM node:22-alpine AS development

WORKDIR /app

# Install ALL deps (including devDependencies for drizzle-kit etc.)
COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]

# ============================================================
# Stage 3: production – lean image, production-only deps
# ============================================================
FROM node:22-alpine AS production

WORKDIR /app

# Copy only production node_modules from base
COPY --from=base /app/node_modules ./node_modules

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start"]
