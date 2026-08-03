# Poner en marcha el panel de administración

El sitio sigue funcionando exactamente igual que antes aunque no hagas nada de esto (usa los datos fijos de `src/data`). Estos pasos son para activar el panel `/admin`: pedidos guardados, menú editable, zonas y horarios de delivery, contenido del sitio y estadísticas.

## 1. Crear el proyecto en Supabase

1. Andá a [supabase.com](https://supabase.com) y creá una cuenta gratis (o iniciá sesión).
2. Creá un proyecto nuevo (el plan gratuito alcanza de sobra para este negocio).
3. Esperá a que termine de aprovisionarse (1-2 minutos).

## 2. Cargar la base de datos

1. En el menú lateral del proyecto, andá a **SQL Editor** → **New query**.
2. Abrí el archivo `supabase/schema.sql` de este proyecto, copiá **todo** el contenido y pegalo ahí.
3. Ejecutá (**Run**). Esto crea las tablas, los permisos de seguridad, un bucket de Storage para las fotos del menú, y carga el menú y los datos del negocio que ya tenías como punto de partida (los vas a poder editar todos desde el panel después).

## 3. Conectar el sitio con tus credenciales

1. En Supabase, andá a **Project Settings** → **API**.
2. Copiá el **Project URL** y la **anon public key**.
3. En la carpeta del proyecto, hacé una copia del archivo `.env.example` y renombrala a `.env.local`.
4. Completá esos dos valores:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anon-publica
   ```
5. Instalá la dependencia nueva (Supabase) y corré el sitio:
   ```
   npm install
   npm run dev
   ```

## 4. Crear tu usuario de acceso al panel

El panel tiene un solo tipo de usuario: el dueño. No hay pantalla de registro pública a propósito.

1. En Supabase, andá a **Authentication** → **Users** → **Add user**.
2. Cargá tu email y una contraseña (marcá "Auto Confirm User" para no tener que verificar el email).
3. Con eso ya podés entrar en `tusitio.com/admin/login`.

## 5. Qué podés hacer desde cada pestaña

- **Pedidos**: aparecen solos apenas un cliente confirma un pedido (se sigue mandando por WhatsApp como siempre, y además queda guardado acá). Podés cambiar el estado: nuevo → preparando → en camino → entregado, o cancelar.
- **Menú**: crear/editar/borrar categorías y productos, cambiar precios y descripciones, subir fotos, y marcar un producto como "agotado" para que no se pueda pedir sin tener que borrarlo.
- **Delivery**: zonas de envío con su costo, y horarios de entrega. Lo que desactivés acá desaparece al instante de las opciones que ve el cliente en el carrito.
- **Contenido del sitio**: horarios, dirección, redes, teléfono y textos de la marca. Se reflejan en el sitio apenas guardás, sin tocar código ni redeployar.
- **Estadísticas**: ventas de hoy / 7 días / 30 días, pedidos por estado, y productos más pedidos.

## Notas

- Si en algún momento no configurás Supabase (o se cae la conexión), el sitio público sigue mostrando el menú y los datos de contacto tal como estaban en el código — nunca se rompe.
- Las fotos del menú se suben a un bucket de Storage público llamado `menu-images`, creado automáticamente por `schema.sql`.
- Podés agregar más de un usuario admin repitiendo el paso 4 si en el futuro sumás empleados, aunque hoy todos entran con el mismo nivel de acceso (no hay permisos diferenciados).
