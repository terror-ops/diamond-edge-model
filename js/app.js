// ============================================================
// HARDCODED CONFIG — edit these before deploying
// ============================================================
// ============================================================
// PROXY LAYER
// ============================================================
const PROXIES = [
  { name: 'corsproxy.io', wrap: u => 'https://corsproxy.io/?url=' + encodeURIComponent(u) },
  { name: 'allorigins.win', wrap: u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u) },
  { name: 'codetabs', wrap: u => 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u) }
];

async function proxyFetch(targetUrl) {
  let lastError = null;
  for (const p of PROXIES) {
    try {
      const r = await fetch(p.wrap(targetUrl));
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const data = await r.json();
      return { data, proxy: p.name };
    } catch (e) { lastError = e; }
  }
  throw new Error('All proxies failed. Last: ' + (lastError ? lastError.message : 'unknown'));
}

// ============================================================
// TEAM DATABASE
// ============================================================
const TEAMS = {
  'ARI': { id: 109, espn: 'ARI', name: 'Arizona Diamondbacks', vsLHP: 0.322, vsRHP: 0.316, park: 1.02, lat: 33.4453, lon: -112.0667, roof: 'retractable' },
  'ATL': { id: 144, espn: 'ATL', name: 'Atlanta Braves',       vsLHP: 0.335, vsRHP: 0.328, park: 1.01, lat: 33.8908, lon: -84.4678,  roof: 'open' },
  'BAL': { id: 110, espn: 'BAL', name: 'Baltimore Orioles',    vsLHP: 0.328, vsRHP: 0.319, park: 1.03, lat: 39.2839, lon: -76.6217,  roof: 'open' },
  'BOS': { id: 111, espn: 'BOS', name: 'Boston Red Sox',       vsLHP: 0.325, vsRHP: 0.316, park: 1.06, lat: 42.3467, lon: -71.0972,  roof: 'open' },
  'CHC': { id: 112, espn: 'CHC', name: 'Chicago Cubs',         vsLHP: 0.319, vsRHP: 0.322, park: 1.01, lat: 41.9484, lon: -87.6553,  roof: 'open' },
  'CWS': { id: 145, espn: 'CHW', name: 'Chicago White Sox',    vsLHP: 0.298, vsRHP: 0.293, park: 1.02, lat: 41.8300, lon: -87.6339,  roof: 'open' },
  'CIN': { id: 113, espn: 'CIN', name: 'Cincinnati Reds',      vsLHP: 0.321, vsRHP: 0.315, park: 1.05, lat: 39.0975, lon: -84.5066,  roof: 'open' },
  'CLE': { id: 114, espn: 'CLE', name: 'Cleveland Guardians',  vsLHP: 0.318, vsRHP: 0.312, park: 0.99, lat: 41.4962, lon: -81.6852,  roof: 'open' },
  'COL': { id: 115, espn: 'COL', name: 'Colorado Rockies',     vsLHP: 0.316, vsRHP: 0.307, park: 1.20, lat: 39.7559, lon: -104.9942, roof: 'open' },
  'DET': { id: 116, espn: 'DET', name: 'Detroit Tigers',       vsLHP: 0.320, vsRHP: 0.314, park: 0.98, lat: 42.3390, lon: -83.0485,  roof: 'open' },
  'HOU': { id: 117, espn: 'HOU', name: 'Houston Astros',       vsLHP: 0.324, vsRHP: 0.317, park: 1.02, lat: 29.7572, lon: -95.3554,  roof: 'retractable' },
  'KC':  { id: 118, espn: 'KC',  name: 'Kansas City Royals',   vsLHP: 0.312, vsRHP: 0.305, park: 0.99, lat: 39.0517, lon: -94.4803,  roof: 'open' },
  'LAA': { id: 108, espn: 'LAA', name: 'Los Angeles Angels',   vsLHP: 0.316, vsRHP: 0.309, park: 0.99, lat: 33.8003, lon: -117.8827, roof: 'open' },
  'LAD': { id: 119, espn: 'LAD', name: 'Los Angeles Dodgers',  vsLHP: 0.339, vsRHP: 0.333, park: 1.00, lat: 34.0739, lon: -118.2400, roof: 'open' },
  'MIA': { id: 146, espn: 'MIA', name: 'Miami Marlins',        vsLHP: 0.310, vsRHP: 0.302, park: 0.94, lat: 25.7781, lon: -80.2197,  roof: 'retractable' },
  'MIL': { id: 158, espn: 'MIL', name: 'Milwaukee Brewers',    vsLHP: 0.322, vsRHP: 0.316, park: 1.01, lat: 43.0280, lon: -87.9712,  roof: 'retractable' },
  'MIN': { id: 142, espn: 'MIN', name: 'Minnesota Twins',      vsLHP: 0.318, vsRHP: 0.312, park: 0.99, lat: 44.9817, lon: -93.2776,  roof: 'open' },
  'NYM': { id: 121, espn: 'NYM', name: 'New York Mets',        vsLHP: 0.320, vsRHP: 0.315, park: 0.95, lat: 40.7571, lon: -73.8458,  roof: 'open' },
  'NYY': { id: 147, espn: 'NYY', name: 'New York Yankees',     vsLHP: 0.330, vsRHP: 0.327, park: 1.04, lat: 40.8296, lon: -73.9262,  roof: 'open' },
  'OAK': { id: 133, espn: 'ATH', name: 'Athletics',            vsLHP: 0.314, vsRHP: 0.308, park: 1.05, lat: 38.5803, lon: -121.5135, roof: 'open' },
  'PHI': { id: 143, espn: 'PHI', name: 'Philadelphia Phillies',vsLHP: 0.327, vsRHP: 0.321, park: 1.04, lat: 39.9061, lon: -75.1665,  roof: 'open' },
  'PIT': { id: 134, espn: 'PIT', name: 'Pittsburgh Pirates',   vsLHP: 0.308, vsRHP: 0.304, park: 0.97, lat: 40.4469, lon: -80.0057,  roof: 'open' },
  'SD':  { id: 135, espn: 'SD',  name: 'San Diego Padres',     vsLHP: 0.324, vsRHP: 0.318, park: 0.94, lat: 32.7073, lon: -117.1566, roof: 'open' },
  'SF':  { id: 137, espn: 'SF',  name: 'San Francisco Giants', vsLHP: 0.316, vsRHP: 0.310, park: 0.92, lat: 37.7786, lon: -122.3893, roof: 'open' },
  'SEA': { id: 136, espn: 'SEA', name: 'Seattle Mariners',     vsLHP: 0.318, vsRHP: 0.312, park: 0.93, lat: 47.5914, lon: -122.3325, roof: 'retractable' },
  'STL': { id: 138, espn: 'STL', name: 'St. Louis Cardinals',  vsLHP: 0.317, vsRHP: 0.311, park: 0.99, lat: 38.6226, lon: -90.1928,  roof: 'open' },
  'TB':  { id: 139, espn: 'TB',  name: 'Tampa Bay Rays',       vsLHP: 0.320, vsRHP: 0.314, park: 0.97, lat: 27.7682, lon: -82.6534,  roof: 'dome' },
  'TEX': { id: 140, espn: 'TEX', name: 'Texas Rangers',        vsLHP: 0.323, vsRHP: 0.317, park: 1.02, lat: 32.7472, lon: -97.0846,  roof: 'retractable' },
  'TOR': { id: 141, espn: 'TOR', name: 'Toronto Blue Jays',    vsLHP: 0.321, vsRHP: 0.315, park: 1.02, lat: 43.6414, lon: -79.3894,  roof: 'retractable' },
  'WAS': { id: 120, espn: 'WSH', name: 'Washington Nationals', vsLHP: 0.314, vsRHP: 0.308, park: 1.00, lat: 38.8730, lon: -77.0074,  roof: 'open' }
};
const ID_TO_CODE = {};
Object.keys(TEAMS).forEach(code => { ID_TO_CODE[TEAMS[code].id] = code; });

const fetchCache = {
  bullpenIP: {},
  statcast: null,
  lineups: {}
};

// Wire hardcoded values
document.getElementById('weather_key').value = HARDCODED_WEATHER_KEY;
document.getElementById('tracker_url').value = HARDCODED_TRACKER_URL;

// Reveal Tracker tab only for admin
let IS_ADMIN = false;
(function checkAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('key') === ADMIN_KEY) {
    IS_ADMIN = true;
    document.getElementById('tab-tracker-btn').style.display = 'block';
  }
})();

// Populate team dropdowns
const awaySel = document.getElementById('away');
const homeSel = document.getElementById('home');
Object.keys(TEAMS).sort().forEach(code => {
  const t = TEAMS[code];
  const opt = '<option value="' + code + '">' + code + ' — ' + t.name + '</option>';
  awaySel.innerHTML += opt;
  homeSel.innerHTML += opt;
});

// Default dates
document.getElementById('gamedate').valueAsDate = new Date();
document.getElementById('board-date').valueAsDate = new Date();

// Tab switching
function switchTab(name) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.getElementById('tab-' + name + '-btn').classList.add('active');
  if (name === 'board' && !window._boardLoaded) { loadBoard(); window._boardLoaded = true; }
  if (name === 'tracker' && !window._trackerLoaded) { loadTrackerData(); window._trackerLoaded = true; }
}

window.addEventListener('load', () => { loadBoard(); window._boardLoaded = true; });

const MLB_API     = 'https://statsapi.mlb.com/api/v1';
const ESPN_API    = 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard';
const ESPN_SUMMARY= 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary';
const WEATHER_API = 'https://api.openweathermap.org/data/2.5/forecast';

const PARK_ORIENTATION = {
  'ARI': 320, 'ATL': 35,  'BAL': 90,  'BOS': 95,  'CHC': 95,
  'CWS': 5,   'CIN': 340, 'CLE': 65,  'COL': 20,  'DET': 30,
  'HOU': 25,  'KC':  5,   'LAA': 225, 'LAD': 55,  'MIA': 0,
  'MIL': 110, 'MIN': 100, 'NYM': 55,  'NYY': 65,  'OAK': 230,
  'PHI': 55,  'PIT': 80,  'SD':  320, 'SF':  55,  'SEA': 25,
  'STL': 15,  'TB':  0,   'TEX': 30,  'TOR': 0,   'WAS': 65
};

function setStatus(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = 'status ' + (type || '');
}
function flash(input) { input.classList.add('auto-filled'); }
function clearFlash() {
  document.querySelectorAll('.input.auto-filled').forEach(el => el.classList.remove('auto-filled'));
}
function fmtDateESPN(d) { return d.replace(/-/g, ''); }

