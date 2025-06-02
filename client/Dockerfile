# client/Dockerfile

#########################
# 1) Build stage
#########################
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json & package-lock.json, install deps
COPY package*.json ./
RUN npm install

# Copy all source and build
COPY . .
RUN npm run build


#########################
# 2) Serve stage
#########################
FROM nginx:stable-alpine

# Copy the compiled React files from “builder” stage
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Expose port 80 (where Nginx serves the files)
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
