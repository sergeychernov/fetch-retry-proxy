import fetch from 'node-fetch';

/**
 * Выполняет fetch-запрос с возможностью отказоустойчивости через несколько прокси-агентов.
 * Если один агент не работает, функция автоматически пытается использовать следующий.
 * @param url - URL для запроса.
 * @param options - Опции для fetch-запроса.
 * @param agents - Массив агентов (прокси) для использования.
 * @returns - Promise, который разрешается с ответом от сервера.
 */
export async function fetchRetryProxy(url: string, options: any, agents: any[]) {
    let lastError: any = null;

    if (agents.length === 0) {
        // Если агенты не предоставлены, выполняем обычный fetch
        return fetch(url, options);
    }

    for (const agent of agents) {
        try {
            const response = await fetch(url, { ...options, agent });
            return response;
        } catch (error: any) {
            if (error.name === 'FetchError') {
                console.warn(`FetchError with agent, trying next agent.`);
                lastError = error;
            } else {
                throw error;
            }
        }
    }

    if (lastError) {
        throw lastError;
    }

    throw new Error('All fetch attempts failed without a specific FetchError.');
}