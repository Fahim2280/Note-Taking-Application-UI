# Secure Note-Taking & Posts Application - Frontend UI

A minimal, functional, zero-dependency React (Vite) frontend application communicating with the production **Secure Note-Taking & Posts REST API**.

## 🌐 Live Deployments
- **Live Frontend App**: [https://note-taking-application-ui.vercel.app](https://note-taking-application-ui.vercel.app)
- **Live Backend API**: [https://note-taking-application-apis.vercel.app](https://note-taking-application-apis.vercel.app)
- **Interactive Swagger Docs**: [https://note-taking-application-apis.vercel.app/api-docs](https://note-taking-application-apis.vercel.app/api-docs)

---

## 🛠️ Tech Stack & Constraints
- **Framework**: React 18+ with Vite (Plain JavaScript/JSX)
- **Styling**: **Zero external UI libraries or CSS frameworks** (no Tailwind, Bootstrap, Material UI, or templates). Strictly clean semantic HTML and a custom `App.css` focusing 100% on API functionality, layout clarity, and responsiveness.
- **State Management**: React Context (`AuthContext`) with automatic `localStorage` synchronization for JWT tokens and user profiles.

---

## 🚀 Application Views & Modules

### 1. Tab 1: Authentication View
- **Login Form**: Authenticates via `POST /api/auth/login` and persists JWT token.
- **Register Form**: `POST /api/auth/register` with name, email, password, comma-separated interests parser (e.g., `"chess, reading"` &rarr; `["chess", "reading"]`), and a role selector (`User` vs `Admin`).

### 2. Tab 2: My Notes
- **Create Note**: Title and content submission via `POST /api/notes`.
- **Paginated List**: Calls `GET /api/notes?page=X&limit=5`.
- **Inline Editing**: Live title and content editing with Save/Cancel controls (`PUT /api/notes/:id`).
- **Modal Inspection**: Full-document modal viewer (`GET /api/notes/:id`).
- **Delete**: Instant deletion with confirmation (`DELETE /api/notes/:id`).
- **Pagination Bar**: Previous / Next buttons and `Page X of Y (Total: Z)`.

### 3. Tab 3: Posts & Scenario 2 ($lookup User Posts)
- **Create Public Post**: Form to publish articles to the feed (`POST /api/posts`).
- **Public Feed**: Paginated feed of published posts (`GET /api/posts?page=X&limit=5`).
- **Scenario 2 ($lookup Aggregation) Tester**:
  - Interactive User ID input (with "Use My ID" shortcut or one-click jump from any author in feed).
  - Calls `GET /api/users/:userId/posts` to execute the single `$lookup` aggregation pipeline.
  - Renders joined user profile data alongside their populated array of authored posts.

### 4. Tab 4: Scenario 1 (Group Users by Interests Aggregation)
- Calls `GET /api/users/group-by-interests?page=X&limit=5`.
- Renders an interest group table (`_id`, user count) with interactive user chips showing members with that interest tag.
- Includes quick-jump buttons to test Scenario 2 directly on any grouped user.

### 5. Tab 5: Admin Panel (Restricted to `user.role === 'Admin'`)
- **Section A: Manage All Users** (`GET /api/admin/users?page=X&limit=5`):
  - Add user form (`POST /api/admin/users`).
  - Edit user modal/inline update for name, role, and interests (`PUT /api/admin/users/:id`).
  - Delete user (`DELETE /api/admin/users/:id`).
  - One-click jump to inspect user's posts via Scenario 2.
- **Section B: Global Notes Master View** (`GET /api/admin/notes?page=X&limit=5`):
  - Paginated view displaying all notes across all user accounts with owner information.

---

## 🏃 Local Development

```bash
# Navigate to UI directory
cd Note-Taking-Application-UI

# Install dependencies
npm install

# Start local Vite development server
npm run dev
```

The app will start at `http://localhost:5173`.

---

## 🔑 Ready-to-Test Accounts

| Account Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@example.com` | `AdminPassword123!` | All 5 Tabs including Admin Panel |
| **User** | `alice@example.com` | `securePassword123` | Tabs 1-4 (User Level) |
