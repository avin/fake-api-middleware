import './style.css';

const makeButton = ({ content, id }: { content: string; id: string }) => {
  const button = document.createElement('button');
  button.className =
    'rounded-md text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-50';
  button.id = id;
  button.innerHTML = content;
  return button;
};

const setResult = (content: string) => {
  document.querySelector('#result')!.innerHTML = content;
};

const doFetch = ({
  apiEndpoint,
  method,
  button,
}: {
  apiEndpoint: string;
  method: string;
  button: HTMLButtonElement;
}) => {
  button.disabled = true;
  setResult('');

  fetch(apiEndpoint, {
    method,

    ...(method === 'POST'
      ? {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ test: 123 }),
        }
      : {}),
  })
    .then((response) => response.json())
    .then((data) => {
      setResult(JSON.stringify(data, null, 2));
    })
    .catch((err: any) => {
      setResult(err);
    })
    .finally(() => {
      button.disabled = false;
    });
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container max-w-7xl px-2 py-4 mx-auto">
    <div class="flex space-x-2" id="buttons"></div>
    <pre id="result" class="rounded-md px-4 py-2 mt-4 bg-gray-100 border-gray-400 border text-gray-600"></pre>
  </div>
`;

[
  { apiEndpoint: '/api/users', method: 'GET' },
  { apiEndpoint: '/fake-api/test-simple', method: 'POST' },
  { apiEndpoint: '/fake-api/test-simple-func?q=1', method: 'POST' },
  { apiEndpoint: '/fake-api/test-raw-func?q=2', method: 'POST' },
  { apiEndpoint: '/fake-api/params/123?q=2', method: 'GET' },
].forEach(({ method, apiEndpoint }, idx) => {
  const id = `button${idx}`;
  document.querySelector('#buttons')!.append(
    makeButton({
      content: `${method} ${apiEndpoint}`,
      id,
    }),
  );

  document.querySelector(`#${id}`)!.addEventListener('click', (event) => {
    doFetch({
      apiEndpoint,
      method,
      button: event.target as HTMLButtonElement,
    });
  });
});
