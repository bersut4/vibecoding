import { supabase } from '../lib/supabase'

export const uploadMedia = async (file, userId) => {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('community-media').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('community-media').getPublicUrl(path)
  return data.publicUrl
}

export const isVideo = (url) => /\.(mp4|webm|ogg|mov)$/i.test(url)
