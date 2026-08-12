'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function deleteScoreAction(scoreId: string) {
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

    const { error: deleteError } = await supabase
      .from('test_scores')
      .delete()
      .eq('id', scoreId)
      .eq('user_id', user.id) // Ensure explicit ownership matching

    if (deleteError) {
      console.error("Delete error:", deleteError)
      return { error: 'Failed to delete test score.' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/history')
    return { success: true }

  } catch (error: any) {
    console.error("Server Action Error:", error)
    return { error: 'An unexpected error occurred.' }
  }
}
