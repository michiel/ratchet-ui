# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based admin dashboard for the **Ratchet Task Execution System**, built with Refine.dev framework. It provides a UI for managing tasks, executions, jobs, and schedules in a Rust-based task execution backend.

## Development Commands

```bash
# Development server (with hot reload)
npm run dev

# Production build (TypeScript compilation + Refine build)
npm run build

# Production server
npm run start

# Refine CLI commands
refine
```

## Core Architecture

### Technology Stack
- **Framework**: React 18 + TypeScript with Refine.dev
- **UI Library**: Ant Design (antd)
- **Build Tool**: Vite
- **Data Provider**: Simple REST API (`@refinedev/simple-rest`)
- **Backend API**: `http://localhost:8080/api/v1`

### Application Structure
- **Resources**: Tasks (full CRUD), Executions (list/create/show), Jobs (placeholder), Schedules (placeholder)
- **Authentication**: Simple localStorage-based mock auth
- **Routing**: React Router v7 with protected routes
- **Theme**: Dark/light mode support via context

### Key Directories
```
src/
├── App.tsx              # Main Refine app configuration
├── types/ratchet.ts     # Comprehensive API type definitions
├── pages/               # Resource pages organized by entity
│   ├── tasks/           # Task CRUD pages
│   ├── executions/      # Execution management pages
│   ├── jobs/            # Placeholder pages ("Coming Soon")
│   └── schedules/       # Placeholder pages ("Coming Soon")
├── components/header/   # Custom header component
└── contexts/color-mode/ # Theme management
```

## Type System

All API types are defined in `src/types/ratchet.ts`. Key entities:

- **Task**: Task definitions with input/output schemas
- **Execution**: Task execution tracking with status/progress
- **Job**: Queue management (not yet implemented)
- **Schedule**: Cron-based scheduling (not yet implemented)

## Development Patterns

### Adding New Resources
1. Create pages in `src/pages/{resource}/` following existing patterns
2. Export pages in `src/pages/{resource}/index.ts`
3. Add resource configuration to `App.tsx`
4. Add types to `src/types/ratchet.ts` if needed

### Refine.dev Conventions
- Use Refine hooks (`useList`, `useShow`, `useCreate`, etc.) for data operations
- Follow resource-based architecture (list, create, edit, show pages)
- Use Ant Design components with Refine integrations
- Leverage built-in authentication and routing providers

## Current Implementation Status

- ✅ **Tasks**: Complete CRUD implementation
- ✅ **Executions**: List, create, show (missing edit)
- ❌ **Jobs**: Placeholder pages only
- ❌ **Schedules**: Placeholder pages only

## Backend Integration

The backend expects:
- REST API endpoints following standard patterns (`GET /tasks`, `POST /tasks`, etc.)
- Task execution system with real-time status updates
- Comprehensive type system matching `src/types/ratchet.ts`