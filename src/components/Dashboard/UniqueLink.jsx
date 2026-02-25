import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function UniqueLink({ slug, onUpdate }) {
  const [newSlug, setNewSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const baseUrl = window.location.origin

  const updateSlug = async () => {
    if (!newSlug) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Usuário não autenticado. Faça login novamente.')
      setLoading(false)
      return
    }

    // Verifica se o perfil existe, se não, cria
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code === 'PGRST116') { // não encontrado
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ 
          id: user.id, 
          store_name: user.user_metadata?.store_name || 'Minha Loja' 
        })
      if (insertError) {
        alert('Erro ao criar perfil: ' + insertError.message)
        setLoading(false)
        return
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ unique_slug: newSlug })
      .eq('id', user.id)

    if (!error) {
      alert('Link personalizado atualizado!')
      if (onUpdate) onUpdate(newSlug)
      setNewSlug('')
    } else {
      console.error('Erro ao atualizar slug:', error)
      alert('Erro: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10">
      <h3 className="font-semibold mb-2 text-white">Seu link de agendamento</h3>
      {slug ? (
        <div className="mb-2">
          <a href={`${baseUrl}/${slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">
            {baseUrl}/{slug}
          </a>
        </div>
      ) : (
        <p className="text-yellow-400 mb-2">Você ainda não definiu um link personalizado.</p>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="ex: meusalao"
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={updateSlug}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg disabled:opacity-50 hover:scale-105 transition"
        >
          {slug ? 'Alterar' : 'Definir'}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">Apenas letras, números e hífens.</p>
    </div>
  )
}