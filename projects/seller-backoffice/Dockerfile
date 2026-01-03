FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY projects/seller-backoffice ./projects/seller-backoffice

RUN npm run build-seller

FROM  nginx:alpine

COPY --from=build /app/dist/seller-backoffice/browser /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]