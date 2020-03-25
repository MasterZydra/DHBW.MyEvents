# 1. Build Vue.js in node docker
FROM node:10-slim as build
WORKDIR /app
# Copy package.json and package-lock.json for build
COPY package*.json ./
# Copy nginx config file for usage of Vue.js
COPY default.conf ./
# Install packages
RUN npm install
# Add source code to docker
ADD . .
# Build the Vue.js application
RUN npm run build

# 2. Publish in nginx docker (webserver)
FROM nginx:1.17.9-alpine
# Copy Website source code from node docker to webserver
COPY --from=build /app/dist /usr/share/nginx/html
# Overwrite webserver config to run the Vue.js project without issues
COPY --from=build /app/default.conf /etc/nginx/conf.d
# Make port 80 public
EXPOSE 80