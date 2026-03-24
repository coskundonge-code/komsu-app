'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Neighborhood = {
  id: string
  name: string
  district: string
  city: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)

        // Fetch neighborhood info
        const { data: neighborhoodData } = await supabase
          .from('neighborhood_members')
          .select(`
            neighborhood_id,
            neighborhoods (
              id,
              name,
              district,
              city
            )
          `)
          .eq('user_id', user.id)
          .single()

        if (neighborhoodData?.neighborhoods) {
          const nb = neighborhoodData.neighborhoods as any
          setNeighborhood({
            id: nb.id,
            name: nb.name,
            district: nb.district,
            city: nb.city
          })
        }
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setProfile(null)
        setNeighborhood(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, profile, neighborhood, loading }
}

export function useSignOut() {
  const [loading, setLoading] = useState(false)

  const signOut = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setLoading(false)
    window.location.href = '/giris'
  }

  return { signOut, loading }
}
