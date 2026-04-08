# Smart Chef: AI-Powered Culinary Architect

Smart Chef is an intelligent culinary companion developed for the OxBuild Hackathon. It leverages the power of Oxlo.ai's natural language processing API to understand available pantry ingredients, dietary constraints, and macronutrient targets, and transforms them into customized, meticulously formatted recipes.

## Table of Contents
- Introduction
- Primary Use Case
- Features
- Technology Stack
- Oxlo.ai Integration
- Setup and Installation
- Hackathon Submission Details

## Introduction
The problem of "what to cook with what I have" affects everyone from busy professionals to college students. Combining ingredients effectively while adhering to specific dietary requirements (such as Keto, Vegan, or Gluten-Free) or strict fitness macros (high-protein, low-calorie) requires significant time and culinary knowledge. Smart Chef removes this friction entirely by acting as an intelligent algorithmic sous-chef.

## Primary Use Case
The core use case for Smart Chef is providing hyper-personalized meal planning and recipe generation without necessitating a grocery store run. 

Users can input the ingredients they currently possess in their kitchen. They can then specify any dietary patterns (e.g., Paleo, Vegan) and nutritional goals (e.g., "Under 500 calories" or "Athletic high protein"). The application dynamically generates a unique recipe that optimally utilizes the provided ingredients while strictly adhering to the constraints. 

## Features
- Dynamic Recipe Generation: Instantly structures ingredients into step-by-step cooking instructions.
- Centralized Pantry Manager: Allows users to save common household ingredients persistently across sessions for faster recipe generation.
- Recipe Vault: A historical ledger that actively logs every generated recipe, allowing users to return to past generations easily.
- Next-Generation Interface: Designed natively with Next.js, featuring a high-end glassmorphism architecture, dynamic background lighting, and completely custom responsive styling.

## Technology Stack
- Core Framework: Next.js (App Router, React, TypeScript)
- Styling: Custom Vanilla CSS (Design Systems, CSS Variables, and Glassmorphism techniques)
- Database: Browser Local Storage (for Pantry and History tracking without latency)
- AI Interfacing: Axios for robust network handling and automated IPv4 resolution to Oxlo servers.

## Oxlo.ai Integration
This project extensively utilizes the Oxlo.ai platform to process unstructured culinary data. 

- Model Used: `llama-3.2-3b`
- Integration Method: The application establishes a secure connection to the Oxlo.ai REST API via a dedicated Next.js Server Route (`/api/generate-recipe`). This architecture prevents the exposure of the API key to the client browser. 
- Prompt Engineering: The server dynamically injects the user's ingredients, dietary preferences, and macro goals into a system prompt engineered to output strictly structured Markdown for a clean culinary presentation.

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- An active Oxlo.ai API Key from portal.oxlo.ai

### Instructions
1. Clone this repository to your local machine.
2. Navigate into the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Install the required Node dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file in the root of the `frontend` directory and define your Oxlo API key:
   ```env
   OXLO_API_KEY=your_registered_api_key_here
   OXLO_MODEL=llama-3.2-3b
   ```
5. Initiate the development server:
   ```bash
   npm run dev
   ```
6. Open your web browser to `http://localhost:3000` to interact with the application.

## Hackathon Submission Details
- Registered Oxlo.ai Email: [Enter Your Registered Email Here]
- Platform: GitHub Open Source
- Hackathon: OxBuild by Oxlo.ai

---
Developed for OxBuild 2026.
