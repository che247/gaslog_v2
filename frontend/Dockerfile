from NODE:20

# Let's copy frontend and builds into backend
WORKDIR /frontend
COPY frontend/package*.json .
RUN npm install
COPY frontend .
RUN npm run build


WORKDIR /app

COPY package.json ./
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
