FROM node:18 as build

ENV NODE_ENV=production


WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm i -g vite
COPY . ./
RUN npm run build


FROM node:18

WORKDIR /app
COPY --from=build /app .

ENV HOST=0.0.0.0

EXPOSE 4173
CMD PUBLIC_WEBSOCKET_URL=$PUBLIC_WEBSOCKET_URL npm run preview -- --host 0.0.0.0
