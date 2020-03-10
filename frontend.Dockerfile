FROM node:10-slim as build
WORKDIR /app
COPY package*.json ./
RUN npm install
ADD frontend ./frontend
ADD public ./public
ADD vue.config.js .

RUN npm run build-frontend



FROM nginx:1.17.9-alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html/frontend
EXPOSE 80