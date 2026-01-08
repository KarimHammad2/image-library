## Animal Disease / Defect Image Library (Demo)

Next.js 16 (App Router, TypeScript) demo with Tailwind + shadcn/ui, custom JWT auth, JSON-backed storage, premium gating, and admin console.

### Quick start
```bash
npm install
npm run dev
# open http://localhost:3000
```

### Default accounts
- Admin: `admin@example.com` / `Admin123!` (can toggle premium + roles)
- Members: `member@example.com` / `Member123!`, `premium@example.com` / `Premium123!`

### Data storage
Local JSON files in `/data` act as the database:
- `users.json`, `images.json`, `diseases.json`, `analytics.json`, `quizzes.json`, `anatomy_content.json`
- Demo images live in `/public/demo-images/*`

### Stack
- Next.js 16 App Router, TypeScript
- Tailwind CSS + shadcn/ui components
- Custom auth with JWT in HTTP-only cookies (`adlib_session`, HS256 via `lib/auth.ts`)
- File-based CRUD helpers in `lib/db.ts`; analytics logger in `lib/analytics.ts`

### Features
- Public landing + auth (login/signup)
- Member: library with faceted search, image detail + disease card, comparison view, premium dashboard (quizzes, anatomy/PDF/video links)
- Premium gating: `isPremium` flag on the user model (no real payments)
- Admin: dashboard, image metadata CRUD + approval, disease CRUD, user role/premium toggles, analytics table + CSV/JSON export
- Analytics events for login, image views, searches/filters, comparisons, quiz start/complete, premium content views

### Important paths
- Landing/auth: `app/(public)/*`
- Member area: `app/(member)/library`, `/compare`, `/premium/*`
- Admin: `app/(admin)/admin/*`
- Middleware guards member/admin routes in `middleware.ts`

### Limitations / notes
- No real uploads: image selection is by filename pointing at `/public/demo-images`.
- No external DB or payment gateway; JSON writes are best-effort and not concurrent-safe for production.
- Auth is demo-grade (HS256 shared secret, SHA-256 password hash).
- Analytics is append-only JSON; clear the file to reset.

### Scripts
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - start compiled app
- `npm run lint` - ESLint
