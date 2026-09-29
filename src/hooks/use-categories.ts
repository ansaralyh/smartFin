"use client";

import { api } from "@/lib/api";
import type { Category } from "@/types";
import { useCallback, useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return api.categories
      .list()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { categories, loading, refresh, names: categories.map((c) => c.name) };
}
