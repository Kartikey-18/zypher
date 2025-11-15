# Zypher - Privacy Technology Demonstration Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![Python](https://img.shields.io/badge/Python-3.11+-blue)

An innovative web application showcasing three cutting-edge privacy technologies:
- **Zero-Knowledge Proof (ZKP) Authentication** - Login without transmitting passwords
- **AI-Generated Art** - Create beautiful images using Stable Diffusion
- **Audio Steganography** - Hide voice messages inside images

## 🎯 Project Vision

Zypher combines cryptography, AI, and steganography into a cohesive, portfolio-worthy platform demonstrating advanced privacy-preserving technologies. Unlike typical demos, Zypher creates a practical use case: **hiding voice messages in AI-generated artwork**.

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Next.js 14 Frontend             │
│  (React 18 + TypeScript + Tailwind)     │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │   ZKP    │  │ AI Art   │  │ Stego │ │
│  │ Theater  │  │  Vault   │  │  Lab  │ │
│  └──────────┘  └──────────┘  └───────┘ │
└─────────────────────────────────────────┘
                   │
                   ├─── API Routes (Next.js)
                   │
┌──────────────────┴──────────────────────┐
│     Python FastAPI Microservice         │
│  (LSB Steganography Engine)             │
│                                         │
│  /encode - Hide audio in images         │
│  /decode - Extract audio from images    │
│  /capacity - Calculate image capacity   │
└─────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│        External Services                │
│  - Hugging Face (Stable Diffusion)      │
│  - Vercel (Frontend Hosting)            │
│  - Railway/Fly.io (Backend Hosting)     │
└─────────────────────────────────────────┘
```

## 🚀 Features

### 1. ZKP Login Theater
Interactive split-screen demonstration showing:
- **Client Side**: Live proof generation console
- **Server Side**: What the server receives (no password!)
- **Mode Toggle**: Compare traditional vs ZKP authentication
- **Educational Tooltips**: Explains each step

### 2. AI Art Voice Vault
Generate AI artwork with hidden audio messages:
- **Audio Recording**: Web Audio API with waveform visualization
- **AI Generation**: 5 artistic styles (Photorealistic, Anime, Abstract, Oil Painting, Cyberpunk)
- **Steganography**: LSB encoding to hide audio in images
- **Rate Limiting**: 5 generations per session (free tier)

### 3. Steganography Playground (Future)
Educational demo showing pixel-level LSB operations

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2 | React framework with App Router |
| React | 18.3 | UI library |
| TypeScript | 5.5 | Type safety |
| Tailwind CSS | 3.4 | Styling |
| shadcn/ui | Latest | Component library |
| snarkjs | 0.7.3 | Zero-Knowledge Proofs |
| Lucide React | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Steganography service |
| FastAPI | 0.115 | High-performance API |
| Pillow | 11.0 | Image processing |
| NumPy | 2.1.3 | Numerical operations |
| Uvicorn | 0.32 | ASGI server |

### External Services
- **Hugging Face Inference API**: AI image generation (Free tier: 1000/month)
- **Vercel**: Frontend deployment
- **Railway/Fly.io**: Python backend deployment

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/zypher.git
cd zypher

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Hugging Face API token
echo "HUGGING_FACE_TOKEN=your_token_here" >> .env
echo "NEXT_PUBLIC_PYTHON_API=http://localhost:8000" >> .env

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python -m app.main
```

Backend API will be available at `http://localhost:8000`

## 🎨 Project Structure

