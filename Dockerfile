FROM node:12 as build
ENV NODE_ENV=production
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package* /home/node/app/
RUN npm ci
RUN npm cache clean --force
COPY --chown=node:node . /home/node/app

RUN npm run build

FROM nginx:stable
EXPOSE 80
COPY default.conf /etc/nginx/conf.d
COPY --from=build /home/node/app/build /usr/share/nginx/html/
RUN chmod -R ugo+r /usr/share/nginx/html/*
RUN chmod ugo+rx /usr/share/nginx/html/locales /usr/share/nginx/html/locales/en /usr/share/nginx/html/locales/fr /usr/share/nginx/html/locales/ru /usr/share/nginx/html/locales/zh
