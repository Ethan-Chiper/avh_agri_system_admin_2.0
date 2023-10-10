FROM node:lts-hydrogen


RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/temp
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --omit=dev --ignore-scripts=true

# Bundle app Source
COPY . /usr/src/app

EXPOSE 1507
CMD ["sh", "-c", "node Source/index.js"]
RUN mkdir -p /usr/src/app/temp
