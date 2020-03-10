FROM node:10-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install

ADD backend ./backend
#CMD sh
EXPOSE 3000
CMD npm run start-server-prod