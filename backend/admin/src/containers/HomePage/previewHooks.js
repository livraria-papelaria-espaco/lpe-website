import { useEffect, useState } from 'react';
import { request } from 'strapi-helper-plugin';

const useFetch = () => {
  const [state, setState] = useState({
    error: false,
    isLoading: true,
    data: '',
  });

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const fetchData = async () => {
      try {
        const response = await request('/utils/preview', {
          method: 'GET',
          signal,
        });
        setState({ isLoading: false, data: response.url, error: false });
      } catch (err) {
        setState({ isLoading: false, error: true, data: '' });
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  return state;
};

export default useFetch;