// ============================================================
// BOARD VIEW
// ============================================================
async function loadBoard() {
  const date = document.getElementById('board-date').value;
  const list = document.getElementById('board-list');
  list.innerHTML = '<div class="spinner-container">Loading slate…</div>';
  setStatus('board-status', 'Fetching schedule from MLB…', 'loading');

  let games = [];
  try {
    const url = MLB_API + '/schedule?sportId=1&date=' + date + '&hydrate=probablePitcher,team,venue';
    const result = await proxyFetch(url);
    if (!result.data.dates || result.data.dates.length === 0) {
      list.innerHTML = '<div class="empty">No games on ' + date + '.</div>';
      setStatus('board-status', '', '');
      document.getElementById('board-meta').textContent = '0 games';
      return;
    }
    games = result.data.dates[0].games;
  } catch (e) {
    list.innerHTML = '<div class="empty">Failed to load slate.</div>';
    setStatus('board-status', '✗ ' + e.message, 'error');
    return;
  }

  document.getElementById('board-meta').textContent = games.length + ' games';
  setStatus('board-status', 'Fetching ESPN odds…', 'loading');

  let espnEvents = [];
  try {
    const espnUrl = ESPN_API + '?dates=' + fmtDateESPN(date);
    const espnResult = await proxyFetch(espnUrl);
    espnEvents = espnResult.data.events || [];
  } catch (e) { /* render without odds */ }

  list.innerHTML = '';
  games.forEach(g => {
    const awayId   = g.teams.away.team.id;
    const homeId   = g.teams.home.team.id;
    const awayCode = ID_TO_CODE[awayId];
    const homeCode = ID_TO_CODE[homeId];
    if (!awayCode || !homeCode) return;

    const time    = new Date(g.gameDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const awaySp  = g.teams.away.probablePitcher ? g.teams.away.probablePitcher.fullName : 'TBD';
    const homeSp  = g.teams.home.probablePitcher ? g.teams.home.probablePitcher.fullName : 'TBD';

    let awayML = null, homeML = null, total = null;
    let overOdds = null, underOdds = null;
    const awayEspn = TEAMS[awayCode].espn;
    const homeEspn = TEAMS[homeCode].espn;

    for (const ev of espnEvents) {
      const comp = ev.competitions && ev.competitions[0];
      if (!comp) continue;
      const competitors = comp.competitors || [];
      const home = competitors.find(c => c.homeAway === 'home');
      const away = competitors.find(c => c.homeAway === 'away');
      if (!home || !away) continue;
      if (home.team && home.team.abbreviation === homeEspn &&
          away.team && away.team.abbreviation === awayEspn) {
        const odds = comp.odds && comp.odds[0];
        if (odds) {
          const mls = extractMLFromOddsObj(odds);
          awayML   = mls.awayML;
          homeML   = mls.homeML;
          total    = extractTotal(odds);
          overOdds  = odds.overOdds  != null ? parseAmerican(odds.overOdds)  : null;
          underOdds = odds.underOdds != null ? parseAmerican(odds.underOdds) : null;
          if (overOdds == null && odds.overUnderOdds != null) {
            const parts = String(odds.overUnderOdds).split('/');
            overOdds  = parts[0] ? parseAmerican(parts[0]) : null;
            underOdds = parts[1] ? parseAmerican(parts[1]) : null;
          }
        }
        break;
      }
    }

    const div = document.createElement('div');
    div.className = 'board-game';
    div.onclick = () => openGameInAnalyzer(awayCode, homeCode, date, awaySp, homeSp,
                       g.teams.away.probablePitcher ? g.teams.away.probablePitcher.id : null,
                       g.teams.home.probablePitcher ? g.teams.home.probablePitcher.id : null,
                       awayML, homeML, total);

    const totalsTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const oddsHtml = (awayML != null || homeML != null || total != null)
      ? '<div class="board-odds">' +
        (awayML != null ? '<span class="odds-pill">' + awayCode + ' <span class="v">' + (awayML > 0 ? '+' : '') + awayML + '</span></span>' : '') +
        (homeML != null ? '<span class="odds-pill">' + homeCode + ' <span class="v">' + (homeML > 0 ? '+' : '') + homeML + '</span></span>' : '') +
        (total  != null ? '<span class="odds-pill">O/U <span class="v">' + total + '</span></span>' : '') +
        (overOdds  != null ? '<span class="odds-pill">O <span class="v">' + (overOdds  > 0 ? '+' : '') + overOdds  + '</span></span>' : '') +
        (underOdds != null ? '<span class="odds-pill">U <span class="v">' + (underOdds > 0 ? '+' : '') + underOdds + '</span></span>' : '') +
        '<span class="odds-pill" style="color:var(--text-3);font-size:10px;">⏱ ' + totalsTimestamp + '</span>' +
        '</div>'
      : '';

    div.innerHTML =
      '<div class="board-row">' +
      '<div class="board-teams">' +
      '<div class="board-team">' + awayCode + '</div>' +
      '<div class="board-vs">@</div>' +
      '<div class="board-team">' + homeCode + '</div>' +
      '</div>' +
      '<div class="board-time">' + time + '</div>' +
      '</div>' +
      '<div class="board-pitchers">' + awaySp + ' vs ' + homeSp + '</div>' +
      oddsHtml;

    list.appendChild(div);
  });

  setStatus('board-status', '✓ Slate loaded. Tap any game to analyze.', 'success');
}

async function openGameInAnalyzer(awayCode, homeCode, date, awaySpName, homeSpName, awaySpId, homeSpId, awayML, homeML, total) {
  document.getElementById('away').value      = awayCode;
  document.getElementById('home').value      = homeCode;
  document.getElementById('gamedate').value  = date;
  document.getElementById('away_sp').value   = awaySpName;
  document.getElementById('home_sp').value   = homeSpName;
  if (awaySpId) document.getElementById('away_sp').dataset.pid = awaySpId;
  if (homeSpId) document.getElementById('home_sp').dataset.pid = homeSpId;
  if (awayML != null) document.getElementById('away_ml').value = awayML;
  if (homeML != null) document.getElementById('home_ml').value = homeML;
  if (total  != null) document.getElementById('total').value   = total;
  switchTab('game');
  await onTeamChange();
}

// ============================================================
// SMART ODDS PARSER
// ============================================================
function parseAmerican(v) {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const cleaned = v.replace(/[^\d\-+]/g, '');
    const n = parseInt(cleaned, 10);
    return isNaN(n) ? null : n;
  }
  return null;
}

function extractMLFromOddsObj(o) {
  if (!o) return { awayML: null, homeML: null };
  let awayML = null, homeML = null;
  if (o.awayTeamOdds && o.awayTeamOdds.moneyLine != null && typeof o.awayTeamOdds.moneyLine !== 'object') {
    awayML = parseAmerican(o.awayTeamOdds.moneyLine);
  }
  if (o.homeTeamOdds && o.homeTeamOdds.moneyLine != null && typeof o.homeTeamOdds.moneyLine !== 'object') {
    homeML = parseAmerican(o.homeTeamOdds.moneyLine);
  }
  if (awayML == null && o.awayTeamOdds && o.awayTeamOdds.current && o.awayTeamOdds.current.moneyLine) {
    awayML = parseAmerican(o.awayTeamOdds.current.moneyLine.american || o.awayTeamOdds.current.moneyLine);
  }
  if (homeML == null && o.homeTeamOdds && o.homeTeamOdds.current && o.homeTeamOdds.current.moneyLine) {
    homeML = parseAmerican(o.homeTeamOdds.current.moneyLine.american || o.homeTeamOdds.current.moneyLine);
  }
  if (awayML == null && o.awayTeamOdds && typeof o.awayTeamOdds.moneyLine === 'object' && o.awayTeamOdds.moneyLine) {
    awayML = parseAmerican(o.awayTeamOdds.moneyLine.american);
  }
  if (homeML == null && o.homeTeamOdds && typeof o.homeTeamOdds.moneyLine === 'object' && o.homeTeamOdds.moneyLine) {
    homeML = parseAmerican(o.homeTeamOdds.moneyLine.american);
  }
  if (awayML == null && o.awayMoneyLine != null) awayML = parseAmerican(o.awayMoneyLine);
  if (homeML == null && o.homeMoneyLine != null) homeML = parseAmerican(o.homeMoneyLine);
  return { awayML, homeML };
}

function pickBestOddsEntry(oddsArray) {
  if (!Array.isArray(oddsArray) || oddsArray.length === 0) return null;
  for (const o of oddsArray) {
    const ml = extractMLFromOddsObj(o);
    if (ml.awayML != null || ml.homeML != null) return o;
  }
  for (const o of oddsArray) { if (o.overUnder != null) return o; }
  return oddsArray[0];
}

function extractTotal(o) {
  if (!o) return null;
  if (o.overUnder != null) { const v = parseFloat(o.overUnder); if (!isNaN(v)) return v; }
  if (o.total)             { const v = parseFloat(o.total.american || o.total); if (!isNaN(v)) return v; }
  return null;
}

// ============================================================
// DIAGNOSTIC
// ============================================================
async function runDiagnostic() {
  const diag = document.getElementById('diag');
  diag.classList.remove('error');
  diag.classList.add('show');
  diag.innerHTML = '> Testing…';

  const lines = [];
  try {
    const start = Date.now();
    const result = await proxyFetch(MLB_API + '/sports/1');
    lines.push('> [200] MLB via ' + result.proxy + ' (' + (Date.now() - start) + 'ms)');
  } catch (e) { lines.push('> [FAIL] MLB: ' + e.message); }

  try {
    const start = Date.now();
    const result = await proxyFetch(ESPN_API);
    const evs = (result.data.events || []).length;
    lines.push('> [200] ESPN via ' + result.proxy + ' (' + (Date.now() - start) + 'ms) · ' + evs + ' events');
  } catch (e) { lines.push('> [FAIL] ESPN: ' + e.message); }

  const wkey = HARDCODED_WEATHER_KEY;
  if (wkey && wkey.indexOf('PASTE_') !== 0) {
    try {
      const start = Date.now();
      const url   = WEATHER_API + '?lat=40.7128&lon=-74.0060&appid=' + wkey + '&units=imperial&cnt=4';
      const result = await proxyFetch(url);
      if (result.data.list && result.data.list.length > 0) {
        lines.push('> [200] OpenWeather forecast via ' + result.proxy + ' (' + (Date.now() - start) + 'ms)');
      } else {
        lines.push('> [FAIL] OpenWeather: ' + (result.data.message || 'invalid key'));
      }
    } catch (e) { lines.push('> [FAIL] OpenWeather: ' + e.message); }
  } else {
    lines.push('> [SKIP] Weather (no API key set)');
  }

  lines.push('> ✓ Done.');
  diag.innerHTML = lines.join('<br>');
}

