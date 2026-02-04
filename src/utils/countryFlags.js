const alpha3ToAlpha2 = {
  AFG: 'af', ALB: 'al', DZA: 'dz', AND: 'ad', AGO: 'ao', ATG: 'ag', ARG: 'ar',
  ARM: 'am', AUS: 'au', AUT: 'at', AZE: 'az', BHS: 'bs', BHR: 'bh', BGD: 'bd',
  BRB: 'bb', BLR: 'by', BEL: 'be', BLZ: 'bz', BEN: 'bj', BTN: 'bt', BOL: 'bo',
  BIH: 'ba', BWA: 'bw', BRA: 'br', BRN: 'bn', BGR: 'bg', BFA: 'bf', BDI: 'bi',
  KHM: 'kh', CMR: 'cm', CAN: 'ca', CPV: 'cv', CAF: 'cf', TCD: 'td', CHL: 'cl',
  CHN: 'cn', COL: 'co', COM: 'km', COG: 'cg', COD: 'cd', CRI: 'cr', CIV: 'ci',
  HRV: 'hr', CUB: 'cu', CYP: 'cy', CZE: 'cz', DNK: 'dk', DJI: 'dj', DMA: 'dm',
  DOM: 'do', ECU: 'ec', EGY: 'eg', SLV: 'sv', GNQ: 'gq', ERI: 'er', EST: 'ee',
  SWZ: 'sz', ETH: 'et', FJI: 'fj', FIN: 'fi', FRA: 'fr', GAB: 'ga', GMB: 'gm',
  GEO: 'ge', DEU: 'de', GHA: 'gh', GRC: 'gr', GRD: 'gd', GTM: 'gt', GIN: 'gn',
  GNB: 'gw', GUY: 'gy', HTI: 'ht', HND: 'hn', HUN: 'hu', ISL: 'is', IND: 'in',
  IDN: 'id', IRN: 'ir', IRQ: 'iq', IRL: 'ie', ISR: 'il', ITA: 'it', JAM: 'jm',
  JPN: 'jp', JOR: 'jo', KAZ: 'kz', KEN: 'ke', KIR: 'ki', PRK: 'kp', KOR: 'kr',
  KWT: 'kw', KGZ: 'kg', LAO: 'la', LVA: 'lv', LBN: 'lb', LSO: 'ls', LBR: 'lr',
  LBY: 'ly', LIE: 'li', LTU: 'lt', LUX: 'lu', MDG: 'mg', MWI: 'mw', MYS: 'my',
  MDV: 'mv', MLI: 'ml', MLT: 'mt', MHL: 'mh', MRT: 'mr', MUS: 'mu', MEX: 'mx',
  FSM: 'fm', MDA: 'md', MCO: 'mc', MNG: 'mn', MNE: 'me', MAR: 'ma', MOZ: 'mz',
  MMR: 'mm', NAM: 'na', NRU: 'nr', NPL: 'np', NLD: 'nl', NZL: 'nz', NIC: 'ni',
  NER: 'ne', NGA: 'ng', MKD: 'mk', NOR: 'no', OMN: 'om', PAK: 'pk', PLW: 'pw',
  PAN: 'pa', PNG: 'pg', PRY: 'py', PER: 'pe', PHL: 'ph', POL: 'pl', PRT: 'pt',
  QAT: 'qa', ROU: 'ro', RUS: 'ru', RWA: 'rw', KNA: 'kn', LCA: 'lc', VCT: 'vc',
  WSM: 'ws', SMR: 'sm', STP: 'st', SAU: 'sa', SEN: 'sn', SRB: 'rs', SYC: 'sc',
  SLE: 'sl', SGP: 'sg', SVK: 'sk', SVN: 'si', SLB: 'sb', SOM: 'so', ZAF: 'za',
  SSD: 'ss', ESP: 'es', LKA: 'lk', SDN: 'sd', SUR: 'sr', SWE: 'se', CHE: 'ch',
  SYR: 'sy', TWN: 'tw', TJK: 'tj', TZA: 'tz', THA: 'th', TLS: 'tl', TGO: 'tg',
  TON: 'to', TTO: 'tt', TUN: 'tn', TUR: 'tr', TKM: 'tm', TUV: 'tv', UGA: 'ug',
  UKR: 'ua', ARE: 'ae', GBR: 'gb', USA: 'us', URY: 'uy', UZB: 'uz', VUT: 'vu',
  VAT: 'va', VEN: 've', VNM: 'vn', YEM: 'ye', ZMB: 'zm', ZWE: 'zw',
  // Maritime flags / special territories
  ATF: 'tf', AIA: 'ai', ABW: 'aw', BMU: 'bm', VGB: 'vg', CYM: 'ky', CUW: 'cw',
  FLK: 'fk', FRO: 'fo', GIB: 'gi', GRL: 'gl', GGY: 'gg', HKG: 'hk', IMN: 'im',
  JEY: 'je', MAC: 'mo', MSR: 'ms', ANT: 'an', NCL: 'nc', PYF: 'pf', SHN: 'sh',
  SPM: 'pm', TCA: 'tc', VIR: 'vi', WLF: 'wf', ESH: 'eh', ALA: 'ax', BES: 'bq',
  IOT: 'io', CCK: 'cc', COK: 'ck', CXR: 'cx', GUM: 'gu', MNP: 'mp', NIU: 'nu',
  NFK: 'nf', PCN: 'pn', PRI: 'pr', REU: 're', BLM: 'bl', MAF: 'mf', SXM: 'sx',
  SGS: 'gs', TKL: 'tk', UMI: 'um', ASM: 'as', MTQ: 'mq', GLP: 'gp', GUF: 'gf',
  MYT: 'yt', PSE: 'ps', SJM: 'sj'
}

export function getFlagCode(alpha3Code) {
  if (!alpha3Code) return null
  const code = alpha3ToAlpha2[alpha3Code.toUpperCase()]
  return code || null
}
