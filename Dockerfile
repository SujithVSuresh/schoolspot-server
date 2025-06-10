# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build TypeScript
RUN npm run build

# Expose app port
EXPOSE 3000

# Start application
CMD ["node", "dist/index.js"]
