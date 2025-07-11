import { fetchRetryProxy } from './fetch-retry-proxy';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

const { Response, FetchError } = jest.requireActual('node-fetch');

jest.mock('node-fetch', () => jest.fn());

const mockedFetch = fetch as unknown as jest.Mock;

describe('fetchRetryProxy', () => {
  const url = 'https://example.com';
  const agents = [
    new HttpsProxyAgent('http://proxy1'),
    new HttpsProxyAgent('http://proxy2'),
  ];

  beforeEach(() => {
    mockedFetch.mockClear();
  });

  it('should return a successful response on the first try', async () => {
    mockedFetch.mockResolvedValueOnce(new Response('OK'));

    const response = await fetchRetryProxy(url, {}, agents);
    expect(response.ok).toBe(true);
    expect(await response.text()).toBe('OK');
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith(url, { agent: agents[0] });
  });

  it('should retry with the next agent if the first one fails', async () => {
    mockedFetch
      .mockRejectedValueOnce(new FetchError('Proxy 1 failed', 'system'))
      .mockResolvedValueOnce(new Response('OK from Proxy 2'));

    const response = await fetchRetryProxy(url, {}, agents);
    expect(response.ok).toBe(true);
    expect(await response.text()).toBe('OK from Proxy 2');
    expect(mockedFetch).toHaveBeenCalledTimes(2);
    expect(mockedFetch).toHaveBeenCalledWith(url, { agent: agents[0] });
    expect(mockedFetch).toHaveBeenCalledWith(url, { agent: agents[1] });
  });

  it('should throw an error if all agents fail', async () => {
    const lastError = new FetchError('Proxy 2 failed', 'system');
    mockedFetch
      .mockRejectedValueOnce(new FetchError('Proxy 1 failed', 'system'))
      .mockRejectedValueOnce(lastError);

    await expect(fetchRetryProxy(url, {}, agents)).rejects.toThrow(lastError);
    expect(mockedFetch).toHaveBeenCalledTimes(2);
  });

  it('should work without agents like regular fetch', async () => {
    mockedFetch.mockResolvedValueOnce(new Response('OK'));
    const response = await fetchRetryProxy(url, {}, []);
    expect(response.ok).toBe(true);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith(url, { agent: undefined });
  });
});