const base = 'https://codact.herokuapp.com';

/**
 * @param {string} method
 * @param {string} resource
 * @param {Record<string, unknown>} [data]
 */
export async function api(method, resource, data) {
  const url = `${base}/${resource}`;
  console.log(url);
  return await fetch(url, {
    method,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

