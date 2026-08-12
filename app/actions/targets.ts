'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function upsertTargetGoalAction(formData: any) {
  try {
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
            } catch (error) {}
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Session expired. Please log in again.' }
    }

    const payload = {
      user_id: user.id,
      target_overall: Number(formData.target_overall),
      target_listening: Number(formData.target_listening),
      target_reading: Number(formData.target_reading),
      target_writing: Number(formData.target_writing),
      target_speaking: Number(formData.target_speaking),
      target_date: formData.target_date || null,
      is_active: true
    }

    // Upsert target goal. user_id is the primary/unique key so onConflict works natively
    const { error: upsertError } = await supabase
      .from('user_goals')
      .upsert(payload, { onConflict: 'user_id' })

    if (upsertError) {
      console.error("Upsert error:", upsertError)
      return { error: `Failed to save target goal: ${upsertError.message || 'Unknown error'}` }
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/targets')
    return { success: true }

  } catch (error: any) {
    console.error("Server Action Error:", error)
    return { error: 'An unexpected error occurred.' }
  }
}
