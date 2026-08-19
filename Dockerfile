FROM node:18-alpine

WORKDIR /app

# Build frontend
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend . 
RUN npm run build

# Copy frontend dist to backend public
RUN mkdir -p /app/backend/public && cp -r /app/frontend/dist/* /app/backend/public/

# Setup backend
WORKDIR /app/backend
COPY backend/package*.json .
RUN npm install
COPY backend .

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "server.js"]
