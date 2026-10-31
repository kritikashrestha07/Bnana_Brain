
import { config } from '../config/index.js';

export async function fetchBananaPuzzle() {
  const url = `${config.bananaApi.baseUrl}?out=json`;

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    config.bananaApi.timeoutMs
  );

  let response;

  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(
        'Banana API request timed out. The external service may be unavailable.'
      );
    }

    throw new Error(`Banana API network error: ${err.message}`);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Banana API returned HTTP ${response.status}`);
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('Banana API returned invalid JSON');
  }

  if (
    !data ||
    typeof data.question !== 'string' ||
    data.question.trim() === ''
  ) {
    throw new Error('Banana API response missing "question" field');
  }

  if (data.solution === undefined || data.solution === null) {
    throw new Error('Banana API response missing "solution" field');
  }

  const solution = Number(data.solution);

  if (!Number.isInteger(solution) || solution < 0 || solution > 9) {
    throw new Error(
      `Banana API returned unexpected solution value: ${data.solution}`
    );
  }

  const question = data.question.trim();

// The API normally returns a puzzle image URL.
// A data URI is also accepted if the API returns one.
if (
  !/^https?:\/\/\S+$/i.test(question) &&
  !/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/]+=*$/i.test(question)
) {
  throw new Error(
    `Banana API returned an unsupported image format: ${question.slice(0, 100)}`
  );
}

return {
  question,
  solution,
};
}
