FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build && npm run build-seller

CMD [ "node", "dist/mainstream/server/server.mjs" ]

# NGINX
FROM nginx:alpine

COPY --from=build /app/dist/mainstream /usr/share/nginx/html
COPY --from=build /app/dist/seller-backoffice /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]