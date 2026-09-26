const PAGE_SIZE = 1000;

/**
 * PostgREST returns at most max_rows (1000 on this project) per request and
 * silently drops the rest. Use this for queries that need every row.
 *
 * `page(from, to)` must end with `.order(<unique column>).range(from, to)`.
 * On an error it logs and returns the rows fetched so far, like the callers'
 * previous `data ?? []` handling.
 */
export async function fetchAll<T>(
  page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await page(from, from + PAGE_SIZE - 1);
    if (error) {
      console.error("[fetchAll]", error.message);
      return rows;
    }
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
}
