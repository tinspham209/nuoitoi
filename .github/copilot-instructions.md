# GitHub Copilot Instructions

## Project Overview

This is a frontend-only Single Page Application (SPA) built with modern web technologies. The app focuses on QR code generation and integration with the VietQR API.

**Key Characteristics:**

- Frontend-only SPA (no backend)
- React 18 + TypeScript with strict mode
- Component-driven architecture with shadcn/ui
- State management with Zustand for global donation state
- Form validation with React Hook Form + Yup
- Bilingual support (Vietnamese + English) with i18next
- Code quality with Biome (unified linter + formatter)
- VietQR API integration for bank transfer QR codes

## Technology Stack

### Build & Runtime

- **Build Tool**: rsbuild ^1.7.3 - Fast and efficient Rust-based bundler
- **Package Manager**: pnpm >= 8.0.0 - Fast, disk space efficient package manager
- **Runtime**: React ^18.2.0 with TypeScript ^5.3.3
- **Node Version**: >= 18.0.0

### UI & Styling

- **Component Library**: shadcn/ui ^0.8.0 - Copy-paste component collection built on Radix UI
- **Styling**: Tailwind CSS ^4.0.0 - Utility-first CSS framework with container queries
- **Styling Approach**: Use shadcn/ui components with Tailwind CSS utilities only (no Mantine)

### State Management & Forms

- **Store**: Zustand ^4.4.1 - Lightweight state management
- **Pattern**: Hooks-based, minimal boilerplate
- **Form Handling**: react-hook-form ^7.48.0 - Performant form library
- **Validation**: yup ^1.3.3 + @hookform/resolvers ^3.3.4 - Schema-based validation

### Internationalization (i18n)

- **i18n Library**: i18next ^23.7.6 with react-i18next ^13.5.0
- **Supported Languages**: Vietnamese (vi) and English (en)
- **Locale Files**: JSON files in `src/i18n/locales/`
- **Language Persistence**: localStorage stores user language preference

### Features

- **QR Code Generation**: qrcode ^1.5.3 library for local QR code rendering
- **VietQR API Integration**: Payment QR code generation and parsing
- **Service Workers**: Workbox ^7.0.0 for PWA capabilities, offline support, caching

### Code Quality

- **Linting & Formatting**: Biome ^2.3.13 - Unified Rust-based toolchain (replaces ESLint + Prettier)
- **Configuration**: `biome.json` with recommended rules, automatic import organization
- **IDE Integration**: Biome VS Code extension for real-time feedback

### Testing

- **E2E Testing**: Playwright ^1.40.1 - Modern browser automation and testing framework

## File Structure

```
src/
├── components/
│   ├── ui/             # shadcn/ui components (Button, Dialog, etc.)
│   ├── common/         # Shared components (Header, Hero, Reasons, Stats, DonationForm)
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── i18n/
│   ├── index.ts        # i18next initialization
│   └── locales/
│       ├── vi.json     # Vietnamese translations
│       └── en.json     # English translations
├── pages/              # Page components (Home.tsx)
├── services/
│   └── vietqr.ts       # VietQR API integration
├── store/
│   └── donation.ts     # Zustand store for donation state
├── styles/             # Global CSS/SCSS
├── types/
│   └── index.ts        # TypeScript interfaces (Bank, QRGenerateRequest, etc.)
├── utils/
│   └── validation.ts   # Yup validation schemas
├── App.tsx             # Root component with i18n provider
└── index.tsx           # React entry point

tests/
└── e2e/                # Playwright E2E tests

public/
├── manifest.json       # PWA manifest
└── service-worker.ts   # Service worker entry
```

## Coding Standards

### TypeScript

- Use strict mode enabled in tsconfig
- Always define types for props and state
- Avoid `any` type - use proper typing or `unknown`
- Use interfaces for component props

### React Component Patterns

**Functional Components with Hooks:**

```typescript
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  return <div>{title}</div>;
};
```

**Component Naming:**

- Use PascalCase for component files and exports
- One component per file (unless very small related components)
- Use `.tsx` extension for React components

### Zustand Store Patterns

**Store Structure:**

