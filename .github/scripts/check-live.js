#!/usr/bin/env node
/**
 * check-live.js — probe the live CVPen demo and write a diagnosis JSON.
 *
 * Usage:
 *   node check-live.js --url https://cv0-builder.netlify.app/ \
 *                      --marker ATS --slow-ms 10000 --out diagnosis.json
 *
 * Exit codes:
 *   0 = OK            (HTTP 200 + marker found + fast enough)
 *   1 = DOWN / ERROR  (no response, timeout, or HTTP 5xx)
 *   2 = CONTENT       (HTTP 200 but the expected marker is missing)
 *   3 = SLOW          (HTTP 200 + marker found, but slower than --slow-ms)
 *
 * No dependencies — uses the built-in global fetch (Node 18+).
 * Never prints secrets; the diagnosis file contains only public probe data.
 */

const fs = require('fs');

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const url = arg('url', 'https://cv0-builder.netlify.app/');
const marker = arg('marker', 'ATS');
const slowMs = parseInt(arg('slow-ms', '10000'), 10);
const outFile = arg('out', 'diagnosis.json');
const TIMEOUT_MS = 15000;
const MAX_RETRIES = 1; // one retry: a single transient blip is not a failure

async function probeOnce() {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'qudsystem-self-healing-probe/1.0' },
      redirect: 'follow',
    });
    const text = await res.text();
    return {
      http_status: res.status,
      response_ms: Date.now() - started,
      body_bytes: Buffer.byteLength(text),
      marker_found: text.includes(marker),
      body_head: text.slice(0, 500),
    };
  } finally {
    clearTimeout(timer);
  }
}

(async () => {
  const diagnosis = {
    url,
    marker,
    checked_at: new Date().toISOString(),
    failure_class: 'OK',
    http_status: null,
    response_ms: null,
    marker_found: false,
    body_bytes: 0,
    error: null,
  };

  let result = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      result = await probeOnce();
      break;
    } catch (err) {
      diagnosis.error = err.name === 'AbortError' ? 'timeout after 15s' : String(err.message || err);
      if (attempt === MAX_RETRIES) {
        diagnosis.failure_class = 'DOWN';
      }
    }
  }

  if (result) {
    diagnosis.http_status = result.http_status;
    diagnosis.response_ms = result.response_ms;
    diagnosis.marker_found = result.marker_found;
    diagnosis.body_bytes = result.body_bytes;
    if (result.http_status >= 500) {
      diagnosis.failure_class = 'ERROR_5XX';
      diagnosis.error = `HTTP ${result.http_status}`;
    } else if (result.http_status !== 200) {
      diagnosis.failure_class = 'DOWN';
      diagnosis.error = `HTTP ${result.http_status}`;
    } else if (!result.marker_found) {
      diagnosis.failure_class = 'CONTENT';
      diagnosis.error = `HTTP 200 but marker "${marker}" not found in page`;
    } else if (result.response_ms > slowMs) {
      diagnosis.failure_class = 'SLOW';
      diagnosis.error = `responded in ${result.response_ms} ms (threshold ${slowMs} ms)`;
    }
  }

  fs.writeFileSync(outFile, JSON.stringify(diagnosis, null, 2));
  console.log(JSON.stringify(diagnosis, null, 2));

  const exitCode = { OK: 0, DOWN: 1, ERROR_5XX: 1, CONTENT: 2, SLOW: 3 }[diagnosis.failure_class];
  process.exit(exitCode);
})();
