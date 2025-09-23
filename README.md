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

### Main vs Details

The main page provides a scannable overview of the carbon credits, showing the most important information: UNIC ID, project name, vintage, and status. This allows users to quickly browse and find the credits they are interested in. The details view, on the other hand, is shown in a dialog and provides the full metadata for a selected credit. This approach of progressive disclosure reduces the cognitive load on the user and keeps the main interface clean and focused.

### Clean Design Choices

The design of the dashboard is clean and minimalistic, with a focus on usability. It uses a single primary action per surface, consistent spacing, and a subdued color palette. Semantic colors are used for the status badges to provide immediate visual feedback. Toasts are used to provide non-intrusive feedback for actions like downloading a certificate.

### 10k Credits Performance

To handle large datasets with 10,000 or more credits, the application uses @tanstack/react-virtual for table virtualization. This means that only the visible rows are rendered, which significantly improves performance and reduces memory usage. The filtering is done on the client-side, and the debounced input for the search filter would be a good addition to prevent excessive re-renders on every keystroke. For even larger datasets, the filtering and pagination could be moved to the server-side.