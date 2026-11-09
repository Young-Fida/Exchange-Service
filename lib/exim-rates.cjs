const ENDPOINT = 'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON';
const TTL = 10 * 60 * 1000;
function koreaDate(now, daysAgo = 0) {
  return new Date(now.getTime() + 9 * 3600000 - daysAgo * 86400000).toISOString().slice(0, 10);
}
function normalize(rows) {
  if (!Array.isArray(rows) || rows.some(row => row.result !== 1)) throw new Error('UPSTREAM_ERROR');
  return rows.flatMap(row => {
    const match = /^([A-Z]{3})(?:\((\d+)\))?$/.exec(row.cur_unit || '');
    const value = Number(String(row.deal_bas_r || '').replaceAll(',', ''));
    const unit = match?.[2] ? Number(match[2]) : 1;
    if (!match || !Number.isFinite(value) || value <= 0 || unit <= 0) return [];
    return [{currency: match[1], unit, rate: value, krwPerUnit: value / unit}];
  });
}
function createRateService({fetchImpl = fetch, now = () => new Date(), getKey = () => process.env.EXIM_API_KEY} = {}) {
  let cached, pending;
  async function load() {
    const key = getKey()?.trim();
    if (!key) throw new Error('KEY_NOT_CONFIGURED');
    const at = now();
    const signal = AbortSignal.timeout(18000);
    for (let days = 0; days < 7; days++) {
      const date = koreaDate(at, days);
      const url = new URL(ENDPOINT);
      url.search = new URLSearchParams({authkey: key, searchdate: date.replaceAll('-', ''), data: 'AP01'});
      const response = await fetchImpl(url, {signal, redirect: 'error'});
      if (!response.ok) throw new Error('UPSTREAM_ERROR');
      const rates = normalize(await response.json());
      if (rates.length) {
        const data = {source: '한국수출입은행', basis: 'deal_bas_r', rateDate: date, fetchedAt: now().toISOString(), rates};
        cached = {data, expires: now().getTime() + TTL, day: koreaDate(now())};
        return data;
      }
    }
    throw new Error('NO_DATA');
  }
  return async () => {
    if (cached && cached.expires > now().getTime() && cached.day === koreaDate(now())) return cached.data;
    if (!pending) pending = load().finally(() => { pending = null; });
    return pending;
  };
}
module.exports = {createRateService, normalize, koreaDate};
