import { useState } from 'react'

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

const daysDisplay = {
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
  sunday: 'Domingo'
}

export default function ScheduleConfig({ profile, updateProfile }) {
  const [workingHours, setWorkingHours] = useState(profile?.working_hours || {})

  const handleToggle = (day, enabled) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        enabled,
        start: prev[day]?.start || '09:00',
        end: prev[day]?.end || '18:00'
      }
    }))
  }

  const handleChange = (day, field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || { enabled: false }),
        [field]: value
      }
    }))
  }

  const saveHours = () => {
    updateProfile({ working_hours: workingHours })
    alert('Horários salvos!')
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
      <h2 className="text-xl font-semibold mb-4 text-white">Configurar Horários de Funcionamento</h2>
      {daysOfWeek.map(day => {
        const dayConfig = workingHours[day] || { enabled: false, start: '09:00', end: '18:00' }
        return (
          <div key={day} className="mb-4 pb-2 border-b border-white/10">
            <h3 className="font-medium mb-2 text-gray-200">{daysDisplay[day]}</h3>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={dayConfig.enabled || false}
                  onChange={(e) => handleToggle(day, e.target.checked)}
                  className="mr-2 accent-blue-500 bg-gray-800 border-gray-600"
                />
                Aberto
              </label>
              {dayConfig.enabled && (
                <>
                  <input
                    type="time"
                    value={dayConfig.start || '09:00'}
                    onChange={(e) => handleChange(day, 'start', e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white p-1 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400">até</span>
                  <input
                    type="time"
                    value={dayConfig.end || '18:00'}
                    onChange={(e) => handleChange(day, 'end', e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white p-1 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </>
              )}
            </div>
          </div>
        )
      })}
      <button
        onClick={saveHours}
        className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:scale-105 transition"
      >
        Salvar Horários
      </button>
    </div>
  )
}