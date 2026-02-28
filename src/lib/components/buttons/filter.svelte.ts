import { page } from "$app/state";
import { goto } from "$app/navigation";

export class SSRFilters {
  Filters = $derived(page.url);

  get(name: string) {
    return this.Filters.searchParams.get(name);
  }

  getDate(name: string) {
    const value = this.Filters.searchParams.get(name);
    if (!value) return undefined;
    return Number(value);
  }

  async update(filters: Record<string, string | undefined>) {
    const url = new URL(this.Filters);
    Object.entries(filters).forEach(([name, value]) => {
      if (!value) {
        url.searchParams.delete(name);
      }

      if (
        value === undefined ||
        value === "" ||
        value === "null" ||
        value === "undefined"
      ) {
        url.searchParams.delete(name);
      } else {
        url.searchParams.set(name, value);
      }
    });

    if (typeof window !== "undefined") {
      await goto(url, { keepFocus: true });
    }
  }

  async clear(...params: string[]) {
    const url = new URL(this.Filters);
    params.forEach((p) => url.searchParams.delete(p));
    if (typeof window !== "undefined") {
      const newURL = url.origin + url.pathname;

      await goto(newURL, { keepFocus: true });
    }
  }

  isFiltered(...params: string[]) {
    return (
      params.length > 0 && params.some((p) => this.Filters.searchParams.has(p))
    );
  }
}

export const filters = new SSRFilters();