// ============================================================
// AUTO-FETCH on team change
// ============================================================
async function onTeamChange() {
  const awayCode = document.getElementById('away').value;
  const homeCode = document.getElementById('home').value;
  const date     = document.getElementById('gamedate').value;

  if (!awayCode || !homeCode) { setStatus('game-status', 'Pick both teams.', ''); return; }
  if (awayCode === homeCode)  { setStatus('game-status', 'Away and home must differ.', 'error'); return; }

  clearFlash();
  setStatus('game-status', 'Fetching schedule…', 'loading');

  let game = null;
  try {
    const url    = MLB_API + '/schedule?sportId=1&date=' + date + '&hydrate=probablePitcher,team';
    const result = await proxyFetch(url);
    if (!result.data.dates || result.data.dates.length === 0) {
      setStatus('game-status', 'No games on ' + date + '.', 'error'); return;
    }
    game = result.data.dates[0].games.find(g =>
      ID_TO_CODE[g.teams.away.team.id] === awayCode &&
      ID_TO_CODE[g.teams.home.team.id] === homeCode
    );
    if (!game) { setStatus('game-status', 'No ' + awayCode + ' @ ' + homeCode + ' on this date.', 'error'); return; }
  } catch (e) { setStatus('game-status', '✗ ' + e.message, 'error'); return; }

  const awaySpEl = document.getElementById('away_sp');
  const homeSpEl = document.getElementById('home_sp');
  const awaySp   = game.teams.away.probablePitcher;
  const homeSp   = game.teams.home.probablePitcher;

  const KNOWN_OPENERS = new Set(['TBD', 'Opener', 'Bullpen Game']);
  const awayIsOpener  = !awaySp || KNOWN_OPENERS.has(awaySp.fullName);
  const homeIsOpener  = !homeSp || KNOWN_OPENERS.has(homeSp.fullName);

  if (awaySp) { awaySpEl.value = awaySp.fullName + (awayIsOpener ? ' (opener)' : ''); awaySpEl.dataset.pid = awaySp.id; flash(awaySpEl); }
  else        { awaySpEl.value = 'TBD — Bullpen Game'; awaySpEl.dataset.pid = ''; awaySpEl.dataset.opener = 'true'; flash(awaySpEl); }
  if (homeSp) { homeSpEl.value = homeSp.fullName + (homeIsOpener ? ' (opener)' : ''); homeSpEl.dataset.pid = homeSp.id; flash(homeSpEl); }
  else        { homeSpEl.value = 'TBD — Bullpen Game'; homeSpEl.dataset.pid = ''; homeSpEl.dataset.opener = 'true'; flash(homeSpEl); }

  setStatus('game-status', 'Fetching FIPs, bullpen, odds, weather, Statcast…', 'loading');

  const season  = new Date(date).getFullYear();
  const statcast = await getStatcastData();
  const tasks    = [];
  const gamePk   = game.gamePk;

  if (awaySp && awaySp.id) {
    tasks.push(fetchSpFip(awaySp.id, season, awayIsOpener, awayCode, statcast)
      .then(f => ({ kind: 'fip', side: 'away', ...f })));
  } else {
    tasks.push(fetchBullpenEraAsFip(awayCode, season)
      .then(f => ({ kind: 'fip', side: 'away', fip: f, isOpener: true, hasStatcast: false })));
  }
  if (homeSp && homeSp.id) {
    tasks.push(fetchSpFip(homeSp.id, season, homeIsOpener, homeCode, statcast)
      .then(f => ({ kind: 'fip', side: 'home', ...f })));
  } else {
    tasks.push(fetchBullpenEraAsFip(homeCode, season)
      .then(f => ({ kind: 'fip', side: 'home', fip: f, isOpener: true, hasStatcast: false })));
  }

  tasks.push(fetchConfirmedLineup(gamePk, awayCode, statcast).then(r => ({ kind: 'lineup', side: 'away', result: r })));
  tasks.push(fetchConfirmedLineup(gamePk, homeCode, statcast).then(r => ({ kind: 'lineup', side: 'home', result: r })));
  tasks.push(fetchBullpenProfile(awayCode, date).then(p => ({ kind: 'bp', side: 'away', profile: p })));
  tasks.push(fetchBullpenProfile(homeCode, date).then(p => ({ kind: 'bp', side: 'home', profile: p })));
  tasks.push(fetchEspnOdds(awayCode, homeCode, date));
  tasks.push(fetchWeather(homeCode));

  const results = await Promise.allSettled(tasks);
  const lineupXwoba = { away: null, home: null };

  results.forEach(r => {
    if (r.status !== 'fulfilled' || !r.value) return;
    const v = r.value;
    if (v.kind === 'fip') {
      const el = document.getElementById(v.side + '_fip');
      el.value = v.fip.toFixed(2);
      el.dataset.opener    = v.isOpener    ? 'true' : 'false';
      el.dataset.statcast  = v.hasStatcast ? 'true' : 'false';
      el.dataset.pitchHand = v.pitchHand || '';
      el.dataset.spStatcast = v.spStatcast ? JSON.stringify(v.spStatcast) : '';
      flash(el);
    } else if (v.kind === 'bp') {
      const el = document.getElementById(v.side + '_bp_ip');
      el.value = v.profile.totalReliefIP.toFixed(1);
      el.dataset.bpProfile = JSON.stringify({
        label:            v.profile.label,
        score:            v.profile.fatigueScore,
        multiplier:       v.profile.multiplier,
        closerAvail:      v.profile.closerAvail,
        highLevAvail:     v.profile.highLevAvail,
        daysSinceLastGame: v.profile.daysSinceLastGame,
        restDiscount:     v.profile.restDiscount
      });
      flash(el);
    } else if (v.kind === 'lineup') {
      if (v.result && v.result.confirmed) {
        lineupXwoba[v.side] = v.result.xwoba;
        const side = v.side === 'away' ? 'Away' : 'Home';
        const msg  = v.result.xwoba
          ? '✓ ' + side + ' lineup confirmed · xwOBA ' + v.result.xwoba.toFixed(3) + ' (' + v.result.coverage + ')'
          : '✓ ' + side + ' lineup confirmed · Statcast matching in progress';
        setStatus('game-status', msg, 'success');
      }
    }
  });

  window._lineupXwoba = lineupXwoba;
  window._statcast    = statcast;

  const statcastMsg = statcast && statcast.pitchers && Object.keys(statcast.pitchers).length > 0
    ? ' · Statcast: ' + Object.keys(statcast.pitchers).length + ' pitchers / ' + Object.keys(statcast.hitters).length + ' hitters'
    : ' · Statcast: not loaded';

  setStatus('game-status', '✓ All data loaded' + statcastMsg + '. Ready to run analysis.', 'success');
}

// ============================================================
// STATCAST DATA — PATCH A+B: name index + name-based lookup
// ============================================================

