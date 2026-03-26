
## Golf Charity Subscription UI

This project now includes a production-ready Supabase frontend integration for:

- Email/password authentication
- Protected dashboard and admin routes
- Full CRUD against a `projects` table
- Realtime project updates

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and add your Supabase values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

3. Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor.

4. Start the app:

```bash
npm run dev
```

## Auth and Roles

- Standard authenticated users can access `/dashboard/*`
- Admin routes under `/admin/*` require `app_metadata.role = 'admin'`

## Notes

- Supabase handles API access directly from the frontend, so no additional CORS proxy is needed when the project URL and anon key are correct.
- A catch-all 404 route is included to avoid broken client-side paths.
  
