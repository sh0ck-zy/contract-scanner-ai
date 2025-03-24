# ContractScan

AI-powered contract analysis for freelancers.

## Features

- AI contract analysis to identify problematic clauses
- Plain language explanations of contract issues
- Fairer alternatives to problematic language
- Subscription-based pricing model
- User authentication and account management
- Contract history and storage

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS with shadcn/ui
- Prisma (PostgreSQL)
- OpenAI API
- Clerk Authentication
- Stripe Payments
- Resend Email

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env.local` and fill in values)
4. Initialize the database: `npx prisma generate && npx prisma db push`
5. Run the development server: `npm run dev`