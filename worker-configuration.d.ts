// Augment the global CloudflareEnv interface from @opennextjs/cloudflare
// with project-specific bindings declared in wrangler.jsonc.
declare global {
  interface CloudflareEnv {
    CACHE_KV: KVNamespace;
    POLICY_AUD: string;
    TEAM_DOMAIN: string;
  }
}

export {};