```typescript
import { create } from "zustand";

interface DonationState {
	selectedBankCode: string;
	setSelectedBank: (code: string) => void;
	qrCode: string | null;
	setQRCode: (code: string | null) => void;
	isGeneratingQR: boolean;
	setIsGeneratingQR: (loading: boolean) => void;
}

export const useDonationStore = create<DonationState>((set) => ({
	selectedBankCode: "",
	setSelectedBank: (code) => set({ selectedBankCode: code }),
	qrCode: null,
	setQRCode: (code) => set({ qrCode: code }),
	isGeneratingQR: false,
	setIsGeneratingQR: (loading) => set({ isGeneratingQR: loading }),
}));
```

**Store Organization:**

- One store per domain/feature (e.g., `donation.ts`)
- Keep stores focused and minimal - only donation-related state
- Use selectors to access specific state: `useDonationStore((state) => state.qrCode)`
- Store location: `src/store/`

### Styling Guidelines

**Tailwind CSS v4:**

- Use Tailwind classes for layout and spacing
- Leverage container queries: `@container`, responsive prefixes: `md:`, `lg:`, etc.
- Use CSS variables for theming (Tailwind handles via config)
- Never use inline styles - always use Tailwind utilities

**shadcn/ui + Tailwind (Recommended):**

- Use shadcn/ui components for all UI elements
- Extend and customize using Tailwind CSS classes via `className` prop
- Leverage shadcn/ui's design tokens with Tailwind utilities
- Do NOT use Mantine UI - use only shadcn/ui

**Form Styling Example:**

```typescript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(mySchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('field')} className="w-full rounded border p-2" />
      {errors.field && <span className="text-red-600">{errors.field.message}</span>}
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
};
```

**Component Example:**

```typescript
import { Button } from '@/components/ui/button';

export const MyButton = () => (
  <div className="flex gap-2">
    <Button className="hover:shadow-lg">Click me</Button>
  </div>
);
```

## API Integration

### VietQR Service

**Location:** `src/services/vietqr.ts`

**Available Methods:**

- `getBanks()` - Fetch list of supported banks
- `generateQR(request)` - Generate payment QR code
- `getPaymentLink(request)` - Get VietQR payment link

**Usage Pattern:**

```typescript
import { vietqrService } from "@/services/vietqr";
import { useDonationStore } from "@/store/donation";

const onSubmit = async (data) => {
	try {
		const setIsGeneratingQR = useDonationStore(
			(state) => state.setIsGeneratingQR,
		);
		const setQRCode = useDonationStore((state) => state.setQRCode);

		setIsGeneratingQR(true);
		const result = await vietqrService.generateQR({
			bankCode: data.bankCode,
			accountNumber: data.accountNumber,
			amount: data.amount,
		});

		if (result.error) {
			throw new Error(result.message);
		}
		setQRCode(result.qrDataURL);
	} catch (error) {
		console.error("QR generation failed:", error);
	} finally {
		setIsGeneratingQR(false);
	}
};
```

**Error Handling:**

- Always wrap API calls in try-catch
- Check `result.error` flag from VietQR API responses
- Provide user-friendly error messages via UI
- Log errors to console for debugging
- Set error state in Zustand store for UI display

### Fetch & HTTP

- Use native `fetch` API (no additional HTTP library needed)
- Add proper error handling for network failures
- Use environment variables for API URLs: `VITE_VIETQR_API_URL`

## State Management

**Store Usage (Selector Pattern):**

```typescript
// In component - select only what you need
const qrCode = useDonationStore((state) => state.qrCode);
const isGeneratingQR = useDonationStore((state) => state.isGeneratingQR);
const setQRCode = useDonationStore((state) => state.setQRCode);
```

**Best Practices:**

- Select only needed state (avoid whole store reference)
- Each selector call is independent - call separately for different values
- Keep mutations simple and direct in action methods
- Store location: `src/store/` with one file per domain
- Use TypeScript interfaces for state shape
- Initialize all state values (no `undefined` defaults)

