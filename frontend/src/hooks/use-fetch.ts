export default function useFetch() {
  return {
    data: null,
    loading: false,
    error: null,
    revalidate: async () => {},
  };
}
