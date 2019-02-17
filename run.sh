#!/bin/sh
npx sequelize db:migrate
node app/app.js
