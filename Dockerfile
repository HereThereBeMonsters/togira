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

# Copy front-end bundles
COPY ./frontend/dist ./frontend/dist

RUN ls -l

# Start node backend app on port 3000
WORKDIR /opt/togira/backend
EXPOSE 3000
CMD [ "npm", "start"]