// Normalize a name string for index matching
// Normalize a name: decompose accents, lowercase, strip non-alpha, collapse spaces
function _normName(s) {
  return String(s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // é → e, ñ → n, etc.
    .toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
}

// Build name→rawKey index at Statcast load time.
// Indexes every key three ways: normalized, flipped (Last,First → First Last), initial+last.
function _buildPitcherNameIdx(pitchers) {
  const idx = {};
  Object.keys(pitchers).forEach(key => {
    const norm  = _normName(key);
    const parts = norm.split(' ');
    idx[norm] = key;                                         // "brown hunter" or "hunter brown"
    if (key.includes(',')) {                                 // "Brown, Hunter" → also "hunter brown"
      const p = key.split(',').map(s => s.trim());
      idx[_normName(p[1] + ' ' + p[0])] = key;
    }
    if (parts.length >= 2) {                                 // "h brown" → fast initial+last lookup
      const initLast = parts[0][0] + ' ' + parts[parts.length - 1];
      if (!idx[initLast]) idx[initLast] = key;
    }
  });
  return idx;
}

// Robust 4-step pitcher lookup. Returns { p, path } where path is the match type for logging.
function _findStatcastPitcher(pitchers, idx, pitcherId, pitcherName) {
  const sc = window._statcast;

  if (!sc) {
    console.warn("No statcast loaded");
    return { p: null, path: 'no-statcast' };
  }

  const safePitchers = pitchers || sc.pitchers;
  const safeIdx = idx || sc.pitcherNameIdx;

  // 1. ID match
  if (pitcherId && safePitchers[pitcherId]) {
    return { p: safePitchers[pitcherId], path: 'id' };
  }

  if (!pitcherName) {
    return { p: null, path: 'no-name' };
  }

  const norm = _normName(pitcherName);
  const parts = norm.split(' ');
  const last = parts[parts.length - 1];
  const initLast = parts[0][0] + ' ' + last;

  // 2. Full name
  if (safeIdx?.[norm]) {
    return { p: safePitchers[safeIdx[norm]], path: 'norm:' + safeIdx[norm] };
  }

  // 3. Initial + last
  if (safeIdx?.[initLast]) {
    return { p: safePitchers[safeIdx[initLast]], path: 'initial:' + safeIdx[initLast] };
  }

  // 4. Last name fallback
  const lastMatches = Object.keys(safeIdx || {}).filter(k => k.split(' ').pop() === last);

  if (lastMatches.length === 1) {
    return {
      p: safePitchers[safeIdx[lastMatches[0]]],
      path: 'lastname:' + safeIdx[lastMatches[0]]
    };
  }

  console.warn("Statcast no match:", pitcherName, "→", norm);

  return { p: null, path: 'no-match' };
}

async function getStatcastData() {
  // Bust cache if stale OR missing pitcherNameIdx (loaded before name-matching patch deployed)
  const cached = fetchCache.statcast;
  if (cached && cached.pitcherNameIdx && (Date.now() - cached.ts) < 4 * 60 * 60 * 1000) {
    return cached;
  }
  const url = HARDCODED_TRACKER_URL;
  if (!url || url.indexOf('PASTE_') === 0) return null;
  try {
    const r    = await fetch(url + '?action=getStatcastData');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    if (!data.success) return null;

    const pfn = v => { const n = parseFloat(v); return isNaN(n) ? null : n; };

    // Normalize pitcher records
    const pitchers = {};
    Object.entries(data.pitchers || {}).forEach(([id, p]) => {
      pitchers[id] = {
      name:    p.name || p.player_name || p.playerName,   // ⭐ THIS LINE FIXES EVERYTHING
      xwoba:   pfn(p.xwoba),
      xera:    pfn(p.xera),
      kPct:    pfn(p.kPct ?? p.k_pct),
      hardHit: pfn(p.hardHit ?? p.hard_hit),
      barrel:  pfn(p.barrel),
      pa:      parseInt(p.pa) || 0
      };
    });

    // Build name→key index using the robust multi-format builder
    const pitcherNameIdx = _buildPitcherNameIdx(pitchers);

    // Normalize hitter records
    const hitters = {};
    Object.entries(data.hitters || {}).forEach(([id, h]) => {
      hitters[id] = {
        xwoba:   pfn(h.xwoba),
        barrel:  pfn(h.barrel),
        hardHit: pfn(h.hardHit ?? h.hard_hit),
        kPct:    pfn(h.kPct    ?? h.k_pct),
        pa:      parseInt(h.pa) || 0
      };
    });

    fetchCache.statcast = { hitters, pitchers, pitcherNameIdx, updated: data.updated, ts: Date.now() };
    window._statcast = fetchCache.statcast;  // expose globally for runAnalysis fallback

    const pKeys = Object.keys(pitchers);
    console.log('[DE Statcast] Loaded — pitchers:', pKeys.length,
      '| hitters:', Object.keys(hitters).length);
    console.log('[DE Statcast] First 30 pitcher keys:', pKeys.slice(0, 30));
    return fetchCache.statcast;
  } catch (e) {
    console.warn('[DE Statcast] Fetch failed:', e);
    return null;
  }
}

// PATCH B: robust multi-step lookup via _findStatcastPitcher
function blendFipWithXwoba(fip, pitcherId, statcast, pitcherName) {
  const sc = statcast || window._statcast;  // fall back to global if arg is null
  if (!sc || !sc.pitchers) return { fip, hasStatcast: false };

  const { p, path } = _findStatcastPitcher(sc.pitchers, sc.pitcherNameIdx, pitcherId, pitcherName);

  console.log('[DE Statcast] Pitcher lookup — name:', pitcherName || '(none)',
    '| id:', pitcherId, '| match:', path, '| pa:', p ? p.pa : 0);

  if (!p || p.pa < 50) return { fip, hasStatcast: false };

  let statcastEra = null;
  if (p.xera  != null)      { statcastEra = p.xera; }
  else if (p.xwoba != null) { statcastEra = (p.xwoba - 0.250) * 40 + 2.50; }
  if (statcastEra == null)  return { fip, hasStatcast: false };

  const LEAGUE_KPCT    = 22.0;
  const LEAGUE_HARDHIT = 36.0;
  const kAdj      = p.kPct    != null ? (p.kPct    - LEAGUE_KPCT)    * -0.04 : 0;
  const hardHitAdj = p.hardHit != null ? (p.hardHit - LEAGUE_HARDHIT) *  0.03 : 0;
  statcastEra = Math.max(1.5, Math.min(9.0, statcastEra + kAdj + hardHitAdj));

  const weight  = p.xera != null ? 0.55 : 0.45;
  const blended = fip * (1 - weight) + statcastEra * weight;
  return {
    fip:         Math.max(1.5, Math.min(8.0, blended)),
    hasStatcast: true,
    xwoba:       p.xwoba,
    xera:        p.xera,
    kPct:        p.kPct,
    hardHit:     p.hardHit
  };
}

// ============================================================
// SP FIP FETCH — PATCH C: extract pitcherFullName for Statcast matching
// ============================================================
async function fetchSpFip(pid, season, isOpener, teamCode, statcast) {
  let pitchHand = '';
  let pitcherFullName = '';

  const [handResult, statsResult] = await Promise.allSettled([
    proxyFetch(MLB_API + '/people/' + pid + '?hydrate=currentTeam'),
    proxyFetch(MLB_API + '/people/' + pid + '/stats?stats=season&group=pitching&season=' + season)
  ]);

  if (handResult.status === 'fulfilled') {
    try {
      const person = handResult.value.data.people && handResult.value.data.people[0];
      if (person) {
        if (person.pitchHand && person.pitchHand.code) pitchHand = person.pitchHand.code;
        if (person.fullName) pitcherFullName = person.fullName; // key for Statcast name matching
      }
    } catch (e) { /* non-fatal */ }
  }

  try {
    const result = statsResult.status === 'fulfilled' ? statsResult.value : null;
    const d = result && result.data;
    if (d && d.stats && d.stats[0] && d.stats[0].splits[0]) {
      const s = d.stats[0].splits[0].stat;
      const ip = parseFloat(s.inningsPitched) || 0;
      const starts = s.gamesStarted || 1;
      const ipPerStart = ip / Math.max(1, starts);
      const detectedOpener = isOpener || ipPerStart < 3;

      let fip = 4.20;
      if (ip >= 5) {
        const hr = s.homeRuns || 0;
        const bb = s.baseOnBalls || 0;
        const k  = s.strikeOuts || 0;
        fip = (13 * hr + 3 * bb - 2 * k) / ip + 3.10;
      } else {
        fip = parseFloat(s.era) || 4.20;
      }

      // Pass pitcherFullName so blendFipWithXwoba can match by name
      const blended    = blendFipWithXwoba(fip, pid, statcast, pitcherFullName);
      fip              = blended.fip;
      const spStatcast = { xwoba: blended.xwoba, xera: blended.xera, kPct: blended.kPct, hardHit: blended.hardHit };

      if (detectedOpener) {
        const bpEra = await fetchBullpenEraAsFip(teamCode, season);
        fip = fip * 0.4 + bpEra * 0.6;
        return { fip, isOpener: true, hasStatcast: blended.hasStatcast, pitchHand, spStatcast };
      }
      return { fip, isOpener: false, hasStatcast: blended.hasStatcast, pitchHand, spStatcast };
    }
  } catch (e) { /* ignore */ }
  return { fip: 4.20, isOpener: false, hasStatcast: false, pitchHand };
}

async function fetchBullpenEraAsFip(teamCode, season) {
  try {
    const teamId = TEAMS[teamCode].id;
    const url    = MLB_API + '/teams/' + teamId + '/stats?season=' + season + '&group=pitching&stats=season';
    const result = await proxyFetch(url);
    const d      = result.data;
    if (d.stats && d.stats[0] && d.stats[0].splits[0]) {
      const era = parseFloat(d.stats[0].splits[0].stat.era) || 4.50;
      return era * 1.02;
    }
  } catch (e) { /* ignore */ }
  return 4.50;
}

// ============================================================
// LINEUP CONFIRMATION
// ============================================================
async function fetchConfirmedLineup(gamePk, teamCode, statcast) {
  try {
    const url    = MLB_API + '/game/' + gamePk + '/boxscore';
    const result = await proxyFetch(url);
    const d      = result.data;

    let teamSide = null;
    if (d.teams && d.teams.away && d.teams.away.team && ID_TO_CODE[d.teams.away.team.id] === teamCode) teamSide = 'away';
    if (!teamSide && d.teams && d.teams.home && d.teams.home.team && ID_TO_CODE[d.teams.home.team.id] === teamCode) teamSide = 'home';
    if (!teamSide) return null;

    const teamData      = d.teams[teamSide];
    const battingOrder  = teamData.battingOrder || [];
    if (battingOrder.length === 0) return null;

    if (statcast && statcast.hitters && Object.keys(statcast.hitters).length > 0) {
      const xwobas = [], top4xwobas = [];
      battingOrder.slice(0, 9).forEach((playerId, idx) => {
        const h = statcast.hitters[playerId];
        if (h && h.pa >= 30) { xwobas.push(h.xwoba); if (idx < 4) top4xwobas.push(h.xwoba); }
      });
      if (xwobas.length >= 6) {
        const avgAll  = xwobas.reduce((a, b) => a + b, 0) / xwobas.length;
        const avgTop4 = top4xwobas.length > 0 ? top4xwobas.reduce((a, b) => a + b, 0) / top4xwobas.length : avgAll;
        return { confirmed: true, xwoba: avgAll * 0.7 + avgTop4 * 0.3, coverage: xwobas.length + '/9 hitters in Statcast', playerIds: battingOrder };
      }
    }
    return { confirmed: true, xwoba: null, coverage: '0/9 in Statcast', playerIds: battingOrder };
  } catch (e) { return null; }
}

// ============================================================
// BULLPEN PROFILE — PATCH D: rest discount on fatigue score
// ============================================================
async function fetchBullpenProfile(teamCode, date) {
  const cacheKey = 'bp2_' + teamCode + '_' + date;
  if (fetchCache.bullpenIP[cacheKey] != null) return fetchCache.bullpenIP[cacheKey];

  const teamId    = TEAMS[teamCode].id;
  const today     = new Date(date);
  const startDate = new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000);
  const endDate   = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
  const fmt       = d => d.toISOString().split('T')[0];

  setStatus('bullpen-status', 'Fetching ' + teamCode + ' BP profile…', 'loading');

  const profile = {
    totalReliefIP:    0,
    pitcherLogs:      {},
    fatigueScore:     0,
    closerAvail:      true,
    highLevAvail:     true,
    label:            'N/A',
    daysSinceLastGame: 99,
    restDiscount:     1.0
  };

  try {
    const schedUrl    = MLB_API + '/schedule?sportId=1&teamId=' + teamId +
                        '&startDate=' + fmt(startDate) + '&endDate=' + fmt(endDate);
    const schedResult = await proxyFetch(schedUrl);
    const dates       = schedResult.data.dates || [];
    const gamePks     = [];
    dates.forEach(d => d.games.forEach(g => {
      if (g.status && g.status.statusCode === 'F') gamePks.push({ pk: g.gamePk, date: g.gameDate.split('T')[0] });
    }));
    const last3 = gamePks.slice(-3);

    const yesterday  = new Date(today.getTime() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(today.getTime() - 2 * 86400000).toISOString().split('T')[0];

    for (const { pk, date: gDate } of last3) {
      try {
        const url    = MLB_API + '/game/' + pk + '/boxscore';
        const result = await proxyFetch(url);
        const d      = result.data;
        let teamSide = null;
        if (d.teams?.away?.team?.id === teamId) teamSide = 'away';
        else if (d.teams?.home?.team?.id === teamId) teamSide = 'home';
        if (!teamSide) continue;

        const teamData   = d.teams[teamSide];
        const pitcherIds = teamData.pitchers || [];

        pitcherIds.forEach((pid, idx) => {
          if (idx === 0) return; // skip starter
          const player = teamData.players?.['ID' + pid];
          if (!player?.stats?.pitching) return;
          const ip      = parseFloat(player.stats.pitching.inningsPitched) || 0;
          const pitches = parseInt(player.stats.pitching.pitchesThrown)    || Math.round(ip * 15);
          if (!profile.pitcherLogs[pid]) profile.pitcherLogs[pid] = { ip3g: 0, pitchesYest: 0, appearances: 0, b2b: false, isCloser: false };
          const log = profile.pitcherLogs[pid];
          log.ip3g         += ip;
          log.appearances  += 1;
          profile.totalReliefIP += ip;
          if (gDate === yesterday)  { log.pitchesYest = pitches; log.b2b = log.appearances > 1; }
          if (gDate === twoDaysAgo && log.appearances > 1) log.b2b = true;
        });

        // Identify closer: last reliever in a save situation (≤1 IP)
        const relievers = pitcherIds.slice(1);
        if (relievers.length > 0) {
          const lastPid    = relievers[relievers.length - 1];
          const lastPlayer = teamData.players?.['ID' + lastPid];
          if (lastPlayer?.stats?.pitching) {
            const ip = parseFloat(lastPlayer.stats.pitching.inningsPitched) || 0;
            if (ip >= 0.1 && ip <= 1.1) {
              if (!profile.pitcherLogs[lastPid]) profile.pitcherLogs[lastPid] = { ip3g: 0, pitchesYest: 0, appearances: 0, b2b: false, isCloser: false };
              profile.pitcherLogs[lastPid].isCloser = true;
            }
          }
        }
      } catch (e) { /* ignore single game failure */ }
    }

    // ── PATCH D: Days since last game → rest discount ──────
    let daysSinceLastGame = 99;
    if (gamePks.length > 0) {
      const sorted     = [...gamePks].sort((a, b) => new Date(b.date) - new Date(a.date));
      const lastPlayed = new Date(sorted[0].date);
      daysSinceLastGame = Math.round((today - lastPlayed) / 86400000);
    }
    // 0 = DH same day  1 = played yesterday  2 = one full off-day  3+ = full rest
    let restDiscount = 1.0;
    if      (daysSinceLastGame === 0) restDiscount = 1.00;
    else if (daysSinceLastGame === 1) restDiscount = 0.90;
    else if (daysSinceLastGame === 2) restDiscount = 0.65;
    else                              restDiscount = 0.35;

    profile.daysSinceLastGame = daysSinceLastGame;
    profile.restDiscount      = restDiscount;

    // ── Raw fatigue score ──────────────────────────────────
    let score = 0;
    score += Math.min(40, profile.totalReliefIP * 2.5);
    let closerUsedYest = false, highLevB2B = 0;
    Object.values(profile.pitcherLogs).forEach(log => {
      if (log.pitchesYest > 20) score += 10;
      if (log.pitchesYest > 30) score += 10;
      if (log.b2b)              score += 8;
      if (log.isCloser && log.pitchesYest > 10) { closerUsedYest = true; score += 15; }
      if (!log.isCloser && log.pitchesYest > 25 && log.b2b) highLevB2B++;
    });
    score += highLevB2B * 8;

    // ── Apply rest discount before converting to label ─────
    const rawScore        = Math.round(score);
    profile.fatigueScore  = Math.min(100, Math.round(score * restDiscount));
    profile.closerAvail   = !closerUsedYest;
    profile.highLevAvail  = highLevB2B < 2;

    const tier = profile.fatigueScore;
    if      (tier < 20) { profile.multiplier = 1.00; profile.label = 'Fresh';    }
    else if (tier < 40) { profile.multiplier = 1.02; profile.label = 'Moderate'; }
    else if (tier < 60) { profile.multiplier = 1.05; profile.label = 'Tired';    }
    else if (tier < 80) { profile.multiplier = 1.08; profile.label = 'Taxed';    }
    else                { profile.multiplier = 1.12; profile.label = 'Depleted'; }

    // Status with rest context
    const restStr = daysSinceLastGame <= 0 ? 'game today'
                  : daysSinceLastGame === 1 ? 'played yst'
                  : daysSinceLastGame + 'd rest';
    setStatus('bullpen-status',
      '✓ ' + teamCode + ' BP · ' + profile.label +
      ' · ' + restStr +
      (closerUsedYest ? ' · No closer' : '') +
      ' · Score: ' + profile.fatigueScore + ' (raw ' + rawScore + ')',
      'success');

  } catch (e) {
    profile.totalReliefIP = 9.0; profile.multiplier = 1.0; profile.label = 'N/A';
  }

  fetchCache.bullpenIP[cacheKey] = profile;
  return profile;
}

// ============================================================
// ESPN ODDS FETCH
// ============================================================
async function fetchEspnOdds(awayCode, homeCode, date) {
  setStatus('odds-status', 'Querying ESPN…', 'loading');
  const awayEspn = TEAMS[awayCode].espn;
  const homeEspn = TEAMS[homeCode].espn;
  let scoreboardCompetition = null, eventId = null;

  try {
    const url    = ESPN_API + '?dates=' + fmtDateESPN(date);
    const result = await proxyFetch(url);
    const events = result.data.events || [];
    for (const ev of events) {
      const comp        = ev.competitions && ev.competitions[0];
      if (!comp) continue;
      const competitors = comp.competitors || [];
      const home        = competitors.find(c => c.homeAway === 'home');
      const away        = competitors.find(c => c.homeAway === 'away');
      if (!home || !away) continue;
      if (home.team && home.team.abbreviation === homeEspn && away.team && away.team.abbreviation === awayEspn) {
        scoreboardCompetition = comp; eventId = ev.id; break;
      }
    }
  } catch (e) { setStatus('odds-status', '✗ ' + e.message, 'error'); return; }

  if (!scoreboardCompetition) {
    setStatus('odds-status', 'No ESPN match for ' + awayEspn + ' @ ' + homeEspn, 'error'); return;
  }

  let awayML = null, homeML = null, total = null, overOdds = null, underOdds = null;
  let bookUsed = 'consensus';

  const oddsArray = scoreboardCompetition.odds || [];
  if (oddsArray.length > 0) {
    const best = pickBestOddsEntry(oddsArray);
    if (best) {
      const mls = extractMLFromOddsObj(best);
      awayML    = mls.awayML;
      homeML    = mls.homeML;
      total     = extractTotal(best);
      bookUsed  = (best.provider && best.provider.name) || 'consensus';
      overOdds  = best.overOdds  != null ? parseAmerican(best.overOdds)  : null;
      underOdds = best.underOdds != null ? parseAmerican(best.underOdds) : null;
      if (overOdds == null && best.overUnderOdds != null) {
        const parts = String(best.overUnderOdds).split('/');
        overOdds  = parts[0] ? parseAmerican(parts[0]) : null;
        underOdds = parts[1] ? parseAmerican(parts[1]) : null;
      }
    }
  }

  if ((awayML == null || homeML == null) && eventId) {
    try {
      const summaryUrl = ESPN_SUMMARY + '?event=' + eventId;
      const sumResult  = await proxyFetch(summaryUrl);
      const pc         = sumResult.data.pickcenter || [];
      if (pc.length > 0) {
        const best = pickBestOddsEntry(pc);
        if (best) {
          const mls = extractMLFromOddsObj(best);
          if (awayML  == null) awayML  = mls.awayML;
          if (homeML  == null) homeML  = mls.homeML;
          if (total   == null) total   = extractTotal(best);
          if (overOdds  == null) overOdds  = best.overOdds  != null ? parseAmerican(best.overOdds)  : null;
          if (underOdds == null) underOdds = best.underOdds != null ? parseAmerican(best.underOdds) : null;
          if (best.provider && best.provider.name) bookUsed = best.provider.name;
        }
      }
    } catch (e) { /* keep partial */ }
  }

  if (awayML  != null) { const el = document.getElementById('away_ml');  el.value = awayML;  flash(el); }
  if (homeML  != null) { const el = document.getElementById('home_ml');  el.value = homeML;  flash(el); }
  if (total   != null) { const el = document.getElementById('total');    el.value = total;   flash(el); }
  if ((overOdds != null || underOdds != null)) {
    const juiceEl = document.getElementById('juice');
    if (juiceEl && !juiceEl.value) {
      const oStr = overOdds  != null ? (overOdds  > 0 ? '+' : '') + overOdds  : '-110';
      const uStr = underOdds != null ? (underOdds > 0 ? '+' : '') + underOdds : '-110';
      juiceEl.value = oStr + '/' + uStr;
      flash(juiceEl);
    }
  }

  const parts = [];
  if (awayML != null && homeML != null) parts.push('ML ✓'); else parts.push('ML missing');
  if (total  != null) parts.push('Total ✓'); else parts.push('Total missing');
  if (overOdds != null) parts.push('Juice ✓');

  if (awayML != null || homeML != null || total != null) {
    setStatus('odds-status', '✓ ESPN (' + bookUsed + ') · ' + parts.join(' · '), 'success');
  } else {
    setStatus('odds-status', 'No odds available. Enter manually.', 'error');
  }
}

// ============================================================
// WEATHER
// ============================================================
async function fetchWeather(homeCode) {
  const team = TEAMS[homeCode];
  const wkey = HARDCODED_WEATHER_KEY;

  if (team.roof === 'dome') {
    const e1 = document.getElementById('temp');    e1.value = 72;      flash(e1);
    const e2 = document.getElementById('wind');    e2.value = 0;       flash(e2);
    const e3 = document.getElementById('run_mod'); e3.value = '1.000'; flash(e3);
    setStatus('weather-status', '✓ Dome — neutralized', 'success');
    return;
  }

  if (!wkey || wkey.indexOf('PASTE_') === 0) {
    setStatus('weather-status', 'No API key — neutral (1.00)', '');
    document.getElementById('run_mod').value = '1.000';
    return;
  }

  setStatus('weather-status', 'Fetching hourly forecast…', 'loading');

  try {
    const url    = WEATHER_API + '?lat=' + team.lat + '&lon=' + team.lon +
                   '&appid=' + wkey + '&units=imperial&cnt=16';
    const result = await proxyFetch(url);
    const d      = result.data;

    if (d.cod && String(d.cod) !== '200') {
      setStatus('weather-status', '✗ ' + (d.message || 'invalid key'), 'error'); return;
    }

    const gameDate   = document.getElementById('gamedate').value;
    const gameTarget = getGameTimeUTC_(gameDate);
    const slot       = findClosestForecastSlot_(d.list, gameTarget);

    const temp     = slot.main  ? slot.main.temp     : 72;
    const humidity = slot.main  ? slot.main.humidity : 60;
    const windMph  = slot.wind  ? (slot.wind.speed || 0) : 0;
    const windDeg  = slot.wind  ? (slot.wind.deg   || 0) : 0;
    const precip   = (slot.rain && slot.rain['3h']) ? Math.min(100, slot.rain['3h'] * 25) : 0;
    const pop      = (slot.pop  || 0) * 100;
    const desc     = slot.weather && slot.weather[0] ? slot.weather[0].description : '';

    const windEffect = computeWindEffect_(homeCode, windDeg, windMph);

    let mod = 1.0;
    if (team.roof === 'retractable' && (pop > 40 || temp < 50)) {
      mod = 1.0;
      setStatus('weather-status', '✓ Retractable roof — likely closed · neutral', 'success');
    } else {
      mod *= 1 + (temp - 70) * 0.001;
      mod *= 1 - Math.max(0, humidity - 70) * 0.0005;
      mod *= windEffect.modifier;
      if (pop > 60) mod *= 0.95;
    }
    mod = Math.max(0.90, Math.min(1.10, mod));

    const e1 = document.getElementById('temp');    e1.value = Math.round(temp);    flash(e1);
    const e2 = document.getElementById('wind');    e2.value = Math.round(windMph); flash(e2);
    const e3 = document.getElementById('run_mod'); e3.value = mod.toFixed(3);      flash(e3);

    const slotTime = new Date(slot.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setStatus('weather-status',
      '✓ Forecast @ ' + slotTime + ' · ' + Math.round(temp) + '°F · ' +
      Math.round(windMph) + ' mph ' + windEffect.label +
      (desc ? ' · ' + desc : '') + ' · mod ' + mod.toFixed(3),
      'success');
  } catch (e) {
    setStatus('weather-status', '✗ ' + e.message, 'error');
    document.getElementById('run_mod').value = '1.000';
  }
}

function getGameTimeUTC_(dateStr) {
  return new Date(dateStr + 'T23:00:00Z').getTime() / 1000;
}

function findClosestForecastSlot_(slots, targetTs) {
  if (!slots || slots.length === 0) return {};
  return slots.reduce((best, slot) => {
    return Math.abs(slot.dt - targetTs) < Math.abs(best.dt - targetTs) ? slot : best;
  });
}

function computeWindEffect_(teamCode, windDeg, windMph) {
  const homePlateDir = PARK_ORIENTATION[teamCode];
  if (homePlateDir == null || windMph < 6) return { modifier: 1.0, label: 'calm' };

  const windFrom       = windDeg;
  const diff           = Math.abs(((windFrom - homePlateDir) + 360) % 360);
  const normalizedDiff = diff > 180 ? 360 - diff : diff;
  const outFactor   = (normalizedDiff - 90) / 90;
  const speedFactor = Math.min(windMph, 20) / 20;
  const modifier    = 1.0 + outFactor * speedFactor * 0.06;

  let label = '';
  if (outFactor > 0.5)       label = Math.round(windMph) + ' mph out';
  else if (outFactor < -0.5) label = Math.round(windMph) + ' mph in';
  else                       label = Math.round(windMph) + ' mph cross';

  return { modifier: Math.max(0.94, Math.min(1.06, modifier)), label };
}

// ============================================================
// BULLPEN FATIGUE (legacy helper — kept for backward compat)
// ============================================================
function calcBullpenFatigue(ipLast3) {
  if (ipLast3 == null || isNaN(ipLast3)) return { multiplier: 1.0, label: 'N/A', score: 50 };
  if (ipLast3 <= 3)  return { multiplier: 1.00, label: 'Fresh',    score: 100 };
  if (ipLast3 <= 6)  return { multiplier: 1.02, label: 'Moderate', score: 70  };
  if (ipLast3 <= 9)  return { multiplier: 1.05, label: 'Tired',    score: 40  };
  if (ipLast3 <= 12) return { multiplier: 1.08, label: 'Taxed',    score: 20  };
  return                    { multiplier: 1.12, label: 'Depleted', score: 5   };
}

function bullpenFatigueFactor(ipUsed) {
  const fatigue = Math.min(1.0, Math.max(0, (ipUsed - 6) / 6));
  return 1 + fatigue * 0.08;
}

// ============================================================
// LINEUP vs SP HANDEDNESS ENGINE
// ============================================================
function calcLineupSPEdge(awaySpHand, homeSpHand, awayWobaR, awayWobaL, homeWobaR, homeWobaL) {
  const LEAGUE_WOBA  = 0.320;
  const PA_PER_GAME  = 27;
  const WOBA_TO_RUNS = 0.003;

  const awayEffWoba = homeSpHand === 'R' ? (awayWobaR || LEAGUE_WOBA)
                    : homeSpHand === 'L' ? (awayWobaL || LEAGUE_WOBA)
                    : LEAGUE_WOBA;

  const homeEffWoba = awaySpHand === 'R' ? (homeWobaR || LEAGUE_WOBA)
                    : awaySpHand === 'L' ? (homeWobaL || LEAGUE_WOBA)
                    : LEAGUE_WOBA;

  const awayRunBoost = parseFloat(((awayEffWoba - LEAGUE_WOBA) * WOBA_TO_RUNS * PA_PER_GAME).toFixed(2));
  const homeRunBoost = parseFloat(((homeEffWoba - LEAGUE_WOBA) * WOBA_TO_RUNS * PA_PER_GAME).toFixed(2));

  const awayDelta = ((awayEffWoba - LEAGUE_WOBA) * 1000).toFixed(0);
  const homeDelta = ((homeEffWoba - LEAGUE_WOBA) * 1000).toFixed(0);

  return {
    awayRunBoost,
    homeRunBoost,
    label: 'Away ' + (awayDelta > 0 ? '+' : '') + awayDelta + ' wOBA pts vs ' + (homeSpHand || '?') +
           ' · Home ' + (homeDelta > 0 ? '+' : '') + homeDelta + ' wOBA pts vs ' + (awaySpHand || '?')
  };
}

// ============================================================
// STATCAST BLEND LAYER
// ============================================================
function blendStatcastLayer(fip, xera, xwoba, barrel) {
  const LEAGUE_XWOBA  = 0.320;
  const LEAGUE_BARREL = 8.0;

  const spQuality = (xera != null && !isNaN(xera))
    ? fip * 0.6 + xera * 0.4
    : fip;

  const xwobaBoost  = (xwoba  != null && !isNaN(xwoba))  ? (xwoba  - LEAGUE_XWOBA)  * 15 : 0;
  const barrelBoost = (barrel != null && !isNaN(barrel)) ? (barrel - LEAGUE_BARREL) * 0.05 : 0;

  return {
    spQuality:    Math.max(1.5, Math.min(8.0, spQuality)),
    contactBoost: parseFloat((xwobaBoost + barrelBoost).toFixed(3))
  };
}

// ============================================================
// MODEL + ANALYSIS DISPLAY
// ============================================================
function americanToProb(odds) {
  if (odds < 0) return -odds / (-odds + 100);
  return 100 / (odds + 100);
}
function probToAmerican(p) {
  if (p >= 0.5) return Math.round(-100 * p / (1 - p));
  return '+' + Math.round(100 * (1 - p) / p);
}

// ── Fatigue color helper ──
function fatigueColor(label) {
  if (label === 'Fresh')    return 'var(--success)';
  if (label === 'Moderate') return 'var(--text-2)';
  if (label === 'Tired')    return 'var(--warning)';
  if (label === 'Taxed')    return 'var(--danger)';
  if (label === 'Depleted') return 'var(--danger)';
  return 'var(--text-3)';
}

// PATCH E: rest tag displayed in bullpen row
function _bpRestTag(f) {
  if (!f || f.daysSinceLastGame == null || f.daysSinceLastGame <= 1) return '';
  const d   = f.daysSinceLastGame;
  const col = d >= 3 ? 'var(--success)' : 'var(--warning)';
  return ' <span style="color:' + col + ';font-size:10px;">(' + d + 'd rest)</span>';
}

// ── SP Statcast detail row renderer ──
function renderSpStatcastRow(awayCode, awayP, homeCode_arg, homeP) {
  if (!awayP && !homeP) return '';
  const fmt  = v => { const n = parseFloat(v); return (v == null || isNaN(n)) ? '—' : n.toFixed(1); };
  const fmt2 = v => { const n = parseFloat(v); return (v == null || isNaN(n)) ? '—' : n.toFixed(2); };
  const cell = (label, val) =>
    '<span style="margin-right:10px;">' +
    '<span style="color:var(--text-3);font-size:10px;">' + label + '</span> ' +
    '<span style="font-family:var(--mono);font-size:11px;">' + val + '</span></span>';

  console.log('[DE Statcast] Away SP profile:', awayP);
  console.log('[DE Statcast] Home SP profile:', homeP);

  const awayHtml = (awayP && (awayP.xera != null || awayP.xwoba != null))
    ? cell('xERA', fmt2(awayP.xera)) + cell('K%', fmt(awayP.kPct)) + cell('HH%', fmt(awayP.hardHit)) + cell('Barrel%', fmt(awayP.barrel))
    : '<span style="color:var(--text-3);font-size:11px;">no Statcast</span>';
  const homeHtml = (homeP && (homeP.xera != null || homeP.xwoba != null))
    ? cell('xERA', fmt2(homeP.xera)) + cell('K%', fmt(homeP.kPct)) + cell('HH%', fmt(homeP.hardHit)) + cell('Barrel%', fmt(homeP.barrel))
    : '<span style="color:var(--text-3);font-size:11px;">no Statcast</span>';

  const awayHasData = awayP && (awayP.xera != null || awayP.xwoba != null);
  const homeHasData = homeP && (homeP.xera != null || homeP.xwoba != null);
  if (!awayHasData && !homeHasData) return '';

  return '<div style="background:var(--surface-2);border-radius:8px;padding:8px 12px;margin-top:4px;margin-bottom:4px;">' +
    '<div style="font-size:10px;font-weight:600;letter-spacing:0.08em;color:var(--text-3);margin-bottom:6px;">PITCHER STATCAST</div>' +
    '<div style="font-size:11px;margin-bottom:4px;"><span style="font-weight:600;color:var(--text-2);">' + awayCode + '</span> ' + awayHtml + '</div>' +
    '<div style="font-size:11px;"><span style="font-weight:600;color:var(--text-2);">' + homeCode_arg + '</span> ' + homeHtml + '</div>' +
  '</div>';
}

function runAnalysis() {
  const awayCode  = document.getElementById('away').value;
  const homeCode  = document.getElementById('home').value;
  const container = document.getElementById('result-container');

  if (!awayCode || !homeCode) {
    container.innerHTML = '<div class="card" style="color:var(--danger);">⚠ Select both teams first.</div>';
    return;
  }

  const away = TEAMS[awayCode];
  const home = TEAMS[homeCode];

  let awayFip = parseFloat(document.getElementById('away_fip').value) || 4.20;
  let homeFip = parseFloat(document.getElementById('home_fip').value) || 4.20;
  const awayIsOpener    = document.getElementById('away_fip').dataset.opener   === 'true';
  const homeIsOpener    = document.getElementById('home_fip').dataset.opener   === 'true';
  const awayHasStatcast = document.getElementById('away_fip').dataset.statcast === 'true';
  const homeHasStatcast = document.getElementById('home_fip').dataset.statcast === 'true';
  const awayML          = parseInt(document.getElementById('away_ml').value)    || -110;
  const homeML          = parseInt(document.getElementById('home_ml').value)    || -110;
  const totalLine       = parseFloat(document.getElementById('total').value)    || 8.5;
  const awayBpIp        = parseFloat(document.getElementById('away_bp_ip').value) || 9.0;
  const homeBpIp        = parseFloat(document.getElementById('home_bp_ip').value) || 9.0;
  const runMod          = parseFloat(document.getElementById('run_mod').value)  || 1.0;

  let awayBpProfile = null, homeBpProfile = null;
  try { awayBpProfile = JSON.parse(document.getElementById('away_bp_ip').dataset.bpProfile || 'null'); } catch(e){}
  try { homeBpProfile = JSON.parse(document.getElementById('home_bp_ip').dataset.bpProfile || 'null'); } catch(e){}

  let awaySp_statcast = null, homeSp_statcast = null;
  try { awaySp_statcast = JSON.parse(document.getElementById('away_fip').dataset.spStatcast || 'null'); } catch(e){}
  try { homeSp_statcast = JSON.parse(document.getElementById('home_fip').dataset.spStatcast || 'null'); } catch(e){}

  const awayXera   = parseFloat(document.getElementById('away_xera')?.value)   || null;
  const homeXera   = parseFloat(document.getElementById('home_xera')?.value)   || null;
  const awayXwoba  = parseFloat(document.getElementById('away_xwoba')?.value)  || null;
  const homeXwoba  = parseFloat(document.getElementById('home_xwoba')?.value)  || null;
  const awayBarrel = parseFloat(document.getElementById('away_barrel')?.value) || null;
  const homeBarrel = parseFloat(document.getElementById('home_barrel')?.value) || null;

  const awayStatcast = blendStatcastLayer(awayFip, awayXera, awayXwoba, awayBarrel);
  const homeStatcast = blendStatcastLayer(homeFip, homeXera, homeXwoba, homeBarrel);
  awayFip = awayStatcast.spQuality;
  homeFip = homeStatcast.spQuality;

  const awaySpHand = document.getElementById('away_sp_hand')?.value || '';
  const homeSpHand = document.getElementById('home_sp_hand')?.value || '';
  const awayWobaR  = parseFloat(document.getElementById('away_woba_r')?.value) || 0;
  const awayWobaL  = parseFloat(document.getElementById('away_woba_l')?.value) || 0;
  const homeWobaR  = parseFloat(document.getElementById('home_woba_r')?.value) || 0;
  const homeWobaL  = parseFloat(document.getElementById('home_woba_l')?.value) || 0;
  const lineupSP   = calcLineupSPEdge(awaySpHand, homeSpHand, awayWobaR, awayWobaL, homeWobaR, homeWobaL);

  const awayFatigue = awayBpProfile
    ? { multiplier: awayBpProfile.multiplier, label: awayBpProfile.label, score: awayBpProfile.score, closerAvail: awayBpProfile.closerAvail, highLevAvail: awayBpProfile.highLevAvail, daysSinceLastGame: awayBpProfile.daysSinceLastGame }
    : calcBullpenFatigue(homeBpIp);
  const homeFatigue = homeBpProfile
    ? { multiplier: homeBpProfile.multiplier, label: homeBpProfile.label, score: homeBpProfile.score, closerAvail: homeBpProfile.closerAvail, highLevAvail: homeBpProfile.highLevAvail, daysSinceLastGame: homeBpProfile.daysSinceLastGame }
    : calcBullpenFatigue(awayBpIp);

  const lineupXwoba = window._lineupXwoba || { away: null, home: null };
  const LEAGUE_AVG_XWOBA = 0.315;
  const LEAGUE_AVG = 4.40, HFA = 0.03, PYTHAG = 1.83;

  let awayWoba, awayLineupSource;
  if (lineupXwoba.away != null) {
    awayWoba = lineupXwoba.away;
    awayLineupSource = 'confirmed lineup xwOBA';
  } else {
    const homeSPHand = document.getElementById('home_fip').dataset.pitchHand || '';
    awayWoba = homeSPHand === 'L' ? away.vsLHP : away.vsRHP;
    awayLineupSource = 'team-level fallback (' + (homeSPHand === 'L' ? 'vsLHP' : 'vsRHP') + ')';
  }

  let homeWoba, homeLineupSource;
  if (lineupXwoba.home != null) {
    homeWoba = lineupXwoba.home;
    homeLineupSource = 'confirmed lineup xwOBA';
  } else {
    const awaySPHand = document.getElementById('away_fip').dataset.pitchHand || '';
    homeWoba = awaySPHand === 'L' ? home.vsLHP : home.vsRHP;
    homeLineupSource = 'team-level fallback (' + (awaySPHand === 'L' ? 'vsLHP' : 'vsRHP') + ')';
  }

  const awayOff    = 1 + (awayWoba - LEAGUE_AVG_XWOBA) * 5;
  const homeOff    = 1 + (homeWoba - LEAGUE_AVG_XWOBA) * 5;
  const awayOppPit = Math.max(0.65, Math.min(1.40, homeFip / 4.20));
  const homeOppPit = Math.max(0.65, Math.min(1.40, awayFip / 4.20));
  const parkF      = home.park;

  const awayBpFactor = awayFatigue.multiplier;
  const homeBpFactor = homeFatigue.multiplier;

  let awayRuns = LEAGUE_AVG * awayOff * awayOppPit * awayBpFactor * parkF * runMod;
  let homeRuns = LEAGUE_AVG * homeOff * homeOppPit * homeBpFactor * parkF * runMod;

  awayRuns += lineupSP.awayRunBoost;
  homeRuns += lineupSP.homeRunBoost;
  awayRuns += awayStatcast.contactBoost;
  homeRuns += homeStatcast.contactBoost;

  awayRuns = Math.max(2.0, Math.min(9.5, awayRuns));
  homeRuns = Math.max(2.0, Math.min(9.5, homeRuns));

  let homeProb = Math.pow(homeRuns, PYTHAG) / (Math.pow(homeRuns, PYTHAG) + Math.pow(awayRuns, PYTHAG));
  homeProb     = Math.min(0.95, Math.max(0.05, homeProb + HFA));
  const awayProb = 1 - homeProb;
  const total    = awayRuns + homeRuns;

  const mktAwayProb  = americanToProb(awayML);
  const mktHomeProb  = americanToProb(homeML);
  const vig          = mktAwayProb + mktHomeProb;
  const mktAwayFair  = mktAwayProb / vig;
  const mktHomeFair  = mktHomeProb / vig;

  const awayEdge  = awayProb - mktAwayFair;
  const homeEdge  = homeProb - mktHomeFair;
  const totalEdge = total - totalLine;

  const winner  = homeProb > awayProb ? homeCode : awayCode;
  const winProb = Math.max(homeProb, awayProb);
  const winEdge = homeProb > awayProb ? homeEdge : awayEdge;
  const winML   = homeProb > awayProb ? homeML   : awayML;

  let recClass = 'negative', recLabel = 'NO BET', recPick = 'Pass — edge too small';
  if (winEdge >= 0.04) {
    recClass = 'positive'; recLabel = 'RECOMMENDED PLAY';
    recPick  = winner + ' ML ' + (winML > 0 ? '+' : '') + winML;
  } else if (winEdge <= -0.04) {
    recClass = 'fade'; recLabel = 'FADE SIGNAL';
    recPick  = 'Model disagrees with sharp market';
  }

  const baseThreshold  = 0.40;
  const lineAdj        = Math.max(0, (totalLine - 8.0) * 0.04);
  const statcastBonus  = (awayHasStatcast && homeHasStatcast) ? -0.05 : 0;
  const totThreshold   = Math.max(0.25, baseThreshold + lineAdj + statcastBonus);

  let totalRec = '—', totalRecGrade = '';
  if      (totalEdge >= totThreshold * 1.5)      { totalRec = 'OVER '  + totalLine; totalRecGrade = 'strong'; }
  else if (totalEdge >= totThreshold)             { totalRec = 'OVER '  + totalLine; totalRecGrade = 'lean';   }
  else if (totalEdge <= -totThreshold * 1.5)      { totalRec = 'UNDER ' + totalLine; totalRecGrade = 'strong'; }
  else if (totalEdge <= -totThreshold)            { totalRec = 'UNDER ' + totalLine; totalRecGrade = 'lean';   }
  const totalRecLabel = totalRecGrade === 'strong' ? totalRec
                      : totalRecGrade === 'lean'   ? totalRec + ' (lean)'
                      : '—';

  const clvKey = awayCode + '@' + homeCode;
  const now    = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (!window._openingLines) window._openingLines = {};
  if (!window._openingLines[clvKey]) {
    window._openingLines[clvKey] = { awayML, homeML, total: totalLine, time: now };
  }
  const opening   = window._openingLines[clvKey];
  const awayMove  = awayML  - opening.awayML;
  const homeMove  = homeML  - opening.homeML;
  const totalMove = totalLine - opening.total;
  const hasMovement = awayMove !== 0 || homeMove !== 0 || totalMove !== 0;

  function clvMoveStr(move, isTotal) {
    if (move === 0) return '<span style="color:var(--text-3);">—</span>';
    const col = move > 0 ? 'var(--success)' : 'var(--danger)';
    const pfx = move > 0 ? '+' : '';
    return '<span style="color:' + col + ';">' + pfx + (isTotal ? move.toFixed(1) : move) + '</span>';
  }

  const clvPanelHtml =
    '<div style="margin-top:12px;padding:10px 14px;background:var(--surface-2);border-radius:10px;border:1px solid var(--border);">' +
      '<div style="font-size:10px;font-weight:600;letter-spacing:0.08em;color:var(--text-3);margin-bottom:8px;">CLV TRACKER</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:12px;">' +
        '<div>' +
          '<div style="color:var(--text-3);font-size:10px;">' + awayCode + ' ML</div>' +
          '<div style="font-family:var(--mono);font-weight:600;">' + (awayML > 0 ? '+' : '') + awayML + '</div>' +
          '<div style="font-size:10px;color:var(--text-3);">open: ' + (opening.awayML > 0 ? '+' : '') + opening.awayML + ' · mv: ' + clvMoveStr(awayMove, false) + '</div>' +
        '</div>' +
        '<div>' +
          '<div style="color:var(--text-3);font-size:10px;">' + homeCode + ' ML</div>' +
          '<div style="font-family:var(--mono);font-weight:600;">' + (homeML > 0 ? '+' : '') + homeML + '</div>' +
          '<div style="font-size:10px;color:var(--text-3);">open: ' + (opening.homeML > 0 ? '+' : '') + opening.homeML + ' · mv: ' + clvMoveStr(homeMove, false) + '</div>' +
        '</div>' +
        '<div>' +
          '<div style="color:var(--text-3);font-size:10px;">Total</div>' +
          '<div style="font-family:var(--mono);font-weight:600;">' + totalLine + '</div>' +
          '<div style="font-size:10px;color:var(--text-3);">open: ' + opening.total + ' · mv: ' + clvMoveStr(totalMove, true) + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:6px;font-size:10px;color:var(--text-3);">First seen: ' + opening.time + ' · Last: ' + now + (hasMovement ? ' · <span style="color:var(--warning);">⚡ line moved</span>' : '') + '</div>' +
      (IS_ADMIN ? '<button onclick="resetOpeningLine(\'' + clvKey + '\')" style="margin-top:6px;background:none;border:1px solid var(--border);color:var(--text-3);padding:2px 8px;border-radius:4px;font-size:10px;cursor:pointer;">Reset opener</button>' : '') +
    '</div>';

  const juiceStr = (document.getElementById('juice')?.value || '').trim();
  const totalsOddsDisplay = parseTotalsOddsDisplay(juiceStr, totalLine);
  const totalsTimestamp   = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const awayWinPct = (awayProb * 100).toFixed(1);
  const homeWinPct = (homeProb * 100).toFixed(1);
  const awayActive = awayProb > homeProb;

  // PATCH E: SP quality source label with reason when missing
  const spQualityLabel = (awayHasStatcast || homeHasStatcast)
    ? 'FIP + Statcast blended'
    : 'FIP only — Statcast name match failed (check console)';

  container.innerHTML =
    '<div class="matchup-card">' +
      '<div class="matchup-header">' +
        '<div class="matchup-teams">' +
          '<div class="team">' + awayCode + '</div>' +
          '<div class="vs">@</div>' +
          '<div class="team">' + homeCode + '</div>' +
        '</div>' +
        '<div class="matchup-meta">' + away.name.split(' ').pop() + ' vs ' + home.name.split(' ').pop() + '</div>' +
      '</div>' +
      '<div class="team-grid">' +
        '<div class="team-cell ' + (awayActive ? '' : 'under') + '">' +
          '<div class="label">' + awayCode + (awayIsOpener ? ' 🔄' : '') + '</div>' +
          '<div class="ml">'   + (awayML > 0 ? '+' : '') + awayML + '</div>' +
          '<div class="model-pct">' + awayWinPct + '% model</div>' +
        '</div>' +
        '<div class="team-cell ' + (awayActive ? 'under' : '') + '">' +
          '<div class="label">' + homeCode + (homeIsOpener ? ' 🔄' : '') + '</div>' +
          '<div class="ml">'   + (homeML > 0 ? '+' : '') + homeML + '</div>' +
          '<div class="model-pct">' + homeWinPct + '% model</div>' +
        '</div>' +
      '</div>' +
      (awayIsOpener || homeIsOpener ? '<div style="background:var(--warning-bg);border-radius:8px;padding:8px 12px;font-size:11px;color:var(--warning);margin-bottom:10px;">⚡ Opener/bullpen game detected — FIP blended with team bullpen ERA</div>' : '') +
      '<div class="recommendation ' + recClass + '">' +
        '<div>' +
          '<div class="rec-label">' + recLabel + '</div>' +
          '<div class="rec-pick">'  + recPick  + '</div>' +
        '</div>' +
        '<div>' +
          '<div class="rec-edge">'       + (winEdge >= 0 ? '+' : '') + (winEdge * 100).toFixed(1) + '%</div>' +
          '<div class="rec-edge-label">edge</div>' +
        '</div>' +
      '</div>' +
      '<div class="detail-grid">' +
        '<div class="detail-cell"><div class="label">PARK</div><div class="v">'   + parkF.toFixed(2)                              + '×</div></div>' +
        '<div class="detail-cell"><div class="label">WX MOD</div><div class="v">' + runMod.toFixed(3)                             + '×</div></div>' +
        '<div class="detail-cell"><div class="label">BP AVG</div><div class="v">' + ((awayBpFactor + homeBpFactor) / 2).toFixed(2) + '×</div></div>' +
      '</div>' +
      '<div class="factor-row"><span class="label">Predicted runs (Away · Home)</span><span class="v">' + awayRuns.toFixed(2) + ' · ' + homeRuns.toFixed(2) + '</span></div>' +
      '<div class="factor-row"><span class="label">Away offense source</span><span class="v" style="font-size:11px;color:' + (lineupXwoba.away != null ? 'var(--success)' : 'var(--text-3)') + ';">' + awayLineupSource + '</span></div>' +
      '<div class="factor-row"><span class="label">Home offense source</span><span class="v" style="font-size:11px;color:' + (lineupXwoba.home != null ? 'var(--success)' : 'var(--text-3)') + ';">' + homeLineupSource + '</span></div>' +
      '<div class="factor-row"><span class="label">SP quality source</span><span class="v" style="font-size:11px;color:' + ((awayHasStatcast || homeHasStatcast) ? 'var(--success)' : 'var(--text-3)') + ';">' + spQualityLabel + '</span></div>' +
      renderSpStatcastRow(awayCode, awaySp_statcast, homeCode, homeSp_statcast) +
      '<div class="factor-row"><span class="label">Bullpen fatigue (Away · Home)</span><span class="v" style="font-size:11px;">' +
        '<span style="color:' + fatigueColor(awayFatigue.label) + ';">' + awayFatigue.label + '</span>' +
        _bpRestTag(awayFatigue) +
        (awayFatigue.closerAvail === false ? ' <span style="color:var(--danger);font-size:10px;">No closer</span>' : '') +
        ' · <span style="color:' + fatigueColor(homeFatigue.label) + ';">' + homeFatigue.label + '</span>' +
        _bpRestTag(homeFatigue) +
        (homeFatigue.closerAvail === false ? ' <span style="color:var(--danger);font-size:10px;">No closer</span>' : '') +
      '</span></div>' +
      (lineupSP.awayRunBoost !== 0 || lineupSP.homeRunBoost !== 0
        ? '<div class="factor-row"><span class="label">Lineup/SP split</span><span class="v" style="font-size:11px;color:var(--text-2);">' + lineupSP.label + '</span></div>'
        : '') +
      (awayXera || homeXera || awayXwoba || homeXwoba
        ? '<div class="factor-row"><span class="label">Statcast layer</span><span class="v" style="font-size:11px;color:var(--success);">xERA + xwOBA + Barrel% applied</span></div>'
        : '') +
      '<div class="factor-row"><span class="label">Predicted total</span><span class="v">' + total.toFixed(2) + '</span></div>' +
      '<div class="factor-row"><span class="label">Total line</span><span class="v">' + totalLine + '</span></div>' +
      '<div class="factor-row"><span class="label">Total recommendation</span><span class="v" style="color:' + (totalRec !== '—' ? (totalRecGrade === 'strong' ? 'var(--success)' : 'var(--warning)') : 'var(--text-3)') + ';">' + totalRecLabel + '</span></div>' +
      '<div class="factor-row"><span class="label">Edge vs threshold</span><span class="v" style="font-size:11px;color:var(--text-2);">' + (totalEdge >= 0 ? '+' : '') + totalEdge.toFixed(2) + ' runs · threshold ±' + totThreshold.toFixed(2) + '</span></div>' +
      '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">' +
        '<span class="odds-pill">LINE <span class="v">' + totalsOddsDisplay.line + '</span></span>' +
        '<span class="odds-pill">O <span class="v">'   + totalsOddsDisplay.over  + '</span></span>' +
        '<span class="odds-pill">U <span class="v">'   + totalsOddsDisplay.under + '</span></span>' +
        '<span class="odds-pill" style="color:var(--text-3);font-size:10px;">⏱ ' + totalsTimestamp + '</span>' +
      '</div>' +
      (IS_ADMIN ? '<button class="btn btn-primary" id="save-pick-btn" onclick="savePick()" style="margin-top:14px;">Save Pick to Tracker</button><div class="status" id="save-status" style="text-align:center;"></div>' : '') +
      clvPanelHtml +
    '</div>';

  if (window.innerWidth < 900) container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  window._lastPrediction = {
    gameDate:         document.getElementById('gamedate').value,
    away:             awayCode,
    home:             homeCode,
    predictedWinner:  winner,
    winProb,
    predictedTotal:   total,
    totalLine,
    mlEdge:           winEdge,
    totalEdge,
    recML:            recPick,
    recTotal:         totalRecLabel,
    juice:            juiceStr,
    clvAwayML:        awayML,
    clvHomeML:        homeML,
    clvTotal:         totalLine,
    clvLogTime:       new Date().toISOString()
  };
}

function resetOpeningLine(key) {
  if (window._openingLines) delete window._openingLines[key];
  runAnalysis();
}

function parseTotalsOddsDisplay(juiceStr, totalLine) {
  const line = totalLine != null ? String(totalLine) : '—';
  if (!juiceStr) return { line, over: '—', under: '—' };
  const parts = juiceStr.split('/').map(s => {
    const m = s.replace(/^[oOuU]/,'').trim();
    const n = parseInt(m.replace(/[^\d\-+]/g, ''), 10);
    return isNaN(n) ? null : (n > 0 ? '+' + n : String(n));
  });
  return { line, over: parts[0] || '—', under: parts[1] || parts[0] || '—' };
}

function parseTotOdds(juiceStr, recTotal) {
  if (!juiceStr) return '';
  const parts = juiceStr.split('/').map(s => {
    const m = s.match(/([+-]?\d{2,4})/);
    return m ? parseInt(m[1], 10) : null;
  }).filter(n => n !== null);
  if (!parts.length) return '';
  const overOdds  = parts[0];
  const underOdds = parts.length > 1 ? parts[1] : parts[0];
  return /OVER/i.test(recTotal) ? overOdds : underOdds;
}

// ============================================================
// SAVE PICK (admin only)
// ============================================================
async function savePick() {
  if (!IS_ADMIN) return;
  const payload = window._lastPrediction;
  if (!payload) return;

  const btn    = document.getElementById('save-pick-btn');
  const status = document.getElementById('save-status');
  if (btn)    { btn.disabled = true; btn.textContent = 'Saving…'; }
  if (status) { status.textContent = ''; status.className = 'status loading'; }

  const url = HARDCODED_TRACKER_URL;
  if (!url || url.indexOf('PASTE_') === 0) {
    if (status) { status.textContent = '✗ Tracker URL not configured.'; status.className = 'status error'; }
    if (btn)    { btn.disabled = false; btn.textContent = 'Save Pick to Tracker'; }
    return;
  }

  try {
    const row = {
      date:       payload.gameDate || '',
      away:       payload.away     || '',
      home:       payload.home     || '',
      pick:       payload.predictedWinner || '',
      winPct:     payload.winProb  != null ? (payload.winProb * 100).toFixed(1) + '%' : '',
      predTotal:  payload.predictedTotal  != null ? Number(payload.predictedTotal).toFixed(2) : '',
      totalLine:  payload.totalLine       != null ? payload.totalLine : '',
      mlEdge:     payload.mlEdge          != null ? (payload.mlEdge * 100).toFixed(2) : '',
      recML:      payload.recML   || '',
      recTotal:   payload.recTotal || '',
      totOdds:    parseTotOdds(payload.juice, payload.recTotal),
      clvAwayML:  payload.clvAwayML  != null ? payload.clvAwayML  : '',
      clvHomeML:  payload.clvHomeML  != null ? payload.clvHomeML  : '',
      clvTotal:   payload.clvTotal   != null ? payload.clvTotal   : '',
      clvLogTime: payload.clvLogTime || ''
    };

    const r    = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain' },
      body:    JSON.stringify({ action: 'write', row })
    });
    const data = await r.json();
    if (!data.success) throw new Error(data.error || 'Save failed');

    if (btn)    { btn.textContent = '✓ Saved to tracker'; }
    if (status) { status.textContent = 'Pick logged — ID: ' + data.id; status.className = 'status success'; }
  } catch (e) {
    if (status) { status.textContent = '✗ ' + e.message; status.className = 'status error'; }
    if (btn)    { btn.disabled = false; btn.textContent = 'Save Pick to Tracker'; }
  }
}

