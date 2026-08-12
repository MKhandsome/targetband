# TargetBand Supabase Admin Setup Guide

This application's dashboard is currently restricted to Admin-Only access. To log in, you must use an account with the exact email address `admin@example.com`.

Since sign-ups for this specific address must be handled securely, follow these steps to manually create and auto-confirm the admin account directly from your Supabase Dashboard or via SQL.

---

## Option 1: Quick Setup via SQL Editor (Recommended)

The easiest way to create the admin account with a pre-set password is to run a direct SQL insertion. This bypasses the email confirmation flow entirely.

1. Go to your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor** in the left-hand menu.
3. Click **New Query** and paste the following snippet:

```sql
-- Insert into auth.users and public.profiles
-- Email: admin@example.com / Password: targetband0509

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('targetband0509', gen_salt('bf')),
  current_timestamp,
  current_timestamp,
  current_timestamp,
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"System Administrator"}',
  current_timestamp,
  current_timestamp,
  '',
  '',
  '',
  ''
);
```

4. Click **Run**.
5. You can now log into the application using:
   - **Email:** `admin@example.com`
   - **Password:** `targetband0509`

*(Note: The database trigger `on_auth_user_created` will automatically create the corresponding row in `public.profiles` for this user!)*

---

## Option 2: Setup via Supabase GUI

If you prefer to use the graphical interface:

1. Go to your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication** -> **Users**.
3. Click **Add User** -> **Create New User**.
4. Enter the credentials:
   - **Email:** `admin@example.com`
   - **Password:** `targetband0509` (or a password of your choice)
5. **Important:** Ensure **Auto Confirm User?** is checked. If it is unchecked, the account will be stuck in a pending state until you configure an SMTP server.
6. Click **Create User**.

You can now return to the TargetBand application at `http://localhost:3000/login` and sign in.

---

## Verifying the Lock

Once configured, you can test the security middleware:
1. Log in with `admin@example.com`. You should be granted access to `/dashboard`.
2. Sign out, and attempt to sign up or log in with any other email address (e.g., `user@example.com`).
3. If you attempt to navigate to `/dashboard`, the middleware will instantly reject the request and bounce you back to `/login` with a red "Access Denied" badge!
