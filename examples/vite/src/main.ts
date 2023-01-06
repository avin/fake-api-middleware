import './style.css';

const makeButton = ({ content, id }: { content: string; id: string }) => {
  return `<button class="rounded-md px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-50" id="${id}">${content}</button>`;
};

const appendResult = (content: string) => {
  document.querySelector('#result')!.innerHTML += content;
};

const writeLine = () => {
  appendResult('\n\n---------------------------------\n\n');
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
  appendResult(`${method} ${apiEndpoint}\n`);
  button.disabled = true;
  fetch(apiEndpoint, { method })
    .then((response) => response.json())
    .then((data) => {
      appendResult('\n');
      appendResult(JSON.stringify(data, null, 2));
      writeLine();
    })
    .catch((err: any) => {
      console.log(err);
      appendResult('\n');
      appendResult(err);
      writeLine();
    })
    .finally(() => {
      button.disabled = false;
    });
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container max-w-7xl px-2 py-4 mx-auto">
    <div class="flex space-x-2">
      ${makeButton({ content: 'GET /api/users', id: 'fetchUsers' })}
      ${makeButton({ content: 'POST /api/test', id: 'fetchTest' })}
    </div>
    <pre id="result" class="rounded-md px-4 py-2 mt-4 bg-gray-100 border-gray-400 border text-gray-600"></pre>
  </div>
`;

[
  { selector: '#fetchUsers', apiEndpoint: '/api/users', method: 'GET' },
  { selector: '#fetchTest', apiEndpoint: '/api/test', method: 'POST' },
].forEach(({ selector, method, apiEndpoint }) => {
  document.querySelector(selector)!.addEventListener('click', (event) => {
    doFetch({
      apiEndpoint,
      method,
      button: event.target as HTMLButtonElement,
    });
  });
});
