export default function ServiceSelection({ services, onSelect }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-white">Escolha o serviço</h2>
      <div className="space-y-2">
        {services.map(service => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className="w-full text-left p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500 transition group"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-white group-hover:text-blue-400">{service.name}</span>
              <span className="text-blue-400">R$ {service.price}</span>
            </div>
            <p className="text-sm text-gray-400">{service.duration} minutos</p>
          </button>
        ))}
      </div>
    </div>
  )
}