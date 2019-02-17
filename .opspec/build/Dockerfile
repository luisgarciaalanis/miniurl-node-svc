FROM node:10.15-alpine

EXPOSE 7777

WORKDIR /opt/miniurl

COPY app/ app
COPY db/ db
COPY node_modules/ node_modules
COPY package.json .
COPY .sequelizerc .
copy run.sh .

CMD ./run.sh
