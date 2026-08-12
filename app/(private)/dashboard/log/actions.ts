'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { scoreEntrySchema } from '@/lib/validation/schemas'
import { revalidatePath } from 'next/cache'

export async function createScoreEntry(formData: any) {
  try {
    // 1. Zod Validation
    const validation = scoreEntrySchema.safeParse(formData)
    if (!validation.success) {
      return { error: validation.error.issues[0].message }
    }

    // 2. Initialize Supabase Server Client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    )

    // 3. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Session expired. Please log in again.' }
    }

    // 4. Database Insertion
    const { error: insertError } = await supabase
      .from('test_scores')
      .insert({
        user_id: user.id,
        ...validation.data
      })

    if (insertError) {
      console.error("Insert error detail:", insertError)
      return { error: `Failed to save score: ${insertError.message || 'Unknown error'}` }
    }

    // 5. Revalidate and Return
    revalidatePath('/dashboard')
    return { success: true }

  } catch (error: any) {
    console.error("Server Action Error:", error)
    return { error: 'An unexpected error occurred.' }
  }
}
