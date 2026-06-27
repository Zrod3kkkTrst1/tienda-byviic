# Tienda de Cosméticos

Tienda online con carrito, abonos y panel de administración oculto.
Stack: React + Vite, Supabase, Netlify.

---

## 1. Configuración rápida

### Variables de entorno

Copia `.env.example` y crea tu archivo `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus datos de Supabase:

| Variable | Dónde encontrarla |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → Project API keys → **anon / public** |

### Número de WhatsApp y PIN de admin

Abre `src/lib/constants.js` y edita:

```js
// Número de WhatsApp (formato internacional sin +)
// Panamá: 507 + el número de 8 dígitos
export const WHATSAPP_NUMERO = '50760000000'

// PIN para entrar al panel de administración
export const ADMIN_PIN = '1234'

// Nombre que aparece en el header de la tienda
export const NOMBRE_TIENDA = 'Mi Tienda de Cosméticos'
```

---

## 2. Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La tienda abre en `http://localhost:5173`

---

## 3. Cómo entrar al panel de administración

El panel **no tiene ningún enlace visible** para los clientes. Hay dos formas de acceder:

- **Toca el nombre de la tienda 5 veces seguidas** en el header (en menos de 2 segundos).
- En escritorio, también puedes abrir la URL con el fragmento `#/panel` y luego tocar el logo 5 veces.

Se abrirá una ventana pidiendo el PIN que configuraste en `constants.js`.

---

## 4. Despliegue en Netlify

### Opción A — Desde la interfaz web de Netlify

1. Sube el código a GitHub (un repositorio privado o público).
2. Ve a [netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Conecta con GitHub y selecciona el repositorio.
4. Netlify detecta automáticamente la configuración de `netlify.toml`. Solo confirma:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Antes de hacer el primer deploy, ve a **Site configuration → Environment variables** y agrega:
   - `VITE_SUPABASE_URL` → tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` → tu clave pública de Supabase
6. Haz clic en **Deploy site**. ¡Listo!

### Opción B — Con la CLI de Netlify

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set VITE_SUPABASE_URL "https://tu-proyecto.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "sb_publishable_..."
netlify deploy --prod
```

---

## 5. Tablas de Supabase necesarias

### `productos`

```sql
create table productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric not null,
  foto_url text,
  categoria text,
  por_encargo boolean default false,
  stock integer,
  activo boolean default true
);
```

### `pedidos`

```sql
create table pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_nombre text,
  cliente_tel text,
  items jsonb,
  total numeric,
  pagado_ahora numeric,
  saldo_pendiente numeric,
  metodo_pago text,
  estado text default 'nuevo',
  notas text,
  creado_en timestamptz default now()
);
```

**Permisos RLS recomendados:**

```sql
-- Leer productos activos (cualquier visitante)
create policy "leer_productos_activos"
on productos for select
using (activo = true);

-- Insertar pedidos (cualquier visitante puede crear un pedido)
create policy "insertar_pedidos"
on pedidos for insert
with check (true);

-- Todo para el rol authenticated (admin usa service role desde el panel)
create policy "admin_todo"
on productos for all
using (auth.role() = 'authenticated');
```

> **Nota**: El panel de administración usa la misma clave pública (`anon`). Para producción, considera mover las operaciones de escritura del admin a una Edge Function con la `service_role` key.

---

## 6. Integración Yappy (pendiente)

El botón de Yappy está preparado pero deshabilitado. Cuando tengas las credenciales:

1. Abre `src/components/Checkout.jsx`.
2. Busca el comentario `// TODO: integrar Botón de Pago Yappy`.
3. Sigue las instrucciones de la documentación oficial de Yappy para agregar su script CDN.
4. Crea una Supabase Edge Function para generar el token de pago de forma segura.

---

## Estructura del proyecto

```
src/
├── lib/
│   ├── supabase.js      ← cliente de Supabase
│   └── constants.js     ← WhatsApp, PIN, nombre de tienda ← EDITA AQUÍ
├── context/
│   └── CartContext.jsx  ← estado global del carrito
├── components/
│   ├── Navbar.jsx
│   ├── Catalog.jsx
│   ├── ProductCard.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   └── Admin/
│       ├── AdminLogin.jsx
│       ├── AdminPanel.jsx
│       └── ProductForm.jsx
├── styles/
│   └── globals.css      ← variables de color, tipografía
├── App.jsx
└── main.jsx
```
