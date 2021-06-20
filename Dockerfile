FROM node:13.12.0-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . ./
RUN ls -a
RUN npm run build

#Stage Two, multi stage build, FROM is from the previous container
FROM node:13.12.0-alpine
WORKDIR /app
COPY package.json ./
COPY .env ./ 
COPY secrets ../secrets
RUN npm install --only=production
COPY --from=0 /app/dist . 
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY 6sdsevl26ab6lqy
ENV PM2_SECRET_KEY 0wxpgzkirkzzsgc
EXPOSE 80
CMD ["pm2-runtime","server.js"]