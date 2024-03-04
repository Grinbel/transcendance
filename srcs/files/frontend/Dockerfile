# Use an official Node.js runtime as a parent image

FROM node:21

# Copy package.json and package-lock.json to the working directory
RUN mkdir -p /app 
WORKDIR /app

RUN npx --yes create-vite . --template react
RUN chmod -R 777 /app
RUN npm install three @react-three/fiber
RUN npm install @react-three/drei
RUN npm audit fix
RUN npm install
# Copy the current directory contents into the container at /app
# COPY . .

# Build the React application
# RUN npm run build

# Expose the port on which your React app will run (default is 3000)
EXPOSE 5173

# Start the React app
CMD ["npm", "run", "dev"]