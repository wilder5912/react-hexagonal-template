# base_v1 - React Template + Hexagonal Architecture

Reusable base template for medium/large React projects. It combines
**hexagonal architecture** (ports and adapters) with the modern React stack:
**TypeScript + React Query + Zustand + React Router + Bootstrap**.

It includes the following working examples:

- **Real login** against an API (with JWT token and protected routes).
- **Password encryption** on the client side through WebCrypto (domain port).
- **Users table** (read-only) powered by React Query.
- **Full product CRUD** (create/read/update/delete) as the end-to-end reference
  example for the hexagonal pattern.
- Navigable **Home**, **Account**, **Login**, **Users**, and **Products** pages.

---

## Stack

| Layer | Technology | Role |
|---|---|---|
| Language | **TypeScript** | Static typing across the whole project |
| Build | **Vite** | Dev server and bundler |
| Data / server | **React Query (TanStack)** | Cache, loading states, retries |
| Global state | **Zustand** | Auth session state (persisted in localStorage) |
| Routing | **React Router** | Routing and protected-route guards |
| HTTP | **Axios** | Central HTTP client with interceptors |
| UI | **Bootstrap** | Styling |

---

## Architecture

The project separates **business logic** (hexagonal modules) from the **UI** and
the **React bridge** (`store` + hooks). The golden rule is: dependencies always
point toward the domain, never the other way around.

```
UI (React)
  -> app/ (hooks + store)          <- React bridge <-> modules
    -> modules/<x>/ (hexagonal)    <- pure logic, no React
      |-- domain/                  <- models + ports (interfaces)
      |-- application/             <- use cases
      `-- infrastructure/          <- adapters (API, crypto, ...)
    -> shared/                     <- http client, config
```

### The 3 layers in each module

- **`domain/`** - Models (`AuthUser`, `User`) and **ports** (interfaces such as
  `AuthRepository`, `PasswordHasher`). It knows nothing about HTTP or React. This
  is the business "source of truth".
- **`application/`** - **Use cases** (`LoginUser`, `SearchAllUsers`). They
  orchestrate the domain and receive ports through constructor injection.
- **`infrastructure/`** - **Adapters** that implement the ports
  (`ApiAuthRepository` with Axios, `WebCryptoPasswordHasher` with WebCrypto).
  Everything "dirty" lives here: fetches, external JSON mapping, libraries.

Each module exposes a **composition root** (`index.ts`) that wires
infrastructure + use cases together and returns a simple API for the UI.

### The React bridge (`app/`)

The UI does **not** instantiate modules directly. It does so through:

- **`app/modules.ts`** - single instance of each module (centralized injection).
- **`app/stores/authStore.ts`** - Zustand store with the persisted session.
- **`app/hooks/`** - hooks that wrap use cases with React Query
  (`useAuth`, `useUsers`). This is where cache, loading, and error handling are decided.

> This makes it possible to test modules with fake adapters without touching React.

---

## Folder structure

```
src/
  app/                      # React <-> hexagonal bridge
    hooks/
      useAuth.ts            # login/logout (React Query + Zustand)
      useUsers.ts           # users table (React Query)
      useProducts.ts        # product CRUD (query + mutations)
    stores/
      authStore.ts          # global session (Zustand + persist)
    modules.ts              # singleton module instances

  modules/                  # business logic (hexagonal, no React)
    auth/
      domain/               # AuthUser, AuthRepository, PasswordHasher
      application/          # LoginUser, LogoutUser
      infrastructure/       # ApiAuthRepository, WebCryptoPasswordHasher
      index.ts              # composition root
    users/
      domain/               # User, UserRepository
      application/          # SearchAllUsers, FindUser
      infrastructure/       # JsonPlaceholderUserRepository
      index.ts
    products/               # full CRUD (reference example)
      domain/               # Product, ProductRepository (5 operations)
      application/          # SearchAll/ Find/ Create/ Update/ Delete/
      infrastructure/       # ApiProductRepository
      index.ts

  shared/                   # cross-cutting concerns
    config/apiConfig.ts     # base API URLs
    http/httpClient.ts      # Axios client + token interceptor

  ui/                       # presentation (React)
    components/             # ProtectedRoute, AppLayout (no page logic)
    pages/                  # one self-contained folder per page
      home/
        controller/         # useHomeController.ts  (logic)
        css/                # HomePage.module.css   (scoped styles)
        pages/              # HomePage.tsx          (view)
        index.ts            # barrel
      login/                # (same structure)
      users/                # (same structure)
      products/             # (same structure) - CRUD with table + form
      account/              # (same structure)
    router.tsx              # routes (public + protected)

  App.tsx                   # providers (React Query + Router)
  main.tsx                  # entrypoint + Bootstrap import
