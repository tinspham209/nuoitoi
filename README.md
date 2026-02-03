# Nuôi Tôi - Transparent Donation Platform

A transparent donation tracking platform built with React, Tailwind CSS, and VietQR API integration.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Available Scripts

- `pnpm dev` - Start development server (port 5173)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run Biome linter
- `pnpm lint:fix` - Fix linting issues automatically
- `pnpm format` - Format code with Biome
- `pnpm format:check` - Check code formatting without changes
- `pnpm check` - Run all Biome checks (lint + format)
- `pnpm type-check` - Type-check with TypeScript
- `pnpm test:e2e` - Run Playwright E2E tests
- `pnpm test:e2e:debug` - Debug E2E tests
- `pnpm test:e2e:ui` - Run E2E tests with UI

## 📦 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Yup validation
- **Build Tool**: rsbuild (Rust-based)
- **Code Quality**: Biome (all-in-one linter + formatter)
- **Testing**: Playwright for E2E tests
- **i18n**: i18next (Vietnamese & English)
- **QR Code**: qrcode library + VietQR API

## 🎨 Code Quality with Biome

This project uses **Biome** as a unified toolchain for linting and formatting. Biome replaces both ESLint and Prettier with a single, fast Rust-based tool.

### Configuration

Biome configuration is defined in `biome.json`:

- **Formatter**: Tab indentation (width 2), 88-char line width, LF line endings
- **Linter**: Recommended rules with strict correctness and style checks
- **Import Organization**: Automatic import sorting and deduplication
- **JavaScript**: Always semicolons, arrow parentheses

### Running Biome

```bash
# Check and report issues
pnpm lint

# Fix issues automatically (linting)
pnpm lint:fix

# Format code
pnpm format

# Check formatting without changes
pnpm format:check

# Run all checks (lint + format)
pnpm check
```

### IDE Integration

**VS Code**: Install the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

Add to `.vscode/settings.json`:
```json
{
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  }
}
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   └── common/         # Header, Hero, Reasons, Stats, DonationForm
├── pages/              # Page components (Home)
├── services/           # API clients (VietQR)
├── store/              # Zustand stores (donation)
├── hooks/              # Custom React hooks
├── types/              # TypeScript interfaces
├── utils/              # Utilities (validation schemas)
├── styles/             # Global CSS
├── i18n/               # Internationalization
│   ├── locales/        # Translation files (en.json, vi.json)
│   └── index.ts        # i18n configuration
├── App.tsx             # Root component
└── index.tsx           # Entry point
```

## 🌍 Internationalization

The app supports Vietnamese (vi) and English (en) with dynamic locale switching.

### Adding Translations

1. Update `src/i18n/locales/en.json` and `src/i18n/locales/vi.json`
2. Use translations in components: `const { t } = useTranslation(); t('key')`

### Changing Language

Use the language switcher in the Header component, which persists selection to localStorage.

## 💳 VietQR Integration

The app integrates with VietQR API for generating bank transfer QR codes.

### Configuration

Set `VITE_VIETQR_API_URL` in `.env`:
```
VITE_VIETQR_API_URL=https://api.vietqr.io/v1
```

### Usage

```typescript
import { vietqrService } from '@/services/vietqr';

const qrData = await vietqrService.generateQR({
  bankCode: 'ACB',
  accountNumber: '123456789',
  amount: 100000,
});
```

## 📝 Form Validation

Forms use React Hook Form with Yup validation:

```typescript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { donationFormSchema } from '@/utils/validation';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(donationFormSchema),
});
```

## 🧪 Testing

### E2E Tests with Playwright

```bash
# Run all tests
pnpm test:e2e

# Run tests in debug mode
pnpm test:e2e:debug

# Run tests with UI
pnpm test:e2e:ui
```

Test files are located in `tests/e2e/` directory.

## 🚀 Production Build

```bash
# Build for production
pnpm build

# Preview the build locally
pnpm preview
```

The build output is in the `dist/` directory, optimized with code splitting and CSS purging.

## 🔒 Environment Variables

Copy `.env.example` to `.env.local` and update values:

```bash
cp .env.example .env.local
```

Available variables:
- `VITE_VIETQR_API_URL` - VietQR API base URL

## 📚 References

- [Biome Documentation](https://biomejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Yup Validation](https://github.com/jquense/yup)
- [Zustand](https://github.com/pmndrs/zustand)
- [VietQR API](https://api.vietqr.io)
- [rsbuild](https://rsbuild.dev)
- [Playwright](https://playwright.dev)

## 📄 License

MIT
