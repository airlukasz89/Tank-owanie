FROM node:10

COPY . .

CMD npm install

EXPOSE 10001

CMD npm run watch