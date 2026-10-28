# Stage 1: installing dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy ONLY the dependency files first (this makes caching work)
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Stage 2:  small image 
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copy installed dependencies from stage 1
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Copy the application code
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src


USER node


EXPOSE 3000


HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]