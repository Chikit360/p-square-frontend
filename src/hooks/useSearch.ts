import { useEffect, useState } from 'react';

// Create a generic hook that expects an array of items and a key for filtering.
const useSearch = <T>(items: T[], searchParams: URLSearchParams, filterKey: keyof T): T[] => {
  const [filteredData, setFilteredData] = useState<T[]>([]);

  useEffect(() => {
    const q = searchParams.get('q');
    console.log(q);

    if (!q) {
      setFilteredData(items);
    } else {
      setFilteredData(
        items.filter(item =>
          String(item[filterKey]).toLowerCase().includes(q?.toLowerCase() || '')
        )
      );
    }
  }, [searchParams, items, filterKey]);

  return filteredData;
};

export default useSearch;