// ============================================================
// TRACKER TAB FUNCTIONS
// ============================================================
let CACHED_PREDICTIONS = [];

async function loadTrackerData() {
  const url = HARDCODED_TRACKER_URL;
  if (!url || url.indexOf('PASTE_') === 0) {
    setStatus('data-status', 'Tracker URL not configured.', 'error'); return;
  }
  setStatus('data-status', 'Fetching predictions…', 'loading');
  try {
    const r    = await fetch(url + '?action=fetchAll');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    if (!data.success) throw new Error(data.error || 'Unknown error');
    CACHED_PREDICTIONS = data.predictions || [];
    renderTrackerStats(data.stats);
    renderTrackerLog(CACHED_PREDICTIONS);
    setStatus('data-status', '✓ ' + CACHED_PREDICTIONS.length + ' predictions.', 'success');
  } catch (e) { setStatus('data-status', '✗ ' + e.message, 'error'); }
}

function renderTrackerStats(s) {
  const grid     = document.getElementById('stats');
  const mlPct    = parseFloat(s.mlWinPct);
  const totalPct = parseFloat(s.totalWinPct);
  const mlClass    = mlPct    >= 52.4 ? '' : (mlPct    === 0 ? 'flat' : 'bad');
  const totalClass = totalPct >= 52.4 ? '' : (totalPct === 0 ? 'flat' : 'bad');
  grid.innerHTML =
    '<div class="stat-card"><div class="stat-label">LOGGED</div><div class="stat-value">'       + s.totalLogged + '</div></div>' +
    '<div class="stat-card"><div class="stat-label">SETTLED</div><div class="stat-value">'      + s.settled     + '</div></div>' +
    '<div class="stat-card"><div class="stat-label">ML RECORD</div><div class="stat-value">'    + s.mlRecord    + '</div></div>' +
    '<div class="stat-card"><div class="stat-label">ML WIN %</div><div class="stat-value">'     + s.mlWinPct    + '%</div><div class="stat-sub ' + mlClass    + '">' + (mlPct    >= 52.4 ? '✓ above breakeven' : (mlPct    === 0 ? 'no data' : '✗ below breakeven')) + '</div></div>' +
    '<div class="stat-card"><div class="stat-label">TOTALS RECORD</div><div class="stat-value">'+ s.totalRecord + '</div></div>' +
    '<div class="stat-card"><div class="stat-label">TOTALS WIN %</div><div class="stat-value">' + s.totalWinPct + '%</div><div class="stat-sub ' + totalClass + '">' + (totalPct >= 52.4 ? '✓ above breakeven' : (totalPct === 0 ? 'no data' : '✗ below breakeven')) + '</div></div>';
}

