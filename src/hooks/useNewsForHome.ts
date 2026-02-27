import { useQuery } from "@tanstack/react-query";
import { fetchNewsForHome } from "@/services/news";

const HOME_CAROUSEL_SIZE = 5;

export function useNewsForHome() {
  return useQuery({
    queryKey: ["news-for-home", HOME_CAROUSEL_SIZE],
    queryFn: () => fetchNewsForHome(HOME_CAROUSEL_SIZE),
  });
}
