import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import TargetForm from './TargetForm'

export const metadata = {
  title: 'Target Management | TargetBand',
}

export default async function TargetsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch current active goal
  const { data: goal } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  return <TargetForm initialGoal={goal} />
}
