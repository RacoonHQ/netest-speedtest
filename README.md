# Netest - Network Speed Test Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Netest is a modern, responsive web application for testing your internet connection speed. It provides detailed metrics including ping, download speed, upload speed, and network information. Built with Next.js, TypeScript, and Tailwind CSS.

<div align="center">
  <img src="/public/project/awal.png" alt="Netest Speed Test Interface" width="80%" style="border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
</div>

## 🌟 Features

- 🚀 Real-time speed testing (ping, download, upload)
- 📊 Detailed test results with visual indicators
- 🌐 Network information (IP, location, ISP, etc.)
- 📱 Responsive design that works on all devices
- 🌓 Dark/Light mode support
- 📈 Performance metrics and connection quality rating
- 📺 Platform compatibility check (YouTube, Netflix, Disney+, etc.)
- 📡 Network diagnostics and recommendations

## 🖼 More Screenshots

<div align="center">
  <img src="/public/project/analytics.png" alt="Analytics Dashboard" width="45%" style="border-radius: 8px; margin: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
  <img src="/public/project/gaming.png" alt="Streaming Platform Check" width="45%" style="border-radius: 8px; margin: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
  <img src="/public/project/streaming.png" alt="Gaming Performance" width="45%" style="border-radius: 8px; margin: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
  <img src="/public/project/brand.png" alt="Branding" width="90%" style="border-radius: 8px; margin: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
</div>

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **Types**: TypeScript
- **Charts**: D3.js
- **Icons**: Lucide React
- **State Management**: React Hooks
- **UI Components**: Shadcn/ui

## 📁 Project Structure

```
netest-speedtest/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── favicon.ico        # Favicon
│   ├── globals.css        # Global styles
│   └── page.tsx           # Main page component
│
├── components/            # Reusable UI components
│   ├── speed-test-card.tsx  # Main speed test component
│   ├── ui/                # Shadcn/ui components
│   └── WaveBackground.tsx  # Animated wave background
│
├── constants/             # Application constants
│   └── speed-test.constants.ts  # Speed test configurations
│
├── hooks/                 # Custom React hooks
│   ├── use-mobile.ts      # Mobile detection hook
│   └── use-toast.ts       # Toast notification hook
│
├── lib/                   # Utility functions
│   ├── network-utils.ts   # Network-related utilities
│   └── utils.ts           # General utilities
│
├── public/                # Static assets
│   ├── platform-stream/   # Streaming platform icons
│   └── game-icon/         # Game platform icons
│
├── styles/                # Global styles
│   └── globals.css        # Global CSS variables and styles
│
├── types/                 # TypeScript type definitions
│   └── speed-test.types.ts  # Type definitions for speed test
│
├── .gitignore            # Git ignore file
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies
├── postcss.config.mjs    # PostCSS configuration
├── README.md            # Project documentation (this file)
└── tailwind.config.js   # Tailwind CSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RacoonHQ/netest-speedtest.git
   cd netest-speedtest
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Running Tests

```bash
npm test
# or
pnpm test
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For any questions or feedback, please open an issue on GitHub.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [D3.js](https://d3js.org/) - Data-Driven Documents
- [Shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Lucide](https://lucide.dev/) - Beautiful & consistent icons
- **Icons**: Lucide Icons
- **State Management**: React Hooks
- **Networking**: Custom speed test implementation

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/netest.git
   cd netest
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
netest/
├── app/                    # App router pages
├── components/             # Reusable components
├── constants/              # Application constants
├── lib/                    # Utility functions and hooks
├── public/                 # Static files
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
```

## Configuration

You can configure various aspects of the application by modifying the constants in the `constants/` directory, including:

- Test file sizes
- Timeout settings
- Animation durations
- Color schemes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## Developer

Made by [RacoonHQ](https://github.com/racoonhq)
