# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Doongzi Frontend** is a React 18 + TypeScript + Vite SPA designed to provide rental contract guidance for first-time renters in Korea. The application integrates with n8n webhooks for backend logic and features AI chatbot assistance, document scanning with OCR analysis, interactive checklists, and legal search capabilities.

**Original Design:** [Figma Design System](https://www.figma.com/design/5oMZr5SeUiLB5PidceZuco/Design-Initial-Structure)

## Essential Commands

### Development
```bash
npm i              # Install dependencies
npm run dev        # Start Vite dev server (http://localhost:3000)
npm run build      # Production build (outputs to ./build)
```

**Note:** No linting or test commands currently configured. The project uses TypeScript strict mode for type safety.

## Application Architecture

### Core Structure
- **Single-Page Application** with React Router for client-side routing
- **6 Main Pages:** HomePage, ChatbotPage, ChecklistPage, SearchPage, ScanPage, MyPage
- **Service-Based API Layer** with actionType-based routing for n8n webhook integration
- **Component Library:** 50+ reusable Radix UI components wrapped with Tailwind CSS

### Directory Structure

**Standard React Vite Layout:**
```
root/
├── index.html              # Vite entry point
├── index.css               # Merged Tailwind + custom CSS
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
│
├── src/
│   ├── main.tsx            # React app entry (createRoot)
│   ├── App.tsx             # Root component with routing
│   │
│   ├── api/                # Service-based API modules
│   │   ├── index.ts        # Axios HTTP client with interceptors
│   │   ├── chatbot.ts      # Chat & legal search
│   │   ├── scan.ts         # Document analysis
│   │   ├── checklist.ts    # Risk analysis, PDF, email
│   │   └── legal.ts        # Legal search
│   │
│   ├── pages/              # Page-level components (6 routes)
│   │   ├── HomePage.tsx
│   │   ├── ChatbotPage.tsx
│   │   ├── ChecklistPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── ScanPage.tsx
│   │   └── MyPage.tsx
│   │
│   ├── components/         # Reusable components
│   │   ├── common/         # App-specific components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── FloatingChatButton.tsx
│   │   │   ├── FloatingChatWidget.tsx
│   │   │   └── GlobalNav.tsx
│   │   ├── ui/             # 50+ Radix UI component wrappers
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ... (40+ other components)
│   │   └── figma/          # Figma integration components
│   │       └── ImageWithFallback.tsx
│   │
│   ├── types/              # TypeScript definitions
│   │   └── index.ts        # API response types, enums, interfaces
│   │
│   ├── config/             # Configuration
│   │   └── env.ts          # Environment variable validation
│   │
│   └── guidelines/         # Design documentation
```

## API Integration Patterns

### Three n8n Webhook Endpoints

All API calls use **actionType-based routing** where the server-side n8n Switch node routes requests:

1. **CHATBOT:** Chat messages and legal search
   - `sendMessage` - AI chatbot conversation
   - `searchLegal` - Legal case/statute search

2. **SCAN:** Document analysis with OCR
   - `analyzeDocuments` - Multi-file contract analysis and checklist auto-fill
   - `deepAnalyzeContract` - Toxic clause detection (detailed diagnosis)

3. **CHECKLIST:** Risk analysis, exports, and utilities
   - `analyzeRisk` - Jjaltjuk (empty lease) deposit ratio analysis
   - `exportPDF` - Generate checklist PDF
   - `sendEmail` - Email checklist report
   - `checkInsurance` - Property insurance verification
   - `issueRegistry` - Registry lookup

### HTTP Client Setup
- **File:** `src/api/index.ts`
- **Timeout:** 30 seconds (document analysis may require longer processing)
- **Interceptors:** Request/response logging for debugging
- **Error Handling:** Graceful fallback responses when API fails

### Environment Variables (.env)
```
VITE_N8N_CHATBOT_WEBHOOK_URL=<n8n webhook URL>
VITE_N8N_SCAN_WEBHOOK_URL=<n8n webhook URL>
VITE_N8N_CHECKLIST_WEBHOOK_URL=<n8n webhook URL>
VITE_N8N_LEGAL_WEBHOOK_URL=<n8n webhook URL>
```

Validation happens at `src/config/env.ts` - missing variables will throw errors at runtime.

## Key Architecture Patterns

### 1. Radix UI + Tailwind CSS
All UI components are **unstyled Radix primitives** wrapped with Tailwind classes. This pattern provides:
- Accessibility out-of-the-box (ARIA, keyboard navigation)
- Full design flexibility via Tailwind utilities
- Type-safe component composition with `className={cn(...)}` helper

**Pattern Example:**
```typescript
// src/components/ui/button.tsx
import * as RadixButton from "@radix-ui/react-primitive";
import { cn } from "..."; // CVA/tailwind-merge helper

export const Button = ({ className, ...props }) => (
  <RadixButton.Root className={cn("px-4 py-2 bg-green-500", className)} {...props} />
);
```

### 2. Service-Based API Modules
Each API module organizes related functions:
```typescript
export const chatbotAPI = {
  sendMessage: async (query, conversationId) => { /* actionType: "sendMessage" */ },
  searchLegal: async (query, category) => { /* actionType: "searchLegal" */ },
};
```

All modules follow consistent error handling with fallback mock responses for development.

### 3. Type-Safe API Responses
**File:** `src/types/index.ts` defines all response types:
- `ChatResponse` - Chatbot and legal search responses
- `ScanResponse` - Document analysis with riskGrade and autoCheckItems
- `ChecklistResponse` - Checklist utilities responses
- Enums: `RiskGrade` ('low'|'medium'|'high'), `ActionType`, `IssueSeverity`

Always import and use these types for axios calls.

### 4. Hierarchical Checklist Structure
**File:** `ChecklistPage.tsx` implements:
- 3 tabs: "계약 전" (before), "계약 중" (during), "계약 후" (after)
- Nested items with sub-checklist items
- Action buttons for deepAnalyzeContract, risk analysis, PDF export
- Automatic completion from `analyzeDocuments` via `autoCheckItems` mapping

### 5. Modal-Based File Upload (HomePage)
3-step wizard for document scanning:
1. Upload step - Drag-and-drop file selection
2. Email step - Collect user email
3. Complete step - Success confirmation

State managed via `uploadStep: 'upload' | 'email' | 'complete'`

## Build Configuration

### Vite Setup (`vite.config.ts`)
- **Plugin:** `@vitejs/plugin-react` (SWC compiler for speed)
- **Path Alias:** `@` → `./src` (use for absolute imports)
- **Build Target:** ESNext (for modern browsers)
- **Output:** `./build` directory
- **Dev Port:** 3000 (auto-opens in browser)

### TypeScript Configuration (`tsconfig.json`)
- **Target:** ES2020
- **Strict Mode:** Enabled (noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch)
- **JSX:** react-jsx (automatic runtime, no React import needed)
- **Module Resolution:** bundler

## Styling System

### CSS Variables (merged into `index.css`)
Global color, spacing, and shadow tokens used throughout:
```css
--color-bg-primary: #FAF8F3;          /* Warm background */
--color-accent-green: #8FBF4D;        /* Primary accent */
--color-text-primary: #2C2C2C;        /* Text color */
--spacing-xs/md/lg: 4px/16px/24px;    /* Spacing scale */
--radius-sm/lg: 8px/16px;             /* Border radius */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
```

### Tailwind CSS 4.1.3
- Imported via `@import` directive in globals.css
- CSS variables override Tailwind defaults
- Responsive utilities with mobile-first breakpoints
- Class composition using `class-variance-authority` (CVA) and `tailwind-merge`

## Dependencies Overview

### Core Framework
- React 18.3.1, Vite 6.3.5, TypeScript

### Routing & Forms
- React Router DOM (*) - 6 pages with client-side routing
- React Hook Form 7.55.0 - Form state management

### UI Components
- Radix UI (20+ packages) - Accessible component primitives
- Lucide React 0.487.0 - Icon library
- Recharts 2.15.2 - Charting/data visualization
- Sonner 2.0.3 - Toast notifications
- Other: input-otp, date-picker, carousel, resizable-panels, cmdk, drawer

### Styling
- Tailwind CSS 4.1.3, CVA 0.7.1, tailwind-merge (*), Next Themes 0.4.6

### API & HTTP
- Axios (*) - HTTP client with interceptors
- n8n Webhooks - Backend integration

## Common Development Tasks

### Adding a New API Function
1. Create function in appropriate service file (e.g., `src/api/chatbot.ts`)
2. Include `actionType` in request payload
3. Import and use response types from `src/types/index.ts`
4. Add try-catch with graceful fallback response
5. Update environment variables if new webhook is needed

**Example:**
```typescript
export const chatbotAPI = {
  newFunction: async (param) => {
    try {
      const { data } = await apiClient.post<NewResponse>(env.chatbotWebhookUrl, {
        actionType: "newAction",
        param,
      });
      return data;
    } catch (error) {
      return { success: false, error: "Fallback error message" };
    }
  },
};
```

### Creating a New Page
1. Create component in `src/pages/NewPage.tsx`
2. Add route to `src/App.tsx` router configuration
3. Add navigation link to `src/components/common/Navigation.tsx`
4. Use shared components (Header, Navigation) for consistency
5. Import UI components from `src/components/ui/`

### Modifying UI Components
- Edit existing component in `src/components/ui/`
- Components use Radix UI primitives wrapped with Tailwind CSS classes
- Use `cn()` helper (from CVA/tailwind-merge) for conditional classes
- Ensure TypeScript types for props are complete

## Type Safety

**Important:** This project uses TypeScript strict mode. Always:
- Define return types for async functions
- Use imported types from `src/types/index.ts` for API responses
- Type component props explicitly
- Avoid `any` types - use generics if needed

## Configuration & Deployment

### Build for Production
```bash
npm run build
```
Outputs optimized code to `./build` directory. Served as static files.

### Environment Validation
All webhook URLs are validated at runtime in `src/config/env.ts`. Missing variables will throw errors on app load - catch these early during development.

## Design System & Branding

**Theme:** Warm, approachable design for first-time renters
- **Primary Color:** Green (#8FBF4D) - trust and growth
- **Background:** Warm off-white (#FAF8F3)
- **Metaphor:** Bird themes ("둥지" = nest, "어미새" = mother bird, "아기새" = baby bird)

CSS variables in globals.css maintain consistency across the application.

## Testing & Quality

- **TypeScript Strict Mode:** Catches type errors before runtime
- **Vite Dev Server:** Fast HMR (Hot Module Replacement) for development
- **No unit/integration tests configured** - consider adding Jest/Vitest if needed

## Integration Checklist

Before deploying, ensure:
- [ ] All 3 n8n webhook URLs are set in `.env`
- [ ] Webhook payloads match API_USAGE.md specifications
- [ ] ActionType values are consistent between frontend and n8n backend
- [ ] Document upload accepts PDF, JPG, PNG formats
- [ ] API timeout is sufficient for document analysis (currently 30s)
- [ ] Error fallback responses provide user-friendly messages

## Resources

- **API Documentation:** See `API_USAGE.md` for detailed request/response specs
- **Figma Design:** https://www.figma.com/design/5oMZr5SeUiLB5PidceZuco/Design-Initial-Structure
- **n8n Integration:** Backend uses actionType-based routing in webhook handlers
