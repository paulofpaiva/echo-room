/** Minimal Deno types for Supabase Edge Functions so the IDE/linter does not complain. */
declare const Deno: {
  env: { get(key: string): string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};
