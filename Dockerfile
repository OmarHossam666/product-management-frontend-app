# Build stage
FROM node:18-alpine AS build
WORKDIR /app
# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
# Copy the rest of the application
COPY . .
# Build the React application for production
RUN npm run build

# Serve stage
FROM nginx:alpine
# Copy the built artifacts from the build stage to Nginx
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80 for the Nginx server
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
