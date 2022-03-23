FROM node:16-alpine

WORKDIR /app
RUN npm install --global nodemon
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 4000
RUN npm run build
# CMD ["npm ", "run", "server"]