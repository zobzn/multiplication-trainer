# 🎓 Multiplication Trainer

Interactive multiplication and division trainer for kids with sound effects and beautiful UI.

## Features

- ✖️ Multiplication practice
- ➗ Division practice
- 🔀 Mixed mode (alternating multiplication and division)
- 🎯 Customizable number ranges
- 📊 Progress tracking
- 🎵 Sound effects for correct/incorrect answers
- 🌈 Beautiful gradient UI

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Vite configuration
6. Click "Deploy"

That's it! Your app will be live in a few seconds.

## Project Structure

```
multiplication-trainer/
├── src/
│   ├── MultiplicationTrainer.jsx  # Main component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
└── vercel.json                    # Vercel configuration
```

## License

MIT