```

### Page pattern (controller / css / view)

Each page separates **logic** from **presentation**, following the same idea as
the port/adapter pattern but applied to the UI:

- **`controller/useXxxController.ts`** - state, handlers, and data (hooks).
  Testable without rendering.
- **`pages/XxxPage.tsx`** - just the view (JSX). It consumes the controller.
- **`css/XxxPage.module.css`** - page-specific styles with **CSS Modules**
  (automatic scoping so class names do not clash across pages).
- **`index.ts`** - barrel file that re-exports the page for clean imports.

---

## Authentication flow

1. `LoginPage` calls `useAuth().login({ username, password })`.
2. The hook executes the `LoginUser` use case (React Query handles loading/errors).
3. `LoginUser` derives a password fingerprint with `PasswordHasher` (WebCrypto) and
   requests the session from the `AuthRepository` port.
4. `ApiAuthRepository` performs `POST /login` and maps the response to `AuthSession`.
5. The hook stores the session in `authStore` (Zustand) -> the token is persisted.
6. `httpClient` injects `Authorization: Bearer <token>` into subsequent requests.
7. `ProtectedRoute` allows access to private routes.

> **Security note:** hashing the password in the frontend does **not** replace HTTPS
> or backend validation. `PasswordHasher` is included as a port/adapter pattern
> example; in production, real authentication must be validated on the server.

---

## Reference example: Product CRUD

The `products` module is the **complete** hexagonal pattern example: it includes
all five operations (list, find, create, update, delete) against a real API
(DummyJSON). Use it as a template for your own writable modules.

Its Application layer groups use cases **by action folder** (useful when there
are several operations):

```
modules/products/
  domain/
    Product.ts              # model + ProductDraft (data for create/edit)
    ProductRepository.ts    # port with the 5 operations
  application/
    SearchAll/SearchAllProducts.ts
    Find/FindProduct.ts
    Create/CreateProduct.ts
    Update/UpdateProduct.ts
    Delete/DeleteProduct.ts
  infrastructure/
    ApiProductRepository.ts # adapter: GET/POST/PUT/DELETE + mapper
  index.ts                  # composition root
```

The write flow for creating a product:

1. `ProductsPage` submits the form -> `useProductsController` calls `createProduct`.
2. The `useProducts` hook runs a React Query **mutation** over the `CreateProduct`
   use case.
3. `CreateProduct` delegates to `ProductRepository.create()`.
4. `ApiProductRepository` performs `POST /products/add` and maps the response to `Product`.
5. When it finishes, the mutation **invalidates the `['products']` cache** -> the table
   reloads automatically with the new item.

> **About the HTTP verb:** only the adapter knows that `create` is a `POST`,
> `update` is a `PUT`, and `remove` is a `DELETE`. The use case and UI speak in
> business terms (create/update/delete), not HTTP terms.

---

## Commands

```bash
npm install        # install dependencies
npm run dev        # development server (http://localhost:5173)
npm run build      # typecheck (tsc) + production build
npm run preview    # serve the build
npm test           # run tests (Vitest)
npm run test:watch # tests in watch mode
```

### Demo credentials

The login points to [DummyJSON](https://dummyjson.com/docs/auth) (test API, no key required):

```text
username: emilys
password: emilyspass
```

---

## Environment variables

API URLs live in environment variables (Vite only exposes variables that start
with `VITE_`). They are read in [`apiConfig.ts`](src/shared/config/apiConfig.ts)
through `import.meta.env`, with a fallback in case `.env` is missing.

| File | Use | Committed? |
|---|---|---|
| `.env` | Default development values | Yes |
| `.env.example` | Template to copy | Yes |
| `.env.local` | Secrets / local overrides | No (`.gitignore`) |

```bash
VITE_API_USERS_URL=https://jsonplaceholder.typicode.com
VITE_API_AUTH_URL=https://dummyjson.com/auth
```

Types are declared in [`src/vite-env.d.ts`](src/vite-env.d.ts) for autocomplete
and errors when a non-existent variable is used.

---

## Tests

Tests use **Vitest** and are colocated with the code (`*.test.ts`). They show the
value of the architecture: because use cases depend on **ports** (interfaces),
they can be tested by injecting fakes - **no network, no API, no DOM**.

```bash
npm test
```

Coverage includes:

- **`SearchAllUsers`** - use case with a fake `UserRepository`.
- **`JsonPlaceholderUserRepository`** - the adapter, with a fake `HttpClient`
  (verifies external JSON -> domain mapping and default values).
- **`LoginUser`** - use case with fake `AuthRepository` and `PasswordHasher`
  (verifies the hasher is invoked and errors are propagated).
- **`CreateProduct`** - write use case with a fake `ProductRepository`
  (verifies the draft is passed to the repository and errors are propagated).

> Pattern example: the test injects `{ search: vi.fn().mockResolvedValue(...) }`
> as the repository. The use case does not notice the difference from the real one.
> That is the benefit of depending on the interface instead of the implementation.

---

## How to add a new module

1. Create `src/modules/<name>/` with `domain/`, `application/`, and `infrastructure/`.
2. **Domain:** define the model and the port (repository interface).
3. **Application:** create the use cases (one class per action).
4. **Infrastructure:** implement the port against your API (using `httpClient`).
5. **`index.ts`:** wire the composition root and expose the use cases.
6. Register the instance in `app/modules.ts` and create a hook in `app/hooks/`.
7. Connect it to a page (see below) and a route in `ui/router.tsx`.

## How to add a new page

1. Create `src/ui/pages/<name>/` with `controller/`, `css/`, and `pages/`.
2. **`controller/use<Name>Controller.ts`** - the logic (state, handlers, data hooks).
3. **`pages/<Name>Page.tsx`** - the view; it consumes the controller and styles.
4. **`css/<Name>Page.module.css`** - scoped styles.
5. **`index.ts`** - `export { <Name>Page } from './pages/<Name>Page';`.
6. Add the route in `ui/router.tsx` (public, or inside `ProtectedRoute` if private).

---

## When to use (and not use) this architecture

Yes, it is **a good fit** for apps with real business logic, multiple data
sources, larger teams, or a need for isolated tests.

Use with caution when it is **too heavy** for simple CRUD apps or prototypes:
it introduces a fair amount of boilerplate (one use case = several files). For
something small, an `api.ts` file plus a hook is often enough.
