// User shape used by the domain and UI once external API data has been normalized.
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  company: string;
  city: string;
}