```
zypher/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── zkp-theater/       # ZKP demo page
│   └── ai-art-vault/      # AI Art demo page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── progress.tsx
│   └── ... # Feature components
├── lib/                   # Utility functions
│   └── utils.ts          # Tailwind cn() helper
├── public/               # Static assets
│   └── zkp/             # ZKP circuit files
├── backend/              # Python microservice
│   ├── app/
│   │   ├── main.py       # FastAPI app
│   │   └── steganography.py  # LSB algorithm
│   └── requirements.txt
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔐 Environment Variables

### Frontend (.env)
```bash
HUGGING_FACE_TOKEN=your_hf_token_here
NEXT_PUBLIC_PYTHON_API=http://localhost:8000
```

### Backend
```bash
CORS_ORIGINS=http://localhost:3000,https://*.vercel.app
```

## 🧪 Development

### Run Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

### Run Backend
```bash
# Development
python -m app.main

# Production (with uvicorn)
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📊 Implementation Progress

### Phase 1: Foundation ✅ COMPLETED
- [x] Next.js setup with TypeScript
- [x] Tailwind CSS + shadcn/ui configuration
- [x] Core dependencies (snarkjs, Hugging Face SDK)
- [x] Python FastAPI structure
- [x] LSB steganography algorithm
- [x] Git repository initialization
- [x] Basic landing page

### Phase 2: ZKP Login Theater 🚧 IN PROGRESS
- [ ] ZKP circuit files
- [ ] Proof generation UI
- [ ] Split-screen layout
- [ ] Console output component
- [ ] Server view display
- [ ] Mode toggle
- [ ] Verification API
- [ ] Educational tooltips

### Phase 3-8: Remaining Phases
See [Design Document](./Zypher%20-%20Design%20Document.md) for full roadmap

## 🎯 Key Features Implemented

### LSB Steganography Algorithm
- **Metadata Storage**: First pixel stores framerate and sample count
- **Audio Encoding**: 16-bit samples split across R+G channels
- **Blue Channel Preservation**: Maintains visual quality
- **Capacity Calculation**: Automatic validation of image capacity
- **Lossless Encoding**: Perfect audio reconstruction

### API Endpoints

#### POST /encode
Embed audio into image
```bash
curl -X POST http://localhost:8000/encode \
  -F "audio=@voice.wav" \
  -F "image=@artwork.png" \
  -o encoded.png
```

#### POST /decode
Extract audio from image
```bash
curl -X POST http://localhost:8000/decode \
  -F "image=@encoded.png" \
  -o decoded.wav
```

#### POST /capacity
Calculate image capacity
```bash
curl -X POST http://localhost:8000/capacity \
  -H "Content-Type: application/json" \
  -d '{"width": 1024, "height": 1024}'
```

## 🔒 Security Features

- ✅ Input validation (file types, sizes)
- ✅ CORS configuration
- ✅ Rate limiting (planned)
- ✅ No sensitive data logging
- ✅ Environment variable protection
- ✅ Secure headers (CSP, HSTS) - planned

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm i -g vercel
vercel --prod
```

### Backend (Railway)
```bash
railway init
railway up
```

See [Deployment Guide](./docs/deployment.md) for detailed instructions.

## 📝 API Documentation

FastAPI provides automatic interactive docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🧪 Testing

```bash
# Frontend tests (coming soon)
npm test

# Backend tests (coming soon)
pytest backend/tests/
```

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👤 Author

**Kartikey Sankhdher**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

## 🙏 Acknowledgments

- [snarkjs](https://github.com/iden3/snarkjs) - Zero-Knowledge Proof library
- [Hugging Face](https://huggingface.co/) - AI model hosting
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework

## 📚 Resources

- [ZKP Introduction](https://zkp.science/)
- [LSB Steganography](https://en.wikipedia.org/wiki/Steganography)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Circom](https://docs.circom.io/) - ZKP circuit compiler

## 🗺️ Roadmap

- [ ] Complete ZKP Theater demo
- [ ] Implement AI Art integration
- [ ] Add audio recording
- [ ] Deploy to production
- [ ] Add user authentication
- [ ] Implement message history
- [ ] Mobile app (React Native)
- [ ] Blockchain integration (NFT minting)

---

**Status**: Active Development | **Version**: 1.0.0 | **Last Updated**: November 2025
