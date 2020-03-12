FROM node:10-slim as build
WORKDIR /app
COPY package*.json ./
COPY default.conf ./
RUN npm install
ADD . .

RUN npm run build


FROM nginx:1.17.9-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/default.conf /etc/nginx/conf.d
EXPOSE 80