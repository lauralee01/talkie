export type AuthUser = {
  id: string;
  email: string;
};

export type SessionPayload = {
  sub: string;
  email: string;
};