**Anti-Patterns (Don't Do):**

```typescript
// ❌ Wrong - using whole store
const store = useDonationStore();
const qr = store.qrCode; // Causes re-render on any state change

// ❌ Wrong - inline store in render
return <div>{useDonationStore().qrCode}</div>; // Multiple subscriptions
```

## Form Validation with React Hook Form + Yup

**Validation Schema:**

**Location:** `src/utils/validation.ts`

```typescript
import * as yup from "yup";

export const donationFormSchema = yup.object({
	bankCode: yup.string().required("Bank code is required"),
	accountNumber: yup.string().required("Account number is required").min(10),
	amount: yup.number().required("Amount is required").min(1000),
});

export type DonationFormData = yup.InferType<typeof donationFormSchema>;
```

**Usage in Components:**

```typescript
const {
	register,
	handleSubmit,
	formState: { errors },
} = useForm<DonationFormData>({
	resolver: yupResolver(donationFormSchema),
	defaultValues: { bankCode: "", accountNumber: "", amount: 50000 },
});
```

**Best Practices:**

- Define all schemas in `src/utils/validation.ts`
- Use `yup.InferType` to generate TypeScript types from schemas
- Keep validation logic separate from components
- Display error messages from `formState.errors`
- Use `watch()` hook to track field values in real-time

## Internationalization (i18n)

**Configuration:** `src/i18n/index.ts`

**Locale Files:** `src/i18n/locales/{language}.json`

**Usage in Components:**

```typescript
import { useTranslation } from 'react-i18next';

export const MyComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('key.path')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
      <button onClick={() => i18n.changeLanguage('vi')}>Tiếng Việt</button>
    </div>
  );
};
```

**Best Practices:**

- Keep all text strings in locale JSON files
- Use dot notation for nested keys: `"home.title"`, `"form.errors.required"`
- Always provide translations for both vi.json and en.json
- Language preference stored in localStorage automatically
- Initialize i18n in `src/App.tsx` with `<I18nextProvider>`

## Service Worker & Workbox

**PWA Features:**

- Service worker caching strategies for assets (via Workbox)
- Offline support (if needed)
- Network-first or cache-first strategies

**Configuration:** Located in rsbuild config or service worker entry

## Code Quality with Biome

**Configuration:** `biome.json`

**Version:** ^2.3.13

**Features:**

- Unified linter + formatter (replaces ESLint + Prettier)
- Automatic import organization
- Rules: recommended preset covering correctness, style, suspicious, a11y
- Formatter: tabs (width 2), 88-char line width, LF line endings, always semicolons

**Commands:**

```bash
pnpm lint           # Check linting issues
pnpm lint:fix       # Fix linting issues
pnpm format         # Format code
pnpm format:check   # Check formatting
pnpm check          # Run all checks
```

**IDE Integration:** Install Biome VS Code extension for real-time feedback

**Best Practices:**

- Run `pnpm check` before committing code
- Use Biome formatter instead of manual formatting
- Keep `biome.json` in sync with version in `package.json`

## Environment Variables

**`.env.example` template:**

```
VITE_VIETQR_API_URL=https://api.vietqr.io/api
```

**Best Practices:**

- Prefix frontend variables with `VITE_`
- Never commit `.env` files with secrets
- Document all required variables in `.env.example`
- Development environment uses default VietQR API
- Access variables in code: `import.meta.env.VITE_VIETQR_API_URL`

## Common Tasks

### Adding a New Component

1. Create file in `src/components/common/` (shared) or `src/components/features/` (specific)
2. Define TypeScript interface for props using `React.FC<Props>`
3. Use React Hook Form + yup for forms (not uncontrolled inputs)
4. Use Zustand store for global state (donations)
5. Use `useTranslation()` hook for all text strings
6. Apply Tailwind CSS classes for styling
7. Export functional component as default if single file

**Component Template:**

```typescript
import type React from 'react';
import { useTranslation } from 'react-i18next';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button onClick={onAction} className="rounded bg-green-600 px-4 py-2 text-white">
        {t('button.label')}
      </button>
    </div>
  );
};
```

### Adding a New Store

1. Create file in `src/store/{domain}.ts`
2. Define TypeScript interface for state shape
3. Create store with `create<StateInterface>` hook
4. Export store hook (e.g., `useDonationStore`)
5. Keep store focused on one domain

### Adding Form Validation

1. Add schema to `src/utils/validation.ts` using yup
2. Use `yup.InferType` to generate TypeScript type
3. Integrate with `useForm` using `yupResolver`
4. Display errors from `formState.errors`
5. Use `watch()` for real-time validation feedback

### Integrating VietQR API

1. Add method to `src/services/vietqr.ts`
2. Check `result.error` flag in response
3. Use Zustand store to save QR result (e.g., `setQRCode`)
4. Wrap in try-catch with proper error handling
5. Provide loading state via `isGeneratingQR` in store
6. Display user-friendly error messages via i18n

### Adding New Translations

1. Add key-value pairs to `src/i18n/locales/vi.json`
2. Add corresponding translations to `src/i18n/locales/en.json`
3. Use in component: `const text = t('section.key');`
4. Use dot notation for nested structures
5. Keep keys organized by feature/section

### Adding Tailwind Styles

1. Add classes to component `className` attribute
2. Use responsive prefixes: `md:`, `lg:`, etc.
3. Use Tailwind v4 features like `@container` if needed
4. Never use inline styles - always use Tailwind utilities
5. Avoid creating custom CSS - Tailwind covers most cases
6. Use shadcn/ui components with className overrides instead of custom components

## Performance & Best Practices

- **Code Splitting**: Lazy load pages with React.lazy
- **Component Memoization**: Use `memo` for expensive renders
- **Image Optimization**: Optimize and compress images
- **Bundle Size**: Monitor with rsbuild's analysis tools
- **Accessibility**: Include ARIA labels and semantic HTML
- **Testing**: Write tests for stores and utilities and E2E flows with Playwright

## Debugging Tips

1. **Zustand DevTools**: Install browser extension for state inspection
2. **React DevTools**: Browser extension for component inspection and profiling
3. **Network Tab**: Check VietQR API requests and responses
4. **Form Validation**: Check `console.log(formState.errors)` for validation messages
5. **i18n**: Use `i18n.language` to check current language, check locale JSON for missing keys
6. **Biome**: Run `pnpm lint` to catch linting issues before runtime
7. **Service Worker**: Chrome DevTools → Application → Service Workers tab
8. **Console**: Use structured logging, avoid console.log spam
9. **TypeScript**: Run `pnpm type-check` to catch type errors

## Common Patterns to Follow

- **Hooks**: Use custom hooks to encapsulate logic (e.g., `useForm` from react-hook-form)
- **Components**: Keep focused and single-responsibility (e.g., DonationForm, Stats)
- **Composition**: Use component composition over prop drilling
- **State**: Use Zustand for global state, React state for component-local state
- **Validation**: Always validate forms with yup + React Hook Form, not inline
- **Styling**: Leverage shadcn/ui's design system with Tailwind utilities
- **i18n**: All user-facing text in locale files, never hardcoded strings
- **Error Handling**: Try-catch for API calls, user-friendly messages via i18n
- **Loading States**: Use boolean flags in Zustand store (e.g., `isGeneratingQR`)
- **Type Safety**: Use TypeScript strict mode, avoid `any` type
- **Formatting**: Use Biome automatically, no manual formatting
- **Comments**: Document complex business logic, not obvious code

## Important Notes

- **No Backend**: All external data comes from VietQR API only (no custom backend)
- **Client-Side Only**: All state is in-memory (Zustand) or localStorage (i18n language pref)
- **Single SPA**: Uses React Router for navigation (if added later)
- **PWA Capable**: Workbox service worker handles caching and offline support
- **Responsive Design**: Test on mobile, tablet, and desktop using Tailwind breakpoints
- **Accessibility**: Follow WCAG guidelines, use semantic HTML, ARIA labels
- **VietQR Only**: No BuyMeACoffee or other payment methods
- **Bilingual**: All text must be in both Vietnamese and English (vi.json + en.json)
- **Form Validation**: Always use Yup schemas, validate before API calls
- **No Mantine**: Use only shadcn/ui + Tailwind, never use Mantine UI
- **Code Quality**: Run `pnpm check` before commits to ensure Biome compliance
- **Testing**: Use Playwright for E2E tests, write tests for critical flows

## References

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [rsbuild Documentation](https://rsbuild.dev)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Playwright Documentation](https://playwright.dev)
