FROM node:10.15-alpine

EXPOSE 80

WORKDIR /opt/miniurl

COPY app/ app
COPY db/ db
COPY node_modules/ node_modules
COPY package.json .

CMD ["node", "./app/app.js"]
