export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  if (req.method === 'OPTIONS') { res.status(200).end(); return }

  const { checkIn, checkOut, adults, children } = req.query
  const key = process.env.SERPAPI_KEY || '8e25918ac543a4c0fab664514e739745db66ef22302bc09777762ef470db3fcc'
  const numChildren = parseInt(children || '0', 10)

  const params = new URLSearchParams({
    engine: 'google_hotels',
    q: 'hotels near Disneyland Anaheim CA',
    check_in_date: checkIn || '',
    check_out_date: checkOut || '',
    adults: adults || '2',
    children: String(numChildren),
    currency: 'USD',
    gl: 'us',
    hl: 'en',
    api_key: key,
  })

  if (numChildren > 0) {
    params.set('children_ages', Array(numChildren).fill('8').join(','))
  }

  try {
    const upstream = await fetch(`https://serpapi.com/search.json?${params}`)
    const data = await upstream.json()
    console.log('[hotels] serpapi status:', upstream.status, '| error:', data.error ?? 'none', '| properties:', data.properties?.length ?? 0)
    res.status(200).json(data)
  } catch (e) {
    console.log('[hotels] fetch error:', String(e))
    res.status(500).json({ error: String(e) })
  }
}
