export type AppRole = "CUSTOMER" | "ADMIN";

export type AuthUser = {
  displayName: string;
  roles: AppRole[];
  source: "jwt" | "local";
};

const TOKEN_STORAGE_KEYS = ["microshop.accessToken", "accessToken", "access_token", "kcToken"];
const CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? "microservices-web";

type JwtPayload = {
  preferred_username?: string;
  name?: string;
  email?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<string, { roles?: string[] }>;
};

export function getStoredAccessToken() {
  for (const key of TOKEN_STORAGE_KEYS) {
    const token = localStorage.getItem(key);
    if (token) {
      return token;
    }
  }
  return null;
}

export function readAuthUser(): AuthUser {
  const token = getStoredAccessToken();
  const payload = token ? parseJwtPayload(token) : null;

  if (payload) {
    return {
      displayName: payload.name ?? payload.preferred_username ?? payload.email ?? "Authenticated user",
      roles: extractRoles(payload),
      source: "jwt"
    };
  }

  return {
    displayName: "Customer demo",
    roles: ["CUSTOMER"],
    source: "local"
  };
}

export function hasRole(user: AuthUser, role: AppRole) {
  return user.roles.includes(role);
}

function extractRoles(payload: JwtPayload): AppRole[] {
  const rawRoles = new Set<string>();

  payload.realm_access?.roles?.forEach((role) => rawRoles.add(role));
  payload.resource_access?.[CLIENT_ID]?.roles?.forEach((role) => rawRoles.add(role));

  const roles: AppRole[] = [];
  if (rawRoles.has("ADMIN") || rawRoles.has("ROLE_ADMIN")) {
    roles.push("ADMIN");
  }
  if (rawRoles.has("CUSTOMER") || rawRoles.has("ROLE_CUSTOMER")) {
    roles.push("CUSTOMER");
  }

  return roles.length > 0 ? roles : ["CUSTOMER"];
}

function parseJwtPayload(token: string): JwtPayload | null {
  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}
