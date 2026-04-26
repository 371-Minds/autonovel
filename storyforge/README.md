# StoryForge AI

**A comprehensive creative writing suite powered by AI.**

StoryForge helps writers draft stories, design covers, and develop plot points with the help of powerful generative AI assistants, supporting backends like Google Gemini and custom Arch Gateway instances. It provides a seamless, integrated environment to take your creative ideas from concept to completion.

## ✨ Key Features

-   **Project Library**: Organize all your writing projects in one place.
-   **AI-Powered Writing Tools**: Get contextual suggestions, AI-powered rewrites, and text completion.
-   **Autonomous Book Generation**: Go from a high-level concept to a fully drafted manuscript with a single click.
-   **Graphics Studio**: Generate stunning, cinematic book covers for your stories.
-   **Specialized AI Assistants**: Leverage a team of AI agents for writing, marketing, and planning.
-   **Customizable & Extensible**: Switch between light/dark themes, configure AI providers (Gemini, Arch Gateway), and create your own custom agents.
-   **Containerized & Decentralized**: Ready for robust, scalable deployment on local machines or decentralized cloud networks.

## 🚀 Getting Started

This application is designed to be run as a container, which provides a consistent and reliable environment for both development and production.

### Local Development

For local development, we use Docker Compose to simplify the setup process.

1.  **Clone the repository.**
2.  **Set up your `.env` file** to provide your Google Gemini API key.
3.  Run `docker-compose up --build`.
4.  Access the application at `http://localhost:3000`.

For detailed, step-by-step instructions, please see the **[Deployment Guide](DEPLOYMENT.md)**.

### Decentralized Deployment

StoryForge AI is ready for decentralized deployment on the **Akash Network**. This provides a censorship-resistant, cost-effective, and globally accessible hosting solution.

The repository includes a `deploy.yml` file, which is an Akash Stack Definition Language (SDL) file that describes the deployment requirements.

For a full walkthrough, please refer to the **[Deployment Guide](DEPLOYMENT.md)**.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`) & OpenAI-compatible APIs
-   **Containerization**: Docker, Nginx
-   **Deployment**: Docker Compose (Local), Akash Network (Decentralized)
