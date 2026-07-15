import axios from "axios";
import type { Business } from "@/lib/types";

// Phase 2.2 (Discovery Curation System) - a small, self-contained, typed
// client for the new /admin/collections + /admin/businesses/:id/featured
// endpoints. Deliberately not bolted onto lib/api.ts's older
// AxiosFetchResponse/adminAuthFetch pattern - this admin section is built
// with the polished @/components/ui design system (matching the rest of V4),
// so it gets the same clean request() shape lib/business/api.ts already uses,
// rather than mixing two conventions in one growing megafile.

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.revoras.tech/api";

const getAdminToken = (): string => (typeof window === "undefined" ? "" : localStorage.getItem("adminToken") || "");

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Params = Record<string, string | number | boolean | undefined>;

const request = async <T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; params?: Params } = {}
): Promise<T> => {
  const query = options.params
    ? "?" +
      new URLSearchParams(
        Object.entries(options.params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";

  const token = getAdminToken();
  const res = await axios.request<T>({
    url: `${API}${path}${query}`,
    method: options.method ?? "GET",
    data: options.body,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    validateStatus: () => true,
  });

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
    throw new ApiError(401, "Session expired");
  }
  if (res.status >= 400) {
    const message = (res.data as { error?: string })?.error || "Request failed";
    throw new ApiError(res.status, message);
  }
  return res.data;
};

export interface AdminCollection {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  coverImageUrl: string | null;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  startAt: string | null;
  endAt: string | null;
  targetCity: string | null;
  targetState: string | null;
  filterCategoryId: string | null;
  filterMinRating: number | null;
  filterVerifiedOnly: boolean;
  filterPremiumOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCollectionDetail extends AdminCollection {
  pinnedBusinessIds: string[];
}

export interface CollectionItemRow {
  id: string;
  collection_id: string;
  business_id: string;
  sort_order: number;
  created_at: string;
}

export interface CollectionFormInput {
  title?: string;
  subtitle?: string | null;
  slug?: string;
  coverImageUrl?: string | null;
  description?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  startAt?: string | null;
  endAt?: string | null;
  targetCity?: string | null;
  targetState?: string | null;
  filterCategoryId?: string | null;
  filterMinRating?: number | null;
  filterVerifiedOnly?: boolean;
  filterPremiumOnly?: boolean;
}

export interface FeaturedInput {
  isFeatured: boolean;
  priority?: number;
  startAt?: string | null;
  endAt?: string | null;
  region?: string | null;
  reason?: string | null;
}

export const curationApi = {
  listCollections: (params: { search?: string; page?: number; limit?: number } = {}) =>
    request<{ collections: AdminCollection[]; pagination: { page: number; limit: number; total: number; pages: number } }>(
      "/admin/collections",
      { params }
    ),
  getCollection: (id: string) => request<{ collection: AdminCollectionDetail }>(`/admin/collections/${id}`),
  previewCollection: (id: string, params: { page?: number; limit?: number } = {}) =>
    request<{ collection: AdminCollection; businesses: (Business & { pinned?: boolean })[]; pagination: { page: number; limit: number; total: number; pages: number } }>(
      `/admin/collections/${id}/preview`,
      { params }
    ),
  createCollection: (body: CollectionFormInput) =>
    request<{ message: string; collection: AdminCollection }>("/admin/collections", { method: "POST", body }),
  updateCollection: (id: string, body: CollectionFormInput) =>
    request<{ message: string; collection: AdminCollection }>(`/admin/collections/${id}`, { method: "PATCH", body }),
  deleteCollection: (id: string) => request<{ message: string }>(`/admin/collections/${id}`, { method: "DELETE" }),
  duplicateCollection: (id: string) =>
    request<{ message: string; collection: AdminCollection }>(`/admin/collections/${id}/duplicate`, { method: "POST" }),
  pinBusiness: (id: string, businessId: string) =>
    request<{ message: string; items: CollectionItemRow[] }>(`/admin/collections/${id}/items`, {
      method: "POST",
      body: { businessId },
    }),
  unpinBusiness: (id: string, businessId: string) =>
    request<{ message: string; items: CollectionItemRow[] }>(`/admin/collections/${id}/items/${businessId}`, {
      method: "DELETE",
    }),
  reorderItems: (id: string, orderedBusinessIds: string[]) =>
    request<{ message: string; items: CollectionItemRow[] }>(`/admin/collections/${id}/items/reorder`, {
      method: "PATCH",
      body: { orderedBusinessIds },
    }),

  setFeatured: (businessId: string, body: FeaturedInput) =>
    request<{ message: string; business: Business & Record<string, unknown> }>(`/admin/businesses/${businessId}/featured`, {
      method: "PATCH",
      body,
    }),
};
