# fetch-retry-proxy

[![npm version](https://img.shields.io/npm/v/fetch-retry-proxy.svg)](https://www.npmjs.com/package/fetch-retry-proxy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`fetch-retry-proxy` is a lightweight module for Node.js that extends `node-fetch` and adds resilience when working through proxies. It performs fetch requests using a sequence of proxy agents, automatically switching to the next agent if one fails.

## Features

- **Resilience**: Automatically tries the next proxy agent if the current one is unavailable.
- **Simplicity**: Minimalistic API that integrates easily into existing code.
- **Flexibility**: Compatible with any agents such as `https-proxy-agent`.
- **Standard interface**: Works like ordinary `node-fetch` if no proxy agents are provided.

## Installation

```bash
npm install fetch-retry-proxy
```

You will also need a package for creating agents, for example `https-proxy-agent` or `socks-proxy-agent`:

```bash
npm install https-proxy-agent
npm install socks-proxy-agent
```

## Usage
Below is a basic example of using fetch-retry-proxy with a list of proxy agents.
```typescript
import { fetchRetryProxy } from 'fetch-retry-proxy';
import { HttpsProxyAgent } from 'https-proxy-agent';

async function fetchData() {
    const url = 'https://api.ipify.org?format=json';

    // Your proxy agents
    const agents = [
        new HttpsProxyAgent('http://user:pass@proxy1.example.com:8080'),
        new HttpsProxyAgent('http://user:pass@proxy2.example.com:8080'),
        new HttpsProxyAgent('http://user:pass@proxy3.example.com:8080'),
    ];

    try {
        // Perform the request
        const response = await fetchRetryProxy(url, {}, agents);

        if (response.ok) {
            const data = await response.json();
            console.log('Successful response:', data);
        } else {
            console.error(`Request error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('All proxy attempts failed:', error);
    }
}

fetchData();
```
## API
### fetchRetryProxy(url, options, agents)
Performs a fetch request with the ability to fall back across multiple proxy agents.

- `url` (`string`, required): The request URL.
- `options` (`object`, required): Options object for node-fetch. `fetch-retry-proxy` will add the `agent` property to this object for each attempt.
- `agents` (`Array<Agent>`, required): Array of agent instances (e.g. from `https-proxy-agent`). The function iterates through the array, trying each agent until a successful connection is made.
Returns: A `Promise` that resolves with the `Response` object from the first successful fetch request. If all agents fail with a `FetchError`, the promise is rejected with the last received `FetchError`.

## Examples
### POST request
You can pass any node-fetch options such as `method`, `headers` and `body`.

```typescript
const postData = { key: 'value' };

const options = {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: { 'Content-Type': 'application/json' }
};

const response = await fetchRetryProxy('https://api.example.com/submit', options, agents);
const result = await response.json();
console.log(result);
```
### Using without a proxy
If you pass an empty array of agents, fetch-retry-proxy behaves like standard node-fetch.

```typescript
// This call is equivalent to fetch(url, options)
const response = await fetchRetryProxy('https://api.example.com/data', {}, []);
```
## How it works
The function iterates over the `agents` array you provide. For each agent it tries to perform a fetch request.

- If the request succeeds, the function immediately returns the server response.
- If the request ends with a `FetchError` (usually indicating a network or connection issue, for example the proxy server is not working), it prints a warning to the console and tries the next agent in the list.
- If the request ends with any other error, the function throws that error immediately.
- If all agents in the list end with a `FetchError`, the function throws the last received `FetchError`.
## License
MIT

---

## Перевод на русский
# fetch-retry-proxy

[![npm version](https://img.shields.io/npm/v/fetch-retry-proxy.svg)](https://www.npmjs.com/package/fetch-retry-proxy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`fetch-retry-proxy` — это легковесный модуль для Node.js, который расширяет `node-fetch`, добавляя отказоустойчивость при работе с прокси. Он позволяет выполнять fetch-запросы через последовательность прокси-агентов, автоматически переключаясь на следующий агент в случае сбоя.

## Особенности

- **Отказоустойчивость**: Автоматически пытается использовать следующий прокси-агент, если текущий недоступен.
- **Простота**: Минималистичный API, который легко интегрировать в существующий код.
- **Гибкость**: Совместим с любыми агентами, такими как `https-proxy-agent`.
- **Стандартный интерфейс**: Если прокси-агенты не предоставлены, работает как обычный `node-fetch`.

## Установка

```bash
npm install fetch-retry-proxy
```

Вам также понадобится пакет для создания агентов, например https-proxy-agent или socks-proxy-agent:

```bash
npm install https-proxy-agent
npm install socks-proxy-agent
```

## Использование
Вот базовый пример использования fetch-retry-proxy со списком прокси-агентов.
```
import { fetchRetryProxy } from 
'fetch-retry-proxy';
import { HttpsProxyAgent } from 
'https-proxy-agent';

