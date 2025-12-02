export default async function TestPage() {
  let data = null
  let error = null

  try {
    const response = await fetch('http://localhost:3000/api/templates', {
      cache: 'no-store'
    })
    data = await response.json()
  } catch (e) {
    error = 'Failed to fetch data'
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Database Test - Seeded Templates</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}

      {data?.success && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <h2 className="font-semibold">✅ Database Connection Successful!</h2>
            <p>Found {data.summary.totalTemplates} templates with {data.summary.totalItems} total items</p>
          </div>

          <div className="grid gap-6">
            {data.data.map((template: any) => (
              <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {template.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Type: {template.type} • {template.items.length} items
                  </p>
                  {template.description && (
                    <p className="text-gray-700 mt-2">{template.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Checklist Items:</h3>
                  <div className="grid gap-2">
                    {template.items.map((item: any) => (
                      <div key={item.id} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            item.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          Category: {item.category} • Order: {item.order}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}