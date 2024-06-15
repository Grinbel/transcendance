# Use an official Node.js runtime as a parent image

FROM node:21

# Copy package.json and package-lock.json to the working directory
RUN mkdir -p /app 
WORKDIR /app

RUN npx --yes create-vite . --template react
RUN chmod -R 777 /app
RUN npm install three @react-three/fiber
RUN npm install @react-three/drei
RUN npm install react-router-dom@6 localforage match-sorter sort-by
RUN npm install axios
RUN npm install react-bootstrap bootstrap
RUN npm install react-icons --save
RUN npm install sass
RUN npm i @emotion/react @emotion/styled
RUN npm install @mui/x-data-grid
RUN npm i @emotion/react @emotion/styled
RUN npm install jwt-decode
RUN npm audit fix --force
RUN npm install troika-three-text
RUN npm install xss
RUN npm install react-i18next i18next

RUN npm install



# Copy the current directory contents into the container at /app
#COPY . .

# Build the React application
# RUN npm run build

# Expose the port on which your React app will run (default is 3000)
EXPOSE 5173

# Start the React app
CMD ["npm", "run", "dev"]