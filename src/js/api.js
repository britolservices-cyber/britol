/* ════════════════════════════════════════════════════════
   BRITOL GROUP — Backend API Client
   ════════════════════════════════════════════════════════ */

const API_BASE = 'https://britol-backend.onrender.com';

async function postToApi(path, body) {
  var response = await fetch(API_BASE + path, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  var text = await response.text();
  var result = {};

  if (text) {
    try {
      result = JSON.parse(text);
    } catch (_) {
      if (!response.ok) {
        throw new Error('Server error (' + response.status + '). Please try again.');
      }
    }
  }

  if (!response.ok) {
    throw new Error(result.error || 'Server error (' + response.status + '). Please try again.');
  }

  return result;
}
