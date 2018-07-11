FROM node:9.6.1

MAINTAINER Charles Berman <Charles.Berman@Magna.com>


# Setup environment variables
ENV PATH $PATH:node_modules/.bin


# # User creation
# ENV USERNAME charles

# RUN adduser --disabled-password --gecos '' $USERNAME


# USER $USERNAME
# RUN chmod +x chmod -R /
# Set workdir
# You'll need to run this image with a volume mapped to /home/dev (i.e. -v $(pwd):/home/dev) or override this value
WORKDIR /app


# Create app directory
# WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

COPY . .


## Install yarn
# RUN npm install -g yarn

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source

EXPOSE 5555
CMD [ "npm", "start" ]