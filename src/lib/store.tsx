import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  comments as seedComments,
  currentUserId,
  initialCollections,
  initialNotifications,
  recipes as seedRecipes,
  users,
} from "@/data/mock";
import type { AppNotification, Collection, Comment, Recipe, User } from "@/data/types";

const STORAGE_KEY = "ranna-state-v1";

interface PersistedState {
  liked: string[];
  saved: string[];
  following: string[];
  collections: Collection[];
  extraRecipes: Recipe[];
  edits: Record<string, Partial<Recipe>>;
  deleted: string[];
  extraComments: Comment[];
  recentSearches: string[];
  notifications: AppNotification[];
  signedIn: boolean;
}

const emptyState: PersistedState = {
  liked: ["r3"],
  saved: ["r1", "r9", "r5", "r3", "r4", "r8"],
  following: ["u2"],
  collections: initialCollections,
  extraRecipes: [],
  edits: {},
  deleted: [],
  extraComments: [],
  recentSearches: ["kacchi", "lava cake"],
  notifications: initialNotifications,
  signedIn: true,
};

interface StoreValue extends PersistedState {
  recipes: Recipe[];
  users: User[];
  currentUser: User;
  allComments: Comment[];
  isLiked: (id: string) => boolean;
  isSaved: (id: string) => boolean;
  isFollowing: (id: string) => boolean;
  toggleLike: (id: string) => boolean;
  toggleSave: (id: string, collectionId?: string) => boolean;
  toggleFollow: (id: string) => boolean;
  addCollection: (name: string) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, patch: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  addComment: (c: Omit<Comment, "id" | "likes">) => void;
  addRecentSearch: (q: string) => void;
  markNotificationsRead: () => void;
  setSignedIn: (v: boolean) => void;
  getRecipe: (idOrSlug: string) => Recipe | undefined;
  getUser: (id: string) => User | undefined;
  getUserByUsername: (username: string) => User | undefined;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(emptyState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...emptyState, ...(JSON.parse(raw) as PersistedState) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const patch = useCallback(
    (p: Partial<PersistedState> | ((s: PersistedState) => Partial<PersistedState>)) =>
      setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) })),
    [],
  );

  const recipes = useMemo(() => {
    const merged = [...state.extraRecipes, ...seedRecipes]
      .filter((r) => !state.deleted.includes(r.id))
      .map((r) => (state.edits[r.id] ? { ...r, ...state.edits[r.id] } : r));
    return merged;
  }, [state.extraRecipes, state.deleted, state.edits]);

  const allComments = useMemo(
    () => [...seedComments, ...state.extraComments],
    [state.extraComments],
  );

  const value: StoreValue = {
    ...state,
    recipes,
    users,
    allComments,
    currentUser: users.find((u) => u.id === currentUserId)!,
    isLiked: (id) => state.liked.includes(id),
    isSaved: (id) => state.saved.includes(id),
    isFollowing: (id) => state.following.includes(id),
    toggleLike: (id) => {
      const next = !state.liked.includes(id);
      patch((s) => ({
        liked: next ? [...s.liked, id] : s.liked.filter((x) => x !== id),
      }));
      return next;
    },
    toggleSave: (id, collectionId) => {
      const next = !state.saved.includes(id);
      patch((s) => ({
        saved: next ? [...s.saved, id] : s.saved.filter((x) => x !== id),
        collections: s.collections.map((c) =>
          c.id === (collectionId ?? s.collections[0]?.id)
            ? {
                ...c,
                recipeIds: next
                  ? Array.from(new Set([...c.recipeIds, id]))
                  : c.recipeIds.filter((x) => x !== id),
              }
            : { ...c, recipeIds: next ? c.recipeIds : c.recipeIds.filter((x) => x !== id) },
        ),
      }));
      return next;
    },
    toggleFollow: (id) => {
      const next = !state.following.includes(id);
      patch((s) => ({
        following: next ? [...s.following, id] : s.following.filter((x) => x !== id),
      }));
      return next;
    },
    addCollection: (name) =>
      patch((s) => ({
        collections: [...s.collections, { id: `col-${Date.now()}`, name, recipeIds: [] }],
      })),
    addRecipe: (recipe) => patch((s) => ({ extraRecipes: [recipe, ...s.extraRecipes] })),
    updateRecipe: (id, p) =>
      patch((s) => ({ edits: { ...s.edits, [id]: { ...s.edits[id], ...p } } })),
    deleteRecipe: (id) => patch((s) => ({ deleted: [...s.deleted, id] })),
    addComment: (c) =>
      patch((s) => ({
        extraComments: [
          ...s.extraComments,
          { ...c, id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, likes: 0 },
        ],
      })),
    addRecentSearch: (q) =>
      patch((s) => ({
        recentSearches: [q, ...s.recentSearches.filter((x) => x !== q)].slice(0, 6),
      })),
    markNotificationsRead: () =>
      patch((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    setSignedIn: (v) => patch({ signedIn: v }),
    getRecipe: (idOrSlug) => recipes.find((r) => r.id === idOrSlug || r.slug === idOrSlug),
    getUser: (id) => users.find((u) => u.id === id),
    getUserByUsername: (username) => users.find((u) => u.username === username),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function formatCount(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

export function formatTime(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
