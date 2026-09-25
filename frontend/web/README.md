# ChatFiles — Frontend


## Stack

- **React 18** + **Vite** — build tooling
- **React Router v6** — routing, protected/public route guards
- **Tailwind CSS** — styling (dark theme, matches the product's visual identity)
- **Axios** — centralized API client with access/refresh token handling
- **lucide-react** — icon set

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL to your backend
npm run dev             # http://localhost:5173
```

```bash
npm run build            # production build -> dist/
npm run preview          # preview the production build locally
npm run lint             # eslint
```

## Web Folder structure

```
src/
├── api/                 # Centralized API client + one module per resource
│   ├── client.js         # axios instance, auth header + refresh-token interceptor
│   ├── authApi.js
│   ├── projectApi.js
│   ├── sourceApi.js      # file/url upload, processing status polling
│   ├── conversationApi.js
│   ├── chatApi.js        # streaming (fetch/SSE) + non-streaming fallback
│   └── userApi.js
│
├── context/              # React context providers (app-wide state)
│   ├── AuthContext.jsx    # auth state machine: unknown/checking/authenticated/unauthenticated
│   ├── ToastContext.jsx
│   ├── ProjectContext.jsx     # current project + its sources/conversations
│   └── ProjectListContext.jsx # the user's full project list (sidebar + dashboard)
│
├── hooks/                # useAuth, useToast, useProject, useProjectList, useDebounce, useClickOutside
│
├── components/
│   ├── auth/              # ProtectedRoute, PublicOnlyRoute, AuthLayout, GoogleButton
│   ├── layout/             # LeftSidebar, RightSidebar, AppLayout (responsive drawers)
│   ├── common/              # Button, Field, Modal, ConfirmDialog, RenameDialog, DropdownMenu, ...
│   ├── project/               # NewProjectModal, UploadModal, FileItem
│   └── chat/                   # ChatWindow, ChatMessage, ChatInput
│
├── pages/                # One file per route (see Routes below)
├── utils/                # formatDate, fileTypes (icons/sizes)
├── App.jsx               # Route tree
├── main.jsx              # Entry point (Router + providers)
└── index.css              # Tailwind layers + design tokens
```
