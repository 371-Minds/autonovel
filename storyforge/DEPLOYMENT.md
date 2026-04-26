# StoryForge AI: Deployment Guide

This guide provides instructions for building, running, and deploying the StoryForge AI application using Docker for local development and the Akash Network for decentralized hosting.

## Prerequisites

-   **Docker**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system.
-   **Docker Hub Account**: You will need a [Docker Hub](https://hub.docker.com/) account to push your image for Akash deployment.
-   **Akash Deployment Tool**: A tool to interact with the Akash Network. We recommend [Cloudmos Deploy](https://deploy.cloudmos.io/) for its user-friendly web interface.
-   **Akash Wallet**: A Keplr wallet with some AKT tokens to pay for the deployment.

---

## Part 1: Building and Pushing the Docker Image

To deploy the application on Akash, you first need to build the Docker image and push it to a public registry like Docker Hub.

**1. Build the Image**

Open a terminal in the project's root directory and run the build command. Replace `yourdockerhubusername` with your actual Docker Hub username.

```bash
docker build -t yourdockerhubusername/storyforge-ai:latest .
```

**2. Log in to Docker Hub**

Log in to your Docker Hub account from the terminal. You will be prompted for your username and password (or an access token).

```bash
docker login
```

**3. Push the Image**

Push the newly built image to your Docker Hub repository.

```bash
docker push yourdockerhubusername/storyforge-ai:latest
```

Your container image is now publicly available and ready for deployment.

---

## Part 2: Local Development with Docker Compose

For local development and testing, you can use the provided `docker-compose.yml` file.

**1. Create an Environment File**

Create a file named `.env` in the root of the project. This file will hold your Google Gemini API key.

```
# .env
API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

**2. Run Docker Compose**

Start the application using Docker Compose. The `--build` flag ensures the image is rebuilt if you've made any changes.

```bash
docker-compose up --build
```

**3. Access the Application**

Once the container is running, open your web browser and navigate to:

[http://localhost:3000](http://localhost:3000)

You should see the StoryForge AI application running, fully configured with your API key.

---

## Part 3: Decentralized Deployment on Akash Network

This section guides you through deploying your containerized application to the Akash Network.

**1. Update the SDL File**

Open the `deploy.yml` file. You **must** update the `image` field to point to the Docker image you pushed in Part 1.

```yaml
# deploy.yml

services:
  web:
    # Replace the placeholder with your actual image from Docker Hub
    image: yourdockerhubusername/storyforge-ai:latest
    env:
      # This will be provided securely during deployment
      - "API_KEY="
    # ... rest of the file
```

**2. Deploy using Cloudmos**

-   Navigate to [Cloudmos Deploy](https://deploy.cloudmos.io/).
-   Connect your Keplr wallet.
-   Click **"Create Deployment"** and choose **"Empty"** to start a new SDL.
-   Copy the entire contents of your updated `deploy.yml` file and paste it into the Cloudmos editor.
-   Click **"Create Deployment"**.
-   You will be prompted to deposit AKT to fund the deployment. Approve the transaction.

**3. Provide the API Key**

-   After the deployment is created, you will see a list of bids from Akash providers.
-   Accept a bid from a provider to launch your application.
-   During the launch process, Cloudmos will display a **"Set Environment Variables"** section.
-   Securely paste your Google Gemini `API_KEY` into the value field.
-   Click **"Launch Deployment"** and approve the final transaction.

**4. Access Your Live Application**

-   Once the deployment is active, go to the "Leases" tab in Cloudmos.
-   You will find a unique URI for your application (e.g., `http://...akash.network`).
-   Click this URI to access your globally deployed StoryForge AI application.

---

## Part 4: Using Cloudflare AI Gateway

As an alternative to the default Gemini provider, you can configure StoryForge AI to use Cloudflare's AI Gateway. This allows you to leverage Cloudflare's network for caching, rate limiting, and analytics, while using various underlying models.

**1. Set up Cloudflare AI Gateway**

-   Log in to your Cloudflare dashboard.
-   Navigate to **Workers & Pages** -> **AI Gateway**.
-   Create a new Gateway. Note the **Gateway ID**.
-   In the Gateway settings, ensure you have an OpenAI-compatible endpoint. The URL will look something like this: `https://gateway.ai.cloudflare.com/v1/ACCOUNT_TAG/GATEWAY_ID/openai`.

**2. Create a Cloudflare API Token**

-   Go to **My Profile** -> **API Tokens**.
-   Create a new API Token with the "Workers AI" template. This will grant the necessary permissions for the AI Gateway.
-   Copy the generated API Token securely.

**3. Configure StoryForge AI**

-   Open the StoryForge AI application (either locally or on your Akash deployment).
-   Navigate to the **Settings** view.
-   Under **AI Provider**, select **"Cloudflare AI Gateway"** from the dropdown.
-   Enter the following information:
    -   **Gateway URL**: Paste the full OpenAI-compatible endpoint URL from Step 1.
    -   **API Token**: Paste the API Token you created in Step 2.
    -   **Model**: Select a model from the list (e.g., `@cf/meta/llama-3.1-8b-instruct`) or choose "Custom" and enter the specific model identifier you wish to use.
-   The settings are saved automatically. All AI-powered features will now route through your configured Cloudflare AI Gateway.