export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') { res.status(200).end(); return }

  const { checkIn, checkOut, adults, children } = req.query
  const key = process.env.SERPAPI_KEY || '8e25918ac543a4c0fab664514e739745db66ef22302bc09777762ef470db3fcc'

  const params = new URLSearchParams({
    engine: 'google_hotels',
    q: 'hotels near Disneyland Anaheim CA',
    check_in_date: checkIn || '',
    check_out_date: checkOut || '',
    adults: adults || '2',
    children: children || '0',
    currency: 'USD',
    gl: 'us',
    hl: 'en',
    api_key: key,
  })

  try {
    const upstream = await fetch(`https://serpapi.com/search.json?${params}`)
    const data = await upstream.json()
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
}
