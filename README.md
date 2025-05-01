# Form Builder

It allows you to create and manage forms with keyboard accessibility as a primary focus.

## Development

### Form Structure

Forms in this application consist of:

- **Form**: The main container with title and description
- **Field**: Questions or inputs within the form
- **Options**: For fields that require selection from predefined choices
- **Response**: User submissions to the form

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/dougrocha/keyboard_forms.git
   cd keyboard_forms
   ```

2. Install dependencies

   ```bash
   # Using pnpm (recommended)
   pnpm install
   ```

3. Setup environment variables

   ```bash
   cp .env.example .env
   ```

4. Start the database (Using Docker)

   ```bash
   # Make the script executable if needed
   chmod +x ./start-database.sh

   # Start the database
   ./start-database.sh
   ```

5. Run database migrations

   ```bash
   pnpm db:migrate
   ```

6. Seed the database with initial data

   ```bash
   pnpm db:seed
   ```

7. Start the development server

   ```bash
   pnpm dev
   ```

   The server will start at http://localhost:3000

## Test Data

You can find all test data in [seed.ts](./seed.ts).

```bash
# Seed the test data
pnpm db:seed
```

### Test Users

The following test user is seeded into the database for development and testing purposes:

- **Recommended User**

  - Email: `test@mail.com`
  - Password: `password`
