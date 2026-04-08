# 🍳 Smart Chef - AI Recipe & Meal Planner

Smart Chef is an AI-powered culinary companion built for the **OxBuild Hackathon**. It leverages the power of Oxlo.ai's natural language processing models to generate completely customized recipes and meal plans based on your available ingredients, dietary preferences, and nutritional goals.

## ✨ Features
- **Intelligent Recipe Generation**: Just input what you have in your fridge, and the AI will act as your personal sous-chef.
- **Dietary & Macro Customization**: Fully adheres to specifics like Keto, Vegan, Gluten-Free, or high-protein goals.
- **Stunning UI**: Built with Next.js, featuring a highly-polished edge-to-edge dark theme, glassmorphism components, and fluid micro-animations.

## 🛠 Tech Stack
- Frontend Engine: Next.js (App Router), React, TypeScript
- Styling: Custom Vanilla CSS (Design Systems & CSS Variables)
- Backend: Next.js Route Handlers 
- AI: Oxlo.ai API

## 🚀 Getting Started

1. Clone this repository.
2. Install dependencies:
```bash
npm install
```
3. Create a `.env.local` file in the root directory and add your Oxlo API key:
```env
OXLO_API_KEY=your_registered_api_key
```
4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Oxlo.ai Integration
This project utilizes the `oxlo-v1` AI model to understand complex dietary instructions and return cleanly formatted Markdown recipes. 
Email used for Oxlo account: `[Enter Your Registered Email Here]`.

---
*Built with ❤️ for OxBuild* 
