import { useCallback, useState } from 'react';

function App() {
  const [isInProgress, setIsInProgress] = useState(false);
  const [result, setResult] = useState(null);

  const handleClickButton = useCallback((e) => {
    setIsInProgress(true);

    const { method, url } = e.currentTarget.dataset;

    fetch(url, {
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
      .catch((err) => {
        setResult(err.message);
      })
      .finally(() => {
        setIsInProgress(false);
      });
  }, []);

  return (
    <div className="container max-w-7xl mt-4 px-4 mx-auto">
      <div className="flex space-x-4">
        {[
          { method: 'GET', url: '/api/test-get' },
          {
            method: 'POST',
            url: '/api/test-post',
          },
        ].map(({ method, url, handler }, idx) => (
          <button
            type="button"
            onClick={handleClickButton}
            data-method={method}
            data-url={url}
            disabled={isInProgress}
            key={idx}
            className="border border-gray-600 bg-gray-200 hover:bg-gray-300 px-4 py-2 disabled:bg-gray-100 transition"
          >
            {method} {url}
          </button>
        ))}
      </div>

      <pre className="mt-4 border border-gray-500 bg-gray-50 p-4 text-gray-600">
        {result}
      </pre>
    </div>
  );
}

export default App;
