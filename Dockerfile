# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the app source code to the container
COPY . .


RUN npx prisma generate
# Build the app

RUN npm run build

# Expose the port the app will run on
EXPOSE 8080

# Start the app
CMD ["npm", "start"]