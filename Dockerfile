FROM node:18-alpine

WORKDIR /app

# Build frontend
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend . 
RUN npm run build

# Setup backend
WORKDIR /app
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
COPY backend .

EXPOSE 5000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# The following should be set at runtime:
# DATABASE_URL (or DATABASE_PRIVATE_URL for Railway)
# SECRET_KEY

CMD ["node", "server.js"]
