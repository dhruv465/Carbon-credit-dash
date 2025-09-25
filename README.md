# Offset Carbon Credits Dashboard

This is a frontend application built with React, TypeScript, Vite, and shadcn/ui to browse and manage carbon credits.

## Features

- **List & Browse Credits**: View a list of carbon credits from a JSON file.
- **Search & Filter**: Search by project name and filter by vintage.
- **Status Badges**: Credits are marked with "Active" or "Retired" status badges.
- **Details View**: Click on a credit to see more details in a dialog.
- **Download Certificate**: Generate and download a PDF certificate for each credit.
- **Pagination & Virtualization**: The table uses virtualization to efficiently handle large datasets.
- **Animations**: Subtle animations are used to improve user experience.
- **Toasts**: User feedback is provided through toast notifications.
- **Loading & Empty States**: The application provides feedback during data loading and when no results are found.

## Tech Stack

- **Framework**: React 18 + TypeScript (TSX)
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Animations**: framer-motion
- **Icons**: lucide-react
- **Tables & Filtering**: @tanstack/react-table
- **Virtualization**: @tanstack/react-virtual
- **State Management**: React state
- **Form & Validation**: react-hook-form + zod
- **Date & Time**: date-fns
- **Export/Print Certificate**: jspdf + html2canvas

## How to Run

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd offset-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

## Reflection

### How did you decide what to show on the main page vs details?

Honestly, I started by thinking about what I'd want to see if I was quickly scanning through a bunch of credits. The main things that jumped out were the ID (so I can reference it), the project name (to understand what it's about), when it was issued, and whether it's still active. Everything else felt like "nice to have" information that would just clutter the view.

I went with a dialog for details because it keeps you in context - you're not losing your place in the list or having to navigate back and forth. Plus, most of the detailed info like methodology and verification details are really only relevant when you're seriously considering a specific credit.

### What design choices did you make to keep it clean?

I'm a big believer in "less is more." The whole interface uses a pretty restrained color palette - mostly grays and whites with just a few accent colors for status badges and actions. I avoided the temptation to make everything colorful and flashy.

The spacing is consistent throughout, and I tried to group related information together visually. The search and filters are at the top where you'd expect them, and the table has clean lines without too many borders or visual noise. I also made sure there's plenty of whitespace so it doesn't feel cramped.

One thing I'm particularly happy with is the status badges - they use semantic colors (green for active, gray for retired) so you can instantly understand the state without reading the text.

### If the system had 10,000 credits, how would you keep the dashboard fast?

This was actually something I thought about early on. With 10k records, you can't just render everything at once - your browser would crawl to a halt. I implemented virtualization using @tanstack/react-virtual, which only renders the rows that are actually visible on screen. So whether you have 100 credits or 10,000, you're only rendering maybe 20-30 rows at a time.

The search and filtering happens client-side right now, which works fine for smaller datasets, but with 10k records I'd probably move that to the backend. I'd also add debouncing to the search input so we're not filtering on every keystroke.

If we're talking really large scale, I'd implement proper pagination on the server side and maybe add some caching. But for most use cases, the virtualization approach gives you that smooth scrolling experience without the performance hit.