function renderTrackerLog(rows) {
  const list = document.getElementById('log-list');
  if (!rows || rows.length === 0) { list.innerHTML = '<div class="empty">No predictions yet.</div>'; return; }
  const sorted = [...rows].reverse();
  list.innerHTML = sorted.map(p => {
    const date   = formatTrackerDate(p.gameDate);
    const game   = (p.away || '?') + ' @ ' + (p.home || '?');
    const pick   = p.predictedWinner || '?';
    const winPct = (p.winProb !== '' && p.winProb != null) ? p.winProb + '%' : '—';
    const total  = p.predictedTotal || '—';
    const edge   = p.mlEdge ? p.mlEdge + '%' : '—';
    const result = renderResultPill(p.result);
    const action = p.result ? '' : renderUpdateForm(p.id);
    return '<div class="log-row">' +
      '<div class="log-row-top"><div class="game">' + game + '</div><div class="date">' + date + '</div></div>' +
      '<div class="meta">' +
        '<span>Pick <span class="v">' + pick   + '</span></span>' +
        '<span>Win <span class="v">'  + winPct + '</span></span>' +
        '<span>Total <span class="v">'+ total  + '</span></span>' +
        '<span>Edge <span class="v">' + edge   + '</span></span>' +
      '</div>' +
      '<div style="margin-top:6px;">' + result + '</div>' +
      action +
      '</div>';
  }).join('');
}

function formatTrackerDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d).substring(0, 10);
  return (dt.getMonth() + 1) + '/' + dt.getDate();
}

function renderResultPill(r) {
  if (!r) return '<span class="pill pill-pending">PENDING</span>';
  const m = String(r).match(/ML\s+(\w)/);
  const t = String(r).match(/Total\s+(\w)/);
  let html = '';
  if (m) html += '<span class="pill pill-' + m[1].toLowerCase() + '">ML ' + m[1] + '</span> ';
  if (t) html += '<span class="pill pill-' + t[1].toLowerCase() + '">T '  + t[1] + '</span>';
  return html;
}

function renderUpdateForm(id) {
  return '<div class="row-actions">' +
    '<input type="text"   id="winner_' + id + '" placeholder="Winner">' +
    '<input type="number" id="total_'  + id + '" step="0.5" placeholder="Total">' +
    '<button onclick="submitTrackerResult(\'' + id + '\')">Save</button>' +
    '</div>';
}

async function submitTrackerResult(id) {
  const winner = document.getElementById('winner_' + id).value.trim().toUpperCase();
  const total  = document.getElementById('total_'  + id).value.trim();
  if (!winner) { alert('Enter winner abbreviation'); return; }
  if (!total)  { alert('Enter actual total'); return; }
  try {
    const params = new URLSearchParams({ action: 'updateResult', id, actualWinner: winner, actualTotal: total });
    const r    = await fetch(HARDCODED_TRACKER_URL + '?' + params.toString());
    const data = await r.json();
    if (!data.success) throw new Error(data.error || 'Failed');
    setStatus('data-status', '✓ Saved.', 'success');
    loadTrackerData();
  } catch (e) { setStatus('data-status', '✗ ' + e.message, 'error'); }
}

