# base_v1 — Plantilla React + Arquitectura Hexagonal

Plantilla base reutilizable para proyectos React medianos/grandes. Combina
**arquitectura hexagonal** (puertos y adaptadores) con el stack moderno de React:
**TypeScript + React Query + Zustand + React Router + Bootstrap**.

Incluye como ejemplo funcional:

- **Login real** contra una API (con token JWT y rutas protegidas).
- **Encriptado** de contraseña en cliente vía WebCrypto (puerto del dominio).
- **Tabla de usuarios** (solo lectura) alimentada por React Query.
- **CRUD completo de productos** (crear/leer/editar/borrar) — el ejemplo de
  referencia del patrón hexagonal de punta a punta.
- Páginas **Home**, **Account**, **Login**, **Usuarios** y **Productos** navegables.

---

## Stack

| Capa | Tecnología | Rol |
|---|---|---|
| Lenguaje | **TypeScript** | Tipado estático en todo el proyecto |
| Build | **Vite** | Dev server y bundler |
| Datos / servidor | **React Query (TanStack)** | Cache, estados de carga, reintentos |
| Estado global | **Zustand** | Sesión de auth (persistida en localStorage) |
| Routing | **React Router** | Rutas y guards de rutas protegidas |
| HTTP | **Axios** | Cliente HTTP central con interceptores |
| UI | **Bootstrap** | Estilos |

---

## Arquitectura

El proyecto separa **lógica de negocio** (módulos hexagonales) de la **UI** y del
**puente con React** (store + hooks). La regla de oro: las dependencias apuntan
siempre hacia el dominio, nunca al revés.

```
UI (React)
  → app/ (hooks + store)          ← puente React ↔ módulos
    → modules/<x>/ (hexagonal)    ← lógica pura, sin React
      ├── domain/                 ← modelos + puertos (interfaces)
      ├── application/            ← casos de uso
      └── infrastructure/         ← adaptadores (API, crypto, ...)
    → shared/                     ← http client, config
```

### Las 3 capas de cada módulo

- **`domain/`** — Modelos (`AuthUser`, `User`) y **puertos** (interfaces como
  `AuthRepository`, `PasswordHasher`). No conoce HTTP ni React. Es la "verdad" del negocio.
- **`application/`** — **Casos de uso** (`LoginUser`, `SearchAllUsers`). Orquestan el
  dominio. Reciben los puertos por inyección en el constructor.
- **`infrastructure/`** — **Adaptadores** que implementan los puertos
  (`ApiAuthRepository` con Axios, `WebCryptoPasswordHasher` con WebCrypto). Aquí vive
  todo lo "sucio": fetch, mapeo de JSON externo, librerías.

Cada módulo expone un **composition root** (`index.ts`) que arma infraestructura +
casos de uso y devuelve una API simple para la UI.

### El puente con React (`app/`)

La UI **no** instancia los módulos directamente. Lo hace a través de:

- **`app/modules.ts`** — instancia única de cada módulo (inyección centralizada).
- **`app/stores/authStore.ts`** — store Zustand con la sesión (persistida).
- **`app/hooks/`** — hooks que envuelven los casos de uso con React Query
  (`useAuth`, `useUsers`). Aquí se decide cache, loading y errores.

> Esto permite testear los módulos con un adaptador falso sin tocar React.

---

## Estructura de carpetas

