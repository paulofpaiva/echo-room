import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

type NavigationContextValue = {
  historyStack: string[];
  currentPath: string;
  getBackTarget: () => { to: string; label: string };
  navigateBack: (to: string) => void;
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
  if (path.startsWith("/news/") && path.includes("/comment/")) return "Back to article";
  return "Back";
}

/**
 * Hierarchical parent path for the current route. Used when history stack is
 * empty (direct load, new tab, refresh) so Back still has a sensible target.
 */
function getParentPath(fullPath: string): string {
  const pathname = fullPath.split("?")[0];
  const query = fullPath.includes("?") ? fullPath.slice(fullPath.indexOf("?")) : "";

  // /c/slug/post/postId/comment/commentId → /c/slug/post/postId
  if (pathname.includes("/post/") && pathname.includes("/comment/")) {
    const match = pathname.match(/^(\/c\/[^/]+\/post\/[^/]+)\/comment\/[^/]+/);
    return match ? match[1] + query : "/";
  }
  // /c/slug/post/postId or /c/slug/post/new → /c/slug
  if (pathname.includes("/post/")) {
    const match = pathname.match(/^(\/c\/[^/]+)\//);
    return match ? match[1] + query : "/";
  }
  // /c/slug → home
  if (/^\/c\/[^/]+\/?$/.test(pathname)) return "/";
  // /news/id/comment/cid → /news/id
  if (pathname.includes("/news/") && pathname.includes("/comment/")) {
    const match = pathname.match(/^(\/news\/[^/]+)\/comment\/[^/]+/);
    return match ? match[1] + query : "/news";
  }
  // /news/id → /news
  if (pathname.match(/^\/news\/[^/]+\/?$/)) return "/news";
  // Hub pages → home
  if (pathname === "/communities" || pathname.startsWith("/search") || pathname === "/news") return "/";
  return "/";
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState(location.pathname + location.search);
  const ref = useRef(location.pathname + location.search);
  const isInitialMount = useRef(true);

  useLayoutEffect(() => {
    const current = location.pathname + location.search;
    const fromBack = (location.state as { fromBack?: boolean } | null)?.fromBack === true;

    if (fromBack) {
      setHistoryStack((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
    } else if (ref.current !== current) {
      if (!isInitialMount.current) {
        setHistoryStack((prev) => [...prev, ref.current]);
      }
    }

    isInitialMount.current = false;
    setCurrentPath(current);
    ref.current = current;
  }, [location]);

  const getBackTarget = useCallback((): { to: string; label: string } => {
    const pathname = currentPath.split("?")[0];
    const stack = historyStack;

    if (pathname === "/" || pathname === "") {
      return { to: "/", label: "Back to home" };
    }

    const to = stack.length > 0 ? stack[stack.length - 1]! : getParentPath(currentPath);
    const label = pathToBackLabel(to);
    return { to: to || "/", label };
  }, [currentPath, historyStack]);

  const navigateBack = useCallback(
    (to: string) => {
      navigate(to, { replace: true, state: { fromBack: true } });
    },
    [navigate]
  );

  const value: NavigationContextValue = {
    historyStack,
    currentPath,
    getBackTarget,
    navigateBack,
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

export function useBackLink(): {
  to: string;
  label: string;
  navigateBack: (to: string) => void;
  currentPath: string;
} {
  const { getBackTarget, navigateBack, currentPath } = useNavigation();
  const { to, label } = getBackTarget();
  return { to, label, navigateBack, currentPath };
}
