'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  currentUrl: string
  onUpload: (url: string) => void
}

export default function FotoUploader({ currentUrl, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('eventos-fotos')
      .upload(fileName, file)

    if (error) {
      alert('Error al subir la foto.')
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from('eventos-fotos')
      .getPublicUrl(fileName)

    onUpload(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {currentUrl && (
        <img src={currentUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
      )}
      <label className="cursor-pointer bg-gray-800 border border-gray-700 hover:border-green-500 rounded-xl px-4 py-3 text-center text-gray-400 hover:text-white transition">
        {uploading ? 'Subiendo...' : currentUrl ? '📷 Cambiar foto' : '📷 Subir foto'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  )
}