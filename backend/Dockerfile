# Stage 1: Frontend setup
FROM node:20 AS frontend-build

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Backend setup

FROM node:20 AS backend

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ ./

RUN npx prisma generate

COPY --from=frontend-build /frontend/dist ./public

EXPOSE 5000

CMD ["node", "app.js"]
