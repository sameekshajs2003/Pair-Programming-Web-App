## Use a Debian-slim Node image to avoid known Alpine CVE issues reported by some scanners.
## Bumping to a current LTS slim image reduces surface for vulnerabilities while keeping size reasonable.
FROM node:20-bullseye-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm ci in CI for deterministic installs)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
