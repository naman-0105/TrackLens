# TrackLens

## Real-Time User Behavior Analytics Platform

TrackLens is a full-stack analytics platform that helps website owners understand how users interact with their websites through session tracking, click heatmaps, automatic page snapshots, and real-time analytics dashboards.

Built as part of an assignment, the platform demonstrates end-to-end event tracking, real-time data processing, visual analytics, and scalable system design.

---
## Live Demo

Access the deployed application and API below:

- **Frontend URL:** https://track-lens-sigma.vercel.app
- **Backend URL:** https://tracklens-es9f.onrender.com/health
- **Demo-website:** https://demo-website-peach-six.vercel.app
---

## Demo Video
Full walkthrough of the TrackLens

- **Watch Demo** - https://youtu.be/ybiRCy8vXCk

---
## Project Structure

```text
TrackLens
│
├── backend      # Receives events, stores data, and provides analytics APIs
├── frontend     # Dashboard to view sessions, statistics, and heatmaps
├── tracker      # Script that tracks user clicks and page visits
├── demo-site    # Sample website used to test the tracking script
└── README.md    # Project setup and documentation
```
---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Socket.IO Client
- Axios

### Backend

- Node.js
- Express.js
- Mongoose
- Socket.IO
- Playwright

### Database

- MongoDB

---

## Installation

### Clone Repository

```bash
git clone https://github.com/naman-0105/TrackLens.git

cd TrackLens
```

---

### Backend Setup

```bash
cd backend

npm install
```
Create a `.env` file using `.env.example` as a reference.

Run Backend

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend

npm install
```
Create a `.env` file using `.env.example` as a reference.

Run Frontend

```bash
npm run dev
```

---

### Demo Site

```bash
cd demo-site

npx serve .
```

---

---

## Tracker Installation

The tracker can be embedded into any website by including:

```html
<script src="https://tracker-script.onrender.com/tracker.js"></script>
```

The tracker automatically records:

- Page views
- Clicks
- Sessions
- Timestamps

without requiring any additional integration.

---

## Assumptions & Trade-offs

- Session IDs are stored in `localStorage`.
- Click positions are normalized for consistent heatmap rendering.
- Heatmaps are generated from tracked click events.
- Page snapshots are captured automatically using Playwright.
- Snapshots are currently stored on the server filesystem for simplicity. For production deployments, cloud storage such as AWS S3 or Cloudinary would be preferred.
- Socket.IO is used for real-time dashboard updates.

---

## Features

### Event Tracking

- Tracks page views
- Tracks click events
- Generates unique session IDs
- Event batching for network efficiency
- Beacon API support for reliable event delivery on page unload

### Session Analytics

- Session timeline visualization
- Session duration calculation
- Event count per session
- Search and pagination

### Heatmaps

- Visual click heatmaps
- Click overlays on actual page snapshots
- Zoom controls
- Real-time updates

### Dashboard Analytics

- Total sessions
- Total events
- Total clicks
- Total page views
- Event distribution charts

### Real-Time Updates

- Socket.IO integration
- Dashboard updates instantly when new events arrive
- No manual refresh required

### Snapshot System

- Automatic screenshot generation using Playwright
- Full-page captures

---

## System Architecture

```text
┌─────────────┐
│   Website   │
└──────┬──────┘
       │
       │ tracker.js
       ▼
┌─────────────┐
│ Express API │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   MongoDB   │
└──────┬──────┘
       │
       ├── Session Analytics
       ├── Heatmap Data
       └── Page Snapshots
       │
       ▼
┌─────────────────┐
│ React Dashboard │
└─────────────────┘
```

---

## Author

**Naman Goyal**

Built for the CausalFunnel Full Stack Engineer Assignment.
