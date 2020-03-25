FROM node:10-alpine
WORKDIR /app
# Copy package.json and package-lock.json for build
COPY package*.json ./
# Install packages
RUN npm install
# Add source code to docker
ADD . .
# Make port 3000 public
EXPOSE 3000
# Start running the Node.js project
CMD npm run start