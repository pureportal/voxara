# Voxara

Voxara is a desktop storage analysis app. It focuses on fast, transparent disk usage insights, deep search, and actionable cleanup workflows for power users and IT teams.

**Status:** Alpha — core UX and scanning workflows are in active development, and features may change rapidly.

## Quick Start

### Prerequisites

- Node.js (LTS)
- Rust toolchain
- Tauri prerequisites for your OS

### Run the app

1. Install dependencies.
2. Start the Tauri dev build.

```
npm install
npm run tauri:dev
```

### Build a release

```
npm run tauri:build
```

## Core Features (Planned)

### Storage Analysis

- Tree-style explorer with detailed folder breakdowns.
- Treemap, pie, and bar visualizations for space usage.
- Top files and largest folders views for quick triage.
- Snapshot comparison to track growth over time.

### Scan Targets

- Local drives and external/USB media.
- Network shares (SMB/CIFS).
- Remote locations via SSH.
- Cloud and collaboration platforms (SharePoint, S3-compatible storage, WebDAV).
- Drive images (VHD, VHDX, ISO).
- Mobile devices via MTP/WebDAV.

### Search & Cleanup

- Advanced file search by size, age, type, and metadata.
- Regex and pattern-based filtering.
- Duplicate file and folder detection.
- ZIP archive searching.
- Bulk actions: move, delete, archive, rename, copy.

### Reporting & Automation

- Export reports to PDF, Excel, CSV, and HTML.
- Email-ready report generation.
- Command-line and task scheduler integration.
- Reusable search templates and scheduled scans.

### File System Insights

- NTFS details (compression, permissions, hardlink awareness).
- Long-path support.
- Multithreaded scanning for large datasets.

## Tech Stack

- Tauri 2.0 + Rust
- React + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Router + TanStack Query
