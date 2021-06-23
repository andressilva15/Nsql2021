FROM node:latest
RUN npm install --silent
RUN npm install react-scripts@0.9.5 -g --silent

WORKDIR /frontend
COPY . .

EXPOSE 3000

#RUN npm run build
CMD npm start