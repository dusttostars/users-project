# server/Dockerfile

# 1. Use an official Node.js runtime as a parent image
FROM node:18-alpine

# 2. Set working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json & package-lock.json (if present) and install dependencies
COPY package*.json ./
RUN npm install --production

# 4. Copy all source files into the container
COPY . .

# 5. Expose the port that the Express server listens on
EXPOSE 5000

# 6. Set NODE_ENV (optional but recommended)
ENV NODE_ENV=production

# 7. Start the server (index.js runs init-db.js, creates DB + tables, then listens)
CMD ["node", "index.js"]
