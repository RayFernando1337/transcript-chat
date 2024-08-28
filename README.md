# Transcript Chat

Transcript Chat is a Next.js project that allows users to chat with their transcript files using AI. This app is designed for local use and experimentation.

## Important Note

⚠️ **This app is not ready for remote deployment.** There's currently no authentication or rate limiting in place, which could lead to excessive API usage and costs if deployed publicly. Please use this app locally for testing and learning purposes only.

## Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (version 14 or higher)
- Bun (see installation instructions below)
- An OpenAI API key

## Installing Bun

Bun is a fast all-in-one JavaScript runtime. To install Bun, run one of the following commands based on your operating system:

For macOS and Linux:
```bash
curl -fsSL https://bun.sh/install | bash
```

For Windows (using PowerShell):
```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

Alternatively, if you prefer using npm:
```bash
npm install -g bun
```

After installation, verify it by running:
```bash
bun --version
```

For more information about Bun, visit [https://bun.sh/](https://bun.sh/).

## Getting Started

1. Clone this repository to your local machine.

2. Install the dependencies:
   ```bash
   bun install
   ```

3. Set up your OpenAI API key:
   - Sign up for an account at [OpenAI](https://openai.com) if you haven't already.
   - Navigate to the API section and create a new API key.
   - Copy the `.env.example` file to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Open `.env.local` and replace `your_openai_api_key_here` with your actual OpenAI API key:
     ```
     OPENAI_API_KEY=your_actual_openai_api_key_here
     ```

4. Run the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. Upload an SRT file containing your transcript.
2. Ask questions about the transcript in the chat interface.
3. The AI will analyze the transcript and provide answers based on its content.

## Features

- Dark mode support
- Markdown rendering for AI responses
- Responsive design

## Project Structure

- `app/`: Contains the main application code
- `components/`: Reusable React components
- `utils/`: Utility functions, including the SRT parser

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## Contributions

This project is for educational purposes. Feel free to fork and experiment, but please remember not to deploy it publicly without implementing proper security measures.

## Disclaimer

This app uses the OpenAI API, which may incur costs based on usage. Be mindful of your API usage and check OpenAI's pricing details.