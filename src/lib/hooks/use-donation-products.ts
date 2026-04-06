'use client'

import { createClient as createTypedClient } from '@/lib/supabase/client'
const createClient = () => createTypedClient() as any

export interface DonationProduct {
  id: string
  business_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
  is_active: boolean
  sort_order: number
  total_donated: number
  created_at: string
  updated_at: string
  // Joined
  businesses?: { id: string; name: string; logo_url?: string; address?: string; rating_avg?: number; owner_id?: string }
}

/** Get all active donation products, optionally filtered */
export async function getDonationProducts(options?: {
  businessId?: string
  category?: string
  limit?: number
}) {
  const supabase = createClient()
  let query = supabase
    .from('donation_products')
    .select('*, businesses(id, name, logo_url, address, rating_avg)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (options?.businessId) query = query.eq('business_id', options.businessId)
  if (options?.category) query = query.eq('category', options.category)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  return { data: data as DonationProduct[] | null, error }
}

/** Get products for a specific business (including inactive, for management) */
export async function getBusinessProducts(businessId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('donation_products')
    .select('*')
    .eq('business_id', businessId)
    .order('sort_order', { ascending: true })
  return { data: data as DonationProduct[] | null, error }
}

/** Create a new donation product */
export async function createDonationProduct(product: {
  business_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
  sort_order?: number
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('donation_products')
    .insert({ ...product, is_active: true })
    .select()
    .single()
  return { data: data as DonationProduct | null, error }
}

/** Update a donation product */
export async function updateDonationProduct(
  productId: string,
  updates: Partial<{
    name: string
    description: string
    price: number
    image_url: string
    category: string
    is_active: boolean
    sort_order: number
  }>
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('donation_products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', productId)
    .select()
    .single()
  return { data: data as DonationProduct | null, error }
}

/** Delete a donation product */
export async function deleteDonationProduct(productId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('donation_products')
    .delete()
    .eq('id', productId)
  return { error }
}

/** Get businesses that have active donation products */
export async function getBusinessesWithProducts(options?: {
  neighborhoodId?: string
  limit?: number
}) {
  const supabase = createClient()
  let query = supabase
    .from('businesses')
    .select(`
      id, name, logo_url, address, rating_avg, review_count, cover_url,
      donation_products!inner(id, name, description, price, image_url, category, is_active, sort_order, total_donated)
    `)
    .eq('donation_products.is_active', true)

  if (options?.neighborhoodId) query = query.eq('neighborhood_id', options.neighborhoodId)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  return { data, error }
}

/** Increment total_donated count for a product */
export async function incrementProductDonationCount(productId: string, quantity: number = 1) {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('donation_products')
    .select('total_donated')
    .eq('id', productId)
    .single()

  if (product) {
    const { error } = await supabase
      .from('donation_products')
      .update({ total_donated: (product.total_donated || 0) + quantity })
      .eq('id', productId)
    return { error }
  }
  return { error: null }
}
