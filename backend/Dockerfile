FROM node:18.17.1-alpine3.18

WORKDIR /app
COPY package.json package.json

RUN npm i

COPY src src
COPY tsconfig.json tsconfig.json

CMD npm start