```
src/
  app/                      # puente React ↔ hexagonal
    hooks/
      useAuth.ts            # login/logout (React Query + Zustand)
      useUsers.ts           # tabla de usuarios (React Query)
      useProducts.ts        # CRUD de productos (query + mutations)
    stores/
      authStore.ts          # sesión global (Zustand + persist)
    modules.ts              # instancias únicas de los módulos

  modules/                  # lógica de negocio (hexagonal, sin React)
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
    products/               # CRUD completo (ejemplo de referencia)
      domain/               # Product, ProductRepository (5 operaciones)
      application/          # SearchAll/ Find/ Create/ Update/ Delete/
      infrastructure/       # ApiProductRepository
      index.ts

  shared/                   # transversal
    config/apiConfig.ts     # URLs base de las APIs
    http/httpClient.ts      # cliente Axios + interceptor de token

  ui/                       # presentación (React)
    components/             # ProtectedRoute, AppLayout (sin lógica de página)
    pages/                  # una carpeta autocontenida por página
      home/
        controller/         # useHomeController.ts  (lógica)
        css/                # HomePage.module.css   (estilos con scope)
        pages/              # HomePage.tsx           (vista)
        index.ts            # barrel
      login/                # (misma estructura)
      users/                # (misma estructura)
      products/             # (misma estructura) — CRUD con tabla + formulario
      account/              # (misma estructura)
    router.tsx              # rutas (públicas + protegidas)

  App.tsx                   # providers (React Query + Router)
  main.tsx                  # entrada + import de Bootstrap
```

### Patrón de página (controller / css / vista)

Cada página separa **lógica** de **presentación**, siguiendo la misma idea que el
patrón puerto/adaptador pero aplicada a la UI:

- **`controller/useXxxController.ts`** — estado, handlers y datos (hooks). Testeable
  sin renderizar.
- **`pages/XxxPage.tsx`** — solo la vista (JSX). Consume el controller.
- **`css/XxxPage.module.css`** — estilos propios con **CSS Modules** (scope
  automático: las clases no chocan entre páginas).
- **`index.ts`** — barrel que reexporta la página para imports limpios.

---

## Flujo de autenticación

1. `LoginPage` llama a `useAuth().login({ username, password })`.
2. El hook ejecuta el caso de uso `LoginUser` (React Query maneja loading/error).
3. `LoginUser` deriva una huella de la password con `PasswordHasher` (WebCrypto) y
   pide la sesión al puerto `AuthRepository`.
4. `ApiAuthRepository` hace `POST /login` y traduce la respuesta a `AuthSession`.
5. El hook guarda la sesión en `authStore` (Zustand) → se persiste el token.
6. `httpClient` inyecta `Authorization: Bearer <token>` en las siguientes peticiones.
7. `ProtectedRoute` deja pasar a las rutas privadas.

> **Nota de seguridad:** hashear la contraseña en el frontend **no** sustituye HTTPS
> ni la validación en el backend. El `PasswordHasher` está como ejemplo del patrón
> puerto/adaptador; en producción la autenticación real se valida en el servidor.

---

## Ejemplo de referencia: CRUD de productos

El módulo `products` es el ejemplo **completo** del patrón hexagonal: tiene las cinco
operaciones (listar, buscar, crear, actualizar, borrar) contra una API real
(DummyJSON). Úsalo como molde para tus propios módulos con escritura.

Su capa Application agrupa los casos de uso **por carpeta de acción** (útil cuando
hay varias operaciones):

```
modules/products/
  domain/
    Product.ts              # modelo + ProductDraft (datos para crear/editar)
    ProductRepository.ts    # puerto con las 5 operaciones
  application/
    SearchAll/SearchAllProducts.ts
    Find/FindProduct.ts
    Create/CreateProduct.ts
    Update/UpdateProduct.ts
    Delete/DeleteProduct.ts
  infrastructure/
    ApiProductRepository.ts # adaptador: GET/POST/PUT/DELETE + mapper
  index.ts                  # composition root
```

El flujo de una escritura (crear):

1. `ProductsPage` envía el formulario → `useProductsController` llama a `createProduct`.
2. El hook `useProducts` ejecuta una **mutation** de React Query sobre el caso de uso
   `CreateProduct`.
3. `CreateProduct` delega en el puerto `ProductRepository.create()`.
4. `ApiProductRepository` hace `POST /products/add` y mapea la respuesta a `Product`.
5. Al terminar, la mutation **invalida la cache** de `['products']` → la tabla se
   recarga sola con el dato nuevo.

> **Sobre el verbo HTTP:** solo el adaptador sabe que `create` es un `POST`, `update`
> un `PUT` y `remove` un `DELETE`. El caso de uso y la UI hablan en términos de negocio
> (crear/actualizar/borrar), no de HTTP.

