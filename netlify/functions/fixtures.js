const TEAM_ID = 61;
const UPSTREAM = `https://api.football-data.org/v4/teams/${TEAM_ID}/matches?status=SCHEDULED`;

exports.handler = async () => {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'FOOTBALL_DATA_API_KEY not configured' }),
    };
  }

  try {
    const res = await fetch(UPSTREAM, {
      headers: { 'X-Auth-Token': apiKey },
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Upstream returned ${res.status}` }),
      };
    }

    const data = await res.json();
    const matches = Array.isArray(data.matches) ? data.matches : [];

    const cleaned = matches.map((m) => ({
      id: m.id,
      utcDate: m.utcDate,
      home: m.homeTeam?.shortName || m.homeTeam?.name || 'TBD',
      away: m.awayTeam?.shortName || m.awayTeam?.name || 'TBD',
      comp: m.competition?.name || '',
      status: m.status,
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
      body: JSON.stringify({ matches: cleaned }),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
