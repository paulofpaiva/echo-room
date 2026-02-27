import { useState, useEffect } from "react";
import { fetchCountryCode, getCachedCountryCode } from "@/services/geo";

export function useCountryCode(): { countryCode: string | null; isLoading: boolean } {
  const [countryCode, setCountryCode] = useState<string | null>(() => getCachedCountryCode());
  const [isLoading, setIsLoading] = useState(!countryCode);

  useEffect(() => {
    if (countryCode != null) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    fetchCountryCode().then((code) => {
      if (!cancelled) {
        setCountryCode(code);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  return { countryCode, isLoading };
}
