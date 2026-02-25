import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ClientList() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('appointments')
      .select('client_name, client_email, client_phone, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar clientes:', error)
    } else {
      // Remove duplicados pelo nome (simplificado)
      const unique = data?.filter((v, i, a) => 
        a.findIndex(t => t.client_name === v.client_name) === i
      ) || []
      setClients(unique)
    }
    setLoading(false)
  }

  if (loading) return <div className="text-center p-4 text-gray-300">Carregando...</div>

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
      <h2 className="text-xl font-semibold mb-4 text-white">Clientes</h2>
      <div className="space-y-2">
        {clients.map((client, index) => (
          <div key={index} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <p className="font-medium text-white">{client.client_name}</p>
            <p className="text-sm text-gray-400">{client.client_email}</p>
            <p className="text-sm text-gray-400">{client.client_phone}</p>
          </div>
        ))}
        {clients.length === 0 && (
          <p className="text-gray-400 text-center py-4">Nenhum cliente ainda.</p>
        )}
      </div>
    </div>
  )
}