async function fetchData() {
    const url = 'https://api.ipify.org?
    format=json';

    // Список ваших прокси-агентов
    const agents = [
        new HttpsProxyAgent('http://
        user:pass@proxy1.example.com:8080'),
        new HttpsProxyAgent('http://
        user:pass@proxy2.example.com:8080'),
        new HttpsProxyAgent('http://
        user:pass@proxy3.example.com:8080'),
    ];

    try {
        // Выполняем запрос
        const response = await resilientFetch
        (url, {}, agents);

        if (response.ok) {
            const data = await response.json
            ();
            console.log('Успешный ответ:', 
            data);
        } else {
            console.error(`Ошибка запроса: $
            {response.status} ${response.
            statusText}`);
        }
    } catch (error) {
        console.error('Все попытки через 
        прокси провалились:', error);
    }
}

fetchData();
```
## API
### fetchRetryProxy(url, options, agents)
Выполняет fetch-запрос с возможностью отката между несколькими прокси-агентами.

- url ( string , обязательный): URL-адрес для запроса.
- options ( object , обязательный): Объект опций для node-fetch . resilient-fetch будет добавлять свойство agent в этот объект для каждой попытки.
- agents ( Array<Agent> , обязательный): Массив экземпляров агентов (например, из https-proxy-agent ). Функция будет перебирать этот массив, пробуя каждый агент до тех пор, пока не будет установлено успешное соединение.
Возвращает: Promise , который разрешается объектом Response от первого успешного fetch-запроса. Если все агенты завершаются с ошибкой FetchError , Promise будет отклонен с последней полученной ошибкой FetchError.

## Примеры
### POST-запрос
Вы можете передавать любые опции node-fetch , такие как method , headers и body .

```
const postData = { key: 'value' };

const options = {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: { 'Content-Type': 'application/
    json' }
};

const response =fetchRetryProxy
('https://api.example.com/submit', options, 
agents);
const result = await response.json();
console.log(result);
```
### Использование без прокси
Если вы передадите пустой массив агентов, fetch-retry-fetch будет вести себя как стандартный node-fetch .

```
// Этот вызов эквивалентен fetch(url, options)
const response = await fetchRetryProxy
('https://api.example.com/data', {}, []);
```
## Как это работает
Функция перебирает предоставленный вами массив agents . Для каждого агента она пытается выполнить fetch -запрос.

- Если запрос успешен, функция немедленно возвращает ответ сервера.
- Если запрос завершается с ошибкой FetchError (обычно это указывает на проблему с сетью или соединением, например, прокси-сервер не работает), она выводит предупреждение в консоль и пробует следующий агент в списке.
- Если запрос завершается с любой другой ошибкой, функция немедленно выбрасывает эту ошибку.
- Если все агенты в списке завершаются с FetchError , функция выбрасывает последнюю полученную FetchError .
## Лицензия
MIT
