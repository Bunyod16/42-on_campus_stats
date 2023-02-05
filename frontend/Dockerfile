# Use an official Node.js image as the base image
FROM node:latest

# Set the working directory
WORKDIR /frontend

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies for the React.js application
RUN npm install
# Dependency for serving production build
RUN npm install serve

# Copy the rest of the code for the React.js application
COPY . .

CMD npm start

# Build the React.js application
# RUN npm run build

# CMD ["./node_modules/.bin/serve", "-s", "build"]

# EXPOSE 3000
# CMD ["npx", "serve", "-s" "build"]