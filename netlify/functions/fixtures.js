const TEAM_ID = 61;
const UPSTREAM = `https://api.football-data.org/v4/teams/${TEAM_ID}/matches?status=SCHEDULED`;

// ─── Manual Fixtures ───
// football-data.org's free tier doesn't cover every competition Chelsea plays in
// (FA Cup, Carabao Cup / EFL Cup, FIFA Club World Cup, Community Shield,
// friendlies, etc.). Add those matches here and they'll be merged into the API
// results automatically.
//
// Each entry must use this exact shape:
//   {
//     id:      <unique string — prefix with something descriptive like
//              "fa-cup-..." so it won't collide with football-data.org's
//              numeric match ids>,
//     utcDate: <ISO 8601 timestamp in UTC, e.g. "2026-04-26T14:00:00Z">,
//     home:    <home team display name>,
//     away:    <away team display name; one of home/away must be "Chelsea">,
//     comp:    <competition name, e.g. "FA Cup", "Carabao Cup",
//              "Club World Cup", "Community Shield">,
//     status:  'SCHEDULED',
//   }
//
// Converting a UK kickoff time to UTC:
//   - In UK summer (late March → late October) clocks run on BST = UTC+1.
//     A 3:00 PM BST kickoff is 14:00 UTC → "...T14:00:00Z".
//   - In UK winter (late October → late March) clocks run on GMT = UTC+0.
//     A 3:00 PM GMT kickoff is 15:00 UTC → "...T15:00:00Z".
//   - If unsure, Google "<date> <time> BST to UTC" — the site converts UTC
//     to America/Chicago on the fly, so get the UTC right and the render
//     will follow.
const MANUAL_FIXTURES = [
  // FA Cup semi-final — Sunday 26 April 2026, 3:00 PM BST at Wembley (BST = UTC+1).
  {
    id: 'fa-cup-semi-chelsea-leeds-2026',
    utcDate: '2026-04-26T14:00:00Z',
    home: 'Chelsea',
    away: 'Leeds United',
    comp: 'FA Cup',
    status: 'SCHEDULED',
  },
];

const mergeAndSort = (apiMatches) => {
  const byId = new Map();
  for (const m of [...MANUAL_FIXTURES, ...apiMatches]) {
    byId.set(String(m.id), m);
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(a.utcDate) - new Date(b.utcDate)
  );
};

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
      // Upstream reachable but returned an error — degrade to manual list.
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
          'Netlify-CDN-Cache-Control': 'public, s-maxage=60',
        },
        body: JSON.stringify({ matches: mergeAndSort([]) }),
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
      body: JSON.stringify({ matches: mergeAndSort(cleaned) }),
    };
  } catch (error) {
    // Network/transport failure — still return the manual list so the site has content.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=60',
      },
      body: JSON.stringify({ matches: mergeAndSort([]) }),
    };
  }
};
