# PehliPeedhi (पहली पीढ़ी) 🎓

> **Mentorship Platform for First-Generation College Students in India**  
> Connecting learners from non-graduate families with verified alumni who walked the same journey. 100% free guidance on admissions, scholarship roadmaps, and career choices.

---

## 🚀 Modern Web Application Architecture

This branch (`feature/nextjs-webapp`) upgrades the platform into a production-grade web application built with **Next.js 16 (App Router)**, **TypeScript**, and **Vanilla CSS**.

- **Zero-config deployment:** Fully optimized for instant deployment on [Vercel](https://vercel.com).
- **Type-safe:** End-to-end data models for students, mentors, requests, and resources.
- **REST Route Handlers:** Serverless API endpoints ready for PostgreSQL / Supabase integration.
- **Dual-role Experience:** Live switching between Student and Mentor views for seamless evaluation.
- **Original prototype preserved:** The legacy vanilla prototype is preserved in [`prototype/`](./prototype).

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | TypeScript 5 |
| **UI & Styling** | Vanilla CSS3 (Custom Design System with CSS variables) |
| **Typography** | Plus Jakarta Sans (Google Fonts) |
| **State & Auth** | Context API + LocalStorage sync + Serverless Route Handlers |
| **Deployment Target** | Vercel / GitHub Actions |

---

## 📂 Project Structure

```
pehli-peedhi/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── mentors/route.ts       # REST endpoint: search & filter mentors
│   │   │   ├── requests/route.ts      # REST endpoint: mentorship requests
│   │   │   └── resources/route.ts     # REST endpoint: scholarships & guides
│   │   ├── auth/page.tsx              # Sign In / Sign Up with 1-click evaluation logins
│   │   ├── dashboard/page.tsx         # Interactive Student & Mentor Dashboard
│   │   ├── find-mentors/page.tsx      # Filterable alumni directory (State, Field, Language)
│   │   ├── mentor/[id]/page.tsx       # Mentor biographical journey & booking
│   │   ├── profile/page.tsx           # Profile editor for students & mentors
│   │   ├── resources/page.tsx         # National scholarships, fee waivers & checklists
│   │   ├── globals.css                # Custom design system tokens & animations
│   │   ├── layout.tsx                 # Root layout with header, footer & modals
│   │   └── page.tsx                   # High-impact landing page
│   ├── components/
│   │   ├── Footer.tsx                 # Site footer with mission & helpline info
│   │   ├── MentorCard.tsx             # Interactive mentor card with verified badges
│   │   ├── Navbar.tsx                 # Top navigation + demo role quick switch
│   │   ├── RequestModal.tsx           # Mentorship request modal dialog
│   │   └── Toast.tsx                  # Real-time feedback toast notifications
│   ├── context/
│   │   └── AppContext.tsx             # State provider, role switching & mock persistence
│   ├── data/
│   │   └── mockData.ts                # Curated Indian states, disciplines & sample data
│   └── types/
│       └── index.ts                   # TypeScript interfaces and models
├── prototype/                         # Preserved original static prototype
├── package.json
└── tsconfig.json
```

---

## 🏃 Getting Started Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Vercel

1. Import this GitHub repository into your Vercel Dashboard.
2. Select the branch `feature/nextjs-webapp`.
3. Vercel will automatically detect Next.js and deploy with zero configuration!
