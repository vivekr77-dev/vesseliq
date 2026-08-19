# Build timestamp: 2026-08-19-16-59
FROM node:18-alpine

WORKDIR /app

# Build frontend
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend .
RUN npm run build

# Verify dist was created
RUN echo "=== Checking frontend dist ===" && ls -la /app/frontend/dist/ || echo "ERROR: dist not found"

# Copy frontend dist to backend public
RUN mkdir -p /app/backend/public && cp -r /app/frontend/dist/* /app/backend/public/ || echo "ERROR: copy failed"

# Verify files were copied
RUN echo "=== Checking backend public ===" && ls -la /app/backend/public/ || echo "ERROR: public empty"

# Setup backend
WORKDIR /app/backend
COPY backend/package*.json .
RUN npm install
COPY backend .

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]
