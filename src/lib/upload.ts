'use client'

import { createClient } from '@/lib/supabase/client'

export async function uploadImage(
  file: File,
  bucket: string,
  folder: string
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    return { url: null, error: error.message }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return { url: publicUrl, error: null }
}

export async function uploadMultipleImages(
  files: File[],
  bucket: string,
  folder: string
): Promise<{ urls: string[]; errors: string[] }> {
  const results = await Promise.all(
    files.map(file => uploadImage(file, bucket, folder))
  )

  return {
    urls: results.filter(r => r.url).map(r => r.url!),
    errors: results.filter(r => r.error).map(r => r.error!)
  }
}

/**
 * Upload a video file to Supabase storage
 * Max 100MB, accepted formats: mp4, mov, webm
 */
export async function uploadVideo(
  file: File,
  bucket: string,
  folder: string
): Promise<{ url: string | null; error: string | null }> {
  // Validate video file
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return { url: null, error: 'Desteklenmeyen video formatı. MP4, MOV veya WebM yükleyin.' };
  }

  if (file.size > MAX_VIDEO_SIZE) {
    return { url: null, error: 'Video dosyası çok büyük. Maksimum 100MB olmalı.' };
  }

  return uploadImage(file, bucket, folder);
}

/**
 * Upload multiple media files (images + videos)
 */
export async function uploadMultipleMedia(
  files: File[],
  bucket: string,
  folder: string
): Promise<{ urls: string[]; errors: string[] }> {
  const results = await Promise.all(
    files.map(file => {
      if (file.type.startsWith('video/')) {
        return uploadVideo(file, bucket, folder);
      }
      return uploadImage(file, bucket, folder);
    })
  )

  return {
    urls: results.filter(r => r.url).map(r => r.url!),
    errors: results.filter(r => r.error).map(r => r.error!)
  }
}