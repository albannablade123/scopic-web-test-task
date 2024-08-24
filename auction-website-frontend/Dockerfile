FROM node:latest

RUN npm i -g npm

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production

WORKDIR /home/nextjs/app

COPY package.json .
COPY package-lock.json .

RUN npm install --omit=optional


COPY . .

RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
