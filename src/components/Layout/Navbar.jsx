import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { RocketLaunchIcon } from '@heroicons/react/24/solid'

export default function Navbar({ session }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          <RocketLaunchIcon className="w-8 h-8 text-blue-400" />
          <span>AgendaPro</span>
        </Link>
        <div className="space-x-4">
          {session ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
              <button onClick={handleLogout} className="hover:text-blue-400 transition">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
              <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition">
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}