async function autoUpdateYesterday() {
  setStatus('data-status', 'Pulling yesterday…', 'loading');
  try {
    const r    = await fetch(HARDCODED_TRACKER_URL + '?action=autoUpdateYesterday');
    const data = await r.json();
    if (!data.success) throw new Error(data.error || 'Failed');
    setStatus('data-status', '✓ Updated ' + data.updated + ' games from yesterday.', 'success');
    loadTrackerData();
  } catch (e) { setStatus('data-status', '✗ ' + e.message, 'error'); }
}

async function checkAllPending() {
  setStatus('data-status', 'Checking all pending results…', 'loading');
  try {
    const r    = await fetch(HARDCODED_TRACKER_URL + '?action=checkAllPending');
    const data = await r.json();
    if (!data.success) throw new Error(data.error || 'Failed');
    const msg = data.updated > 0
      ? '✓ Updated ' + data.updated + ' result' + (data.updated > 1 ? 's' : '') +
        ' · ' + (data.today || 0) + ' today · ' + (data.yesterday || 0) + ' yesterday'
      : '✓ No new results — games may still be in progress';
    setStatus('data-status', msg, data.updated > 0 ? 'success' : '');
    if (data.updated > 0) loadTrackerData();
  } catch (e) { setStatus('data-status', '✗ ' + e.message, 'error'); }
}