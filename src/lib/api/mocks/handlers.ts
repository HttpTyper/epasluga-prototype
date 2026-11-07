import { http, HttpResponse, delay } from 'msw'

export const handlers = [http.get('/api/health', () => HttpResponse.json({ ok: true }))]
