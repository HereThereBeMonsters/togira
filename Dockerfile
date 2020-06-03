FROM node:12

# app directory
WORKDIR /opt/togira/backend

# First, copy package.json (and .lock) and run npm install
# So this can be cached in a layer and does not need to be executed for every build
COPY ./backend/package*.json ./
RUN  npm ci --only=production

# Copy backend app
COPY ./backend/app.js ./

WORKDIR /opt/togira

#copy common proxy-config module
COPY ./proxy-config ./proxy-config

# Copy front-end
COPY ./frontend/ ./frontend/

# build front-end
WORKDIR /opt/togira/frontend
RUN [ "npm", "run", "build"]

# Start node backend app on port 3000 and expose the port
EXPOSE 3000
WORKDIR /opt/togira/backend
CMD [ "npm", "start"]
