FROM node:12 as build
ENV NODE_ENV=production
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . /home/node/app
RUN sudo apt-get install libusb-1.0.0 -y
RUN npm install
RUN npm cache clean --force
RUN npm run build

FROM nginx:stable
EXPOSE 80
COPY --from=build /home/node/app/build /usr/share/nginx/html
