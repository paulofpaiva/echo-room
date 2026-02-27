import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

type NavigationContextValue = {
  previousPath: string;
  currentPath: string;
  getBackTarget: (current: string, previous: string) => { to: string; label: string };
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

function pathToBackLabel(path: string): string {
  if (!path || path === "/") return "Back to home";
  if (path.startsWith("/communities")) return "Back to communities";
  if (path.startsWith("/search")) return "Back to search";
  if (path === "/news" || path.startsWith("/news?")) return "Back to news";
  if (path.startsWith("/news/") && !path.includes("/comment/")) return "Back to article";
  if (path.startsWith("/c/") && /^\/c\/[^/]+\/?$/.test(path.split("?")[0])) return "Back to community";
  if (path.startsWith("/c/") && path.includes("/post/") && !path.includes("/comment/")) return "Back to post";
  if (path.startsWith("/c/") && path.includes("/comment/")) return "Back to post";
  return "Back";
}

/**
 * Route → back target map. Hub pages (communities, search, news list) always
 * back to home to avoid loops (e.g. Communities → Community → Back → Communities
 * would then show "Back to community" and loop; we force "Back to home" on hubs).
 */
function getBackTargetForCurrentRoute(
  currentPath: string,
  previousPath: string
): { to: string; label: string } {
  const pathname = currentPath.split("?")[0];

  // Hub pages: always back to home so Back never sends to a detail we came from
  if (pathname === "/communities" || pathname.startsWith("/communities?")) {
    return { to: "/", label: "Back to home" };
  }
  if (pathname === "/search" || pathname.startsWith("/search?")) {
    return { to: "/", label: "Back to home" };
  }
  if (pathname === "/news") {
    return { to: "/", label: "Back to home" };
  }

  // Community feed: use previous (e.g. /communities or /)
  if (/^\/c\/[^/]+\/?$/.test(pathname)) {
    const to = previousPath || "/";
    return { to, label: pathToBackLabel(to) };
  }

  // Create post: back to that community feed
  if (/^\/c\/[^/]+\/post\/new\/?$/.test(pathname)) {
    const match = pathname.match(/^\/c\/([^/]+)\/post\/new/);
    const slug = match?.[1];
    if (slug) return { to: `/c/${slug}`, label: "Back to community" };
  }

  // Post detail: use previous (feed, search, or home)
  if (pathname.includes("/post/") && !pathname.includes("/comment/")) {
    const to = previousPath || "/";
    return { to, label: pathToBackLabel(to) };
  }

  // Comment detail (post thread): back to post
  if (pathname.includes("/comment/")) {
    const to = previousPath || "/";
    return { to, label: pathToBackLabel(to) };
  }

  // News article: use previous (news list or home)
  if (pathname.match(/^\/news\/[^/]+\/?$/) && !pathname.includes("/comment/")) {
    const to = previousPath || "/news";
    return { to, label: pathToBackLabel(to) };
  }

  // News comment detail: use previous (article or news list)
  if (pathname.includes("/news/") && pathname.includes("/comment/")) {
    const to = previousPath || "/news";
    return { to, label: pathToBackLabel(to) };
  }

  // Home or unknown: back to previous
  const to = previousPath || "/";
  return { to, label: pathToBackLabel(to) };
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState("/");
  const [currentPath, setCurrentPath] = useState(location.pathname + location.search);
  const ref = useRef(location.pathname + location.search);

  useLayoutEffect(() => {
    const current = location.pathname + location.search;
    if (ref.current !== current) {
      setPreviousPath(ref.current);
      setCurrentPath(current);
      ref.current = current;
    }
  }, [location]);

  const getBackTarget = useCallback(
    (current: string, previous: string) => getBackTargetForCurrentRoute(current, previous),
    []
  );

  const value: NavigationContextValue = {
    previousPath,
    currentPath,
    getBackTarget,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}

export function useBackLink(): { to: string; label: string } {
  const { previousPath, currentPath, getBackTarget } = useNavigation();
  return getBackTarget(currentPath, previousPath);
}