---

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run build      # typecheck (tsc) + build de producción
npm run preview    # servir el build
npm test           # ejecutar los tests (Vitest)
npm run test:watch # tests en modo watch
```

### Credenciales de demo

El login apunta a [DummyJSON](https://dummyjson.com/docs/auth) (API de prueba, sin key):

```
usuario:    emilys
contraseña: emilyspass
```

---

## Variables de entorno

Las URLs de las APIs viven en variables de entorno (Vite expone solo las que
empiezan con `VITE_`). Se leen en [`apiConfig.ts`](src/shared/config/apiConfig.ts)
vía `import.meta.env`, con un fallback por si falta el `.env`.

| Archivo | Uso | ¿Se commitea? |
|---|---|---|
| `.env` | Valores por defecto de desarrollo | ✅ Sí |
| `.env.example` | Plantilla a copiar | ✅ Sí |
| `.env.local` | Secretos / sobrescrituras locales | ❌ No (en `.gitignore`) |

```bash
VITE_API_USERS_URL=https://jsonplaceholder.typicode.com
VITE_API_AUTH_URL=https://dummyjson.com/auth
```

Los tipos están declarados en [`src/vite-env.d.ts`](src/vite-env.d.ts) para
autocompletado y errores si se usa una variable inexistente.

---

## Tests

Los tests usan **Vitest** y se ubican junto al código (`*.test.ts`). Demuestran el
valor de la arquitectura: como los casos de uso dependen de **puertos** (interfaces),
se prueban inyectando dobles falsos — **sin red, sin API, sin DOM**.

```bash
npm test
```

Cubren:

- **`SearchAllUsers`** — caso de uso con un `UserRepository` falso.
- **`JsonPlaceholderUserRepository`** — el adaptador, con un `HttpClient` falso
  (verifica el mapeo JSON externo → dominio y los valores por defecto).
- **`LoginUser`** — caso de uso con `AuthRepository` y `PasswordHasher` falsos
  (verifica que el hasher se invoca y que los errores se propagan).
- **`CreateProduct`** — caso de uso de escritura con `ProductRepository` falso
  (verifica que el draft se pasa al repositorio y que los errores se propagan).

> Ejemplo del patrón: el test inyecta `{ search: vi.fn().mockResolvedValue(...) }`
> como repositorio. El caso de uso no nota la diferencia con el real — esa es la
> ventaja de depender de la interfaz y no de la implementación.

---

## Cómo añadir un módulo nuevo

1. Crea `src/modules/<nombre>/` con las carpetas `domain/`, `application/`, `infrastructure/`.
2. **Domain:** define el modelo y el puerto (interface del repositorio).
3. **Application:** crea los casos de uso (una clase por acción).
4. **Infrastructure:** implementa el puerto contra tu API (con el `httpClient`).
5. **`index.ts`:** arma el composition root y expón los casos de uso.
6. Registra la instancia en `app/modules.ts` y crea un hook en `app/hooks/`.
7. Conéctalo a una página (ver abajo) y a una ruta en `ui/router.tsx`.

## Cómo añadir una página nueva

1. Crea `src/ui/pages/<nombre>/` con las subcarpetas `controller/`, `css/`, `pages/`.
2. **`controller/use<Nombre>Controller.ts`** — la lógica (estado, handlers, hooks de datos).
3. **`pages/<Nombre>Page.tsx`** — la vista; consume el controller y los estilos.
4. **`css/<Nombre>Page.module.css`** — estilos con scope.
5. **`index.ts`** — `export { <Nombre>Page } from './pages/<Nombre>Page';`.
6. Añade la ruta en `ui/router.tsx` (pública, o dentro de `ProtectedRoute` si es privada).

---

## Cuándo usar (y cuándo no) esta arquitectura

✅ **Buena** para apps con lógica de negocio real, varios orígenes de datos, equipos
grandes o necesidad de tests aislados.

⚠️ **Excesiva** para CRUDs simples o prototipos: genera bastante boilerplate (un caso
de uso = varios archivos). Para algo pequeño, un `api.ts` + un hook basta.
