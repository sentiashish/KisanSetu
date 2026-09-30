const baseUrl = import.meta.env.VITE_API_URL || '/api/v1'
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

const mockWorkers = [{ id: 1, farmer_id: 1, name: 'राम', phone_number: '9876543210' }]
const mockRequests = [{ id: 1, farmer_id: 1, worker_id: 1, worker_name: 'राम', message: 'कल सुबह खेत में काम है।', status: 'pending', created_at: new Date().toISOString(), response_count: 0 }]

async function request(path, options = {}) {
  if (useMock) return mockResponse(path, options)
  let response
  try { response = await fetch(`${baseUrl}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options }) } catch {
    const error = new Error('OFFLINE'); error.code = 'OFFLINE'; throw error
  }
  const body = await response.json().catch(() => ({}))
  if (!response.ok) { const error = new Error(body.error?.message || 'Request failed'); error.code = body.error?.code || 'REQUEST_FAILED'; throw error }
  return body
}

async function mockResponse(path, options) {
  await new Promise((resolve) => setTimeout(resolve, 160))
  if (path.includes('/workers') && options.method === 'POST') return { ...JSON.parse(options.body), id: Date.now(), farmer_id: 1 }
  if (path.includes('/workers')) return mockWorkers
  if (path.includes('/requests') && options.method === 'POST') return { ...mockRequests[0], ...JSON.parse(options.body), id: Date.now() }
  if (path.includes('/requests')) return mockRequests
  if (path === '/farmers' && options.method === 'POST') return { id: 1, ...JSON.parse(options.body) }
  return { status: 'ok', database: 'mock' }
}

export const api = {
  createFarmer: (data) => request('/farmers', { method: 'POST', body: JSON.stringify(data) }),
  getWorkers: (farmerId) => request(`/farmers/${farmerId}/workers`),
  addWorker: (farmerId, data) => request(`/farmers/${farmerId}/workers`, { method: 'POST', body: JSON.stringify(data) }),
  getRequests: (farmerId) => request(`/farmers/${farmerId}/requests`),
  createRequest: (farmerId, data) => request(`/farmers/${farmerId}/requests`, { method: 'POST', body: JSON.stringify(data) }),
  reply: (data) => request('/workers/reply', { method: 'POST', body: JSON.stringify(data) }),
}