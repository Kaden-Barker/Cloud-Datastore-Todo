# Use a Node.js base image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy both package.json files
COPY server/package*.json ./server/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
RUN cd server && npm install

# Install frontend dependencies
RUN cd frontend && npm install

# Copy the rest of the application
COPY . .

# Build the frontend
RUN cd frontend && npm run build

# Expose port
EXPOSE 8080

# Command to run the server
CMD ["npm", "start"]
