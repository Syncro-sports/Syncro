# Contexto de sesión — Syncro (para retomar con otro agente de IA)

> Generado automáticamente al cierre de una sesión de trabajo con Claude. Leé esto de punta a punta antes de tocar código: contiene decisiones, contenido de negocio verificado y trabajo sin commitear que no está en ningún otro lado.

## 1. Quién es el usuario y el proyecto

- Usuaria: **Vanessa Arévalo** (arevalo), Project Manager de **Syncro**, plataforma de reserva/organización de partidos de fútbol amateur (complejos + jugadores + equipos). Mail: vanessaarevalo01@gmail.com.
- Nombre original del proyecto: **"Matchup"** — se renombró a **"Syncro"** por disponibilidad de marca en el rubro tech.
- Repo activo (donde se hicieron TODOS los cambios de esta sesión): `Test de ramas/develop/Syncro` (rama `develop`, git real, remoto `origin`). **No confundir** con `Syncro demo/syncro` (otra carpeta hermana con `frontend`/`backend` que NO fue tocada esta sesión) ni con `Matchup/propuestas` (mockups sueltos) ni `Matchup/documentacion` (PDFs/MD de referencia).
- Stack: React + TypeScript + Vite (frontend). Backend real en Node.js/Express (mencionado, no editado en esta sesión).
- Estado del proyecto: "En construcción". Mercado inicial: Argentina. Equipo separado en Frontend/Backend.
- Dirección futura declarada: la metodología (reservar, dividir pago, no cancelar, competir, progresar) es agnóstica al deporte — la idea es expandir más allá del fútbol a futuro.

## 2. Design system real (ya confirmado, no inventar otro)

Fuente: `src/index.css` del repo.

- Tipografías: `--font-title: "Exo 2"`, `--font-body: "IBM Plex Sans"`.
- Verde de marca: `--color-green: #A7E61D` (siempre en mayúsculas hex sin `#` si es para pptxgenjs).
- Tema oscuro: `--color-bg: #05070B`, `--color-bg-secondary: #101317`, `--color-border: #23272E`, `--color-text: #FFFFFF`, `--color-text-secondary: #9AA0AA`.
- Logo real: `public/assets/logo.svg` (relleno verde `#a7e61d`) y `public/assets/logo-white.svg` (relleno blanco). Un único isotipo circular tipo estadio/pelota, sin wordmark incorporado.
- Convención de íconos de nav: SVGs en `public/assets/icons/`, forzados a `height: 1.35rem; width: auto` por CSS en los headers. Hay inconsistencia real en el repo entre íconos `fill="none"` (contorno blanco vía stroke) e íconos con relleno verde hardcodeado (`fill="#A7E61D"`) — ambos estilos conviven, no es un bug a "corregir" salvo que se pida.

## 2.1. Backend real (verificado, con endpoints reales probados)

- **Backend desplegado y realmente en uso**: `https://syncro-back.onrender.com/api` (viene de `Test de ramas/develop/Syncro/.env`, variable `VITE_API_URL`). Esta es la fuente de verdad para saber qué datos existen de verdad — se puede consultar directo con `curl` para verificar campos antes de asumir nada.
- **Ojo con la copia local del backend en `Syncro demo/syncro/backend`**: existe en esta máquina pero está **sin implementar** — `models/Equipo.ts` y `models/Cancha.ts` son `export interface X {}` vacíos, y los controllers son placeholders (`res.send("Not implemented")`). No sirve como fuente de verdad, es solo un scaffold viejo/abandonado. La fuente real es el backend desplegado en Render.
- **Contrato real confirmado de `GET /api/equipos`** (probado con curl en esta sesión):
  ```json
  {
    "equipos": [
      { "id": "...", "nombre": "Aston Birra FC", "fotoPerfil": "", "descripcion": "...",
        "puntos": 1420, "ubicacion": "Olivos", "sexo": "MASCULINO", "nivel": "A",
        "cupoMaximo": 12, "jugadoresCant": 4, "creadorId": "...", "creadoEn": "..." }
    ],
    "total": 2, "pagina": 1, "limite": 9, "totalPaginas": 1
  }
  ```
  - Campos reales de un equipo: `nombre`, `fotoPerfil`, `descripcion`, `puntos`, `ubicacion`, `sexo`, `nivel`, `cupoMaximo`, `jugadoresCant`, `creadorId`, `creadoEn`. **No existe `tipo` ni `superficie`** en ningún lado de la respuesta — esos dos son atributos de cancha, no de equipo.
  - `nivel` (valores vistos: "A", "B") **es un campo real del backend**, no algo inventado por el mock del frontend — confirmado explícitamente porque la usuaria pidió verificarlo antes de asumir. El backend además soporta filtrado server-side: `GET /api/equipos?nivel=A` devuelve solo los que matchean.
  - El campo se llama `sexo` (no "género") y `cupoMaximo` (no "jugadoresCap" como lo renombra `equiposData.ts`/`equipoDetalleData.ts` del frontend) — el mock del frontend usa nombres distintos a los que manda el backend real.
- **Lección para this-and-future work**: antes de decidir qué es "un dato real" de una entidad, no alcanza con mirar el mock del frontend (`equiposData.ts`, `canchasData.ts`, etc.) — hay que confirmar contra el backend desplegado con una consulta real, porque el mock puede tener campos copiados/mal adaptados de otra entidad (ver caso "Tipos"/"Superficies" en el filtro de Equipos, sección 6).

## 3. Contenido real de negocio (fuente de verdad — NO inventar cifras ni features)

Extraído de `C:\Users\Cate\Downloads\Syncro_Documento_Institucional_v3_redisenado.pdf` (documento institucional oficial, 13 páginas) y cruzado con el código ya construido.

**Regla dura que la usuaria pidió explícitamente**: nunca fabricar cifras de cara a inversores/jurado (tamaño de mercado, monto de inversión pedido, métricas de tracción/usuarios, bios del equipo). Si hace falta un número así, dejarlo como placeholder explícito para que ella lo complete con datos reales.

### El diferencial central — "El corazón de Syncro"
Si un partido confirmado pierde al equipo rival (canceló tarde o no completó el pago), Syncro no cancela: reacciona automáticamente.
- **Camino A**: reabre el matchmaking y ofrece el cruce a otro equipo de nivel similar; el depósito ya retenido hace atractiva la oferta; el equipo nuevo paga el precio completo; el beneficio económico queda para el equipo que quedó plantado.
- **Camino B**: si nadie completa el pago dentro de 12hs, el partido se cancela y cada jugador recibe su parte como **crédito dentro de la plataforma** (no es cash, no vence, no es transferible, solo sirve para pagar futuros partidos).

### Mecánica de pago
- El organizador paga una **"seña"** (depósito, % exacto aún **"en definición"** — no inventar el número) para crear el partido.
- Desde ahí el pago se comparte/anticipa entre todos los jugadores; cada uno paga su parte por la app antes de jugar.
- Cancelación gratuita hasta 12hs antes del inicio.

### Partidos abiertos
Un jugador solo puede aplicar a un partido abierto; el capitán (o quien tenga permiso) aprueba/rechaza desde una lista de postulantes.

### Dos modos de partido
- **Amistoso**: sin resultado oficial, no afecta ranking, baja la barrera de entrada.
- **Competitivo**: afecta el ranking del equipo, requiere cancha+horario habilitado por el host, el host debe estar disponible para validar resultados en disputa.

### Progresión (3 tracks paralelos)
- **Puntos**: por equipo, solo en partidos competitivos, ganar suma / perder resta.
- **Experiencia/XP**: por jugador, en todos los partidos sin importar modo o resultado.
- **Rango**: nivel resultante que alimenta el matchmaking para emparejar parejo.
- Un jugador puede pertenecer hasta a **3 equipos simultáneos**, con puntaje independiente por equipo.

### Perfil de jugador (capacidades)
Organizar partidos, buscar rival por matchmaking, elegir amistoso/competitivo, sumarse a partidos abiertos vía postulación, pagar su parte, ver deuda propia/del equipo, historial de partidos/stats (victorias/derrotas/goles), equipos (actuales + pasados, hasta 3 simultáneos), reservas activas/próximas, XP/nivel/ranking, saldo de créditos, perfil/configuración. Verificación de identidad por número de teléfono al registrarse. Recordatorio post-partido competitivo para cargar/confirmar resultado.

### Panel de Host/complejo (capacidades)
Dashboard general de ingresos/reservas, ocupación de canchas por turno, gestión de precios por cancha/día-noche, toggle de "modo competitivo" por cancha/horario, staff interno con permisos por rol, integración de Google Reviews dentro del panel, resolución de disputas de resultados, configuración general del complejo.

### Perfiles de equipo
Identidad pública con escudo/nombre/descripción/historial de partidos/puntaje/plantel. Se ingresa por postulación + aprobación del capitán (postularse no garantiza entrar). El puntaje del equipo solo se mueve con partidos competitivos y alimenta el ranking/matchmaking.

## 4. Decisiones técnicas / advertencias activas (aplican a trabajo futuro)

- **Seguridad de pagos**: el monto a cobrar NUNCA debe calcularse ni confiarse desde el frontend — es spoofeable vía devtools. El backend debe recalcular/validar el monto server-side usando solo identificadores confiables (ej. `partidoId`), nunca un campo `precio` que mande el cliente. Esto quedó **solo como advertencia/pendiente de aplicar**, no se tocó el flujo de `/pagos/preferencia` todavía — falta decidir si es "solo documentar" o "cambiar ya el frontend".
- **Propuesta de esquema Mongo (pendiente, no confirmada ni escrita en el doc de pendientes todavía)**:
  - Referenciar (no embeber) `partidos` desde `canchas` — anti-patrón de array sin límite en Mongo.
  - Congelar/snapshotear los campos de precio dentro del documento `partido` en el momento de creación, independientemente de si se embebe o referencia.
  - Usar un único campo canónico `entradaJugador` (no `senia` + `entradaJugadorBase` por separado) porque son conceptual y matemáticamente lo mismo.

## 5. Trabajo de esta sesión — pitch/guion (ya entregado, no requiere archivo)

- Se armó y luego **se canceló** un deck PPTX de 8 slides (pptxgenjs) para pitch a inversores. La usuaria dijo *"olvidalo, no me prepares pptx, nos acaban de decir que sin eso, solo dame tipo guion"*.
- Se entregó en su lugar un **guion hablado de ~3 minutos** (texto plano en el chat, no archivo), con la estructura: gancho → problema → solución/ecosistema → "el corazón de Syncro" (diferencial) → producto ya construido → progresión/enganche → cierre y pedido (con placeholder explícito para el ask real, sin inventar cifra).
- Los scripts de generación de assets (`make_assets.js`, `build_deck.js`) quedaron en el scratchpad de la sesión anterior (`.../scratchpad/pitch/`), **no en el repo**, y están obsoletos/no se deben reutilizar salvo que se pida un deck visual de nuevo.

## 6. Cambios de código de ESTA sesión, en el repo `Test de ramas/develop/Syncro` (sin commitear)

Confirmado con `git status` — rama `develop`, todo en working directory, nada pusheado.

### Cambios de navbar (hechos en esta sesión, en orden):
1. **`src/components/HeaderHost.tsx`** (navbar del Host):
   - "VALORACIÓN" apuntaba a `/valoracion` (ruta inexistente, link roto) → corregido a `/perfil-host/valoraciones` (ruta real).
   - Se eliminó el link "TORNEOS".
   - Se agregó un nuevo link "SYNCRO" → `/sobre-syncro`, ícono `public/assets/icons/help-verde.svg`.
2. **`src/pages/CentroDeAyuda/centroAyudaData.ts`**: se eliminó la categoría completa "Torneos" (id `torneos`, con su FAQ `tor-1`).
3. **Limpieza de referencias rotas a Torneos**:
   - `src/App.tsx`: se sacó el `import Torneos` y la `<Route path="/torneos" .../>` (había quedado huérfana, sin ningún link apuntándole).
   - Se borró la carpeta `src/pages/Torneos/` completa (era un stub: `return <div>Torneos</div>`).
   - Se verificó con `npx tsc --noEmit` que no queda ninguna referencia rota (las menciones de "torneo" que sí quedan en el código — contador de torneos jugados en tarjetas de equipo, ícono `torneos.svg` en `EquipoDetalle`/`EquipoCard`, nombres de reservas mock tipo "Torneo Amateur" — son contenido legítimo, no links rotos).
4. **`src/components/Header.tsx`** (navbar de invitado/guest) y **`src/components/HeaderPlayer.tsx`** (navbar de jugador): se agregó el mismo link "SYNCRO" → `/sobre-syncro` con el mismo ícono, para que los 3 navbars (guest, player, host) queden consistentes.
5. **Ícono nuevo creado**: `public/assets/icons/help-verde.svg` — es una copia de `help.svg` (círculo con "?", estilo ya existente en el repo) pero con los tres `fill` cambiados a `#A7E61D` (verde de marca), porque el pedido fue "el ícono verde". El label del link se acortó de "SOBRE SYNCRO" a **"SYNCRO"** para mantener el mismo largo visual que PARTIDOS/EQUIPOS/CANCHAS/VALORACIÓN (todas una sola palabra).
   - **Archivo sin trackear en git todavía** (`public/assets/icons/help-verde.svg` aparece como "Untracked" en `git status`) — falta `git add` si se va a commitear.

### Otros cambios en el working directory que NO son de esta sesión de navbar (de una sesión anterior, también sin commitear, verificados con tsc y probados en navegador según el historial):
- `src/components/Footer.tsx`
- `src/components/UserMenuPlayer.tsx`
- `src/pages/PerfilHost/components/Topbar.tsx`
- `src/pages/Partidos/components/FiltrosSidebar.tsx` / `.css`
- `src/pages/Partidos/components/PartidoCard.tsx` / `.css`
- `src/pages/Partidos/components/PartidoDetalleModal.tsx`
- `src/pages/Canchas/canchasData.ts`
- `src/pages/Canchas/Canchas.tsx`
- `src/pages/Canchas/components/FiltrosCanchasSidebar.tsx` / `.css`

Ninguno de estos dos bloques de cambios fue commiteado ni pusheado. No se ejecutó ningún comando `git add`/`git commit` en toda la sesión.

## 6.1. Encabezados de listado (Partidos / Canchas / Equipos) — hecho, aprobado y probado

Pedido explícito: "colocar el título a la izquierda y abajo el conteo, no centrado", siguiendo los maquetados ya existentes en `Matchup/propuestas/partidos-disponibles-rediseno/` y `Matchup/propuestas/canchas-disponibles-rediseno/`. Aplicado al mismo patrón en las 3 páginas de listado, sin tocar cards ni conexiones/fetch de datos:

- **`src/pages/Partidos/Partidos.tsx` / `.css`**: el hero pasó de centrado a flex `space-between` — título "Partidos Disponibles" a la izquierda (blanco, 1.6rem, peso 800, antes era verde y 2.5rem) con el conteo "Mostrando X partidos" debajo (el número en verde), botones "MIS PARTIDOS"/"CREAR PARTIDO" a la derecha y más chicos (el shrink de tamaño está scopeado a `.partidos-hero__actions .btn` para no afectar el componente `Button` global en otras páginas). El botón **"CREAR PARTIDO" ahora navega a `/canchas`** (pedido explícito posterior). El "Ordenar por" quedó solo, alineado a la derecha en `.partidos-content__top`.
- **`src/pages/Canchas/Canchas.tsx` / `.css`**: mismo patrón exacto — título "Canchas Disponibles" izquierda (blanco, 1.6rem, 800; antes verde 2.4rem/900), conteo "Mostrando los X complejos" debajo, "Ordenar por" a la derecha. Se eliminaron las clases CSS que quedaron sin uso (`canchas-content__count`, override de tamaño de título en el media query de 900px).
- **`src/pages/Equipos/Equipos.tsx` / `.css`**: mismo patrón exacto también — título "Equipos Disponibles" izquierda, conteo "Mostrando los X equipos" debajo, mismas clases nuevas `equipos-hero__left`/`equipos-hero__count`, mismo cleanup de CSS viejo.
- Las 3 quedaron visualmente verificadas en navegador (`npm run dev` en el repo, puerto que asigne Vite — 5173 estaba ocupado, terminó usando 5174) y con `npx tsc --noEmit` limpio después de cada cambio.

## 6.2. Filtro de "Equipos" — bug de campos copiados de Canchas, propuesta en maquetado (PENDIENTE DE APROBACIÓN, no tocar la página real todavía)

Hallazgo: `src/pages/Equipos/components/FiltrosEquiposSidebar.tsx` (y su tipo `FiltrosEquipos`/`equiposData.ts`) filtra por **"Tipos"** (FUTBOL 5/7/8/9/11) y **"Superficies"** (Sintético/Natural/Cemento) — son atributos de **cancha**, no de **equipo**, copiados sin adaptar del filtro de Canchas. Confirmado contra el backend real (ver sección 2.1): un equipo NUNCA trae `tipo` ni `superficie`.

Se armó una propuesta de reemplazo, **solo como maquetado HTML estático, sin tocar código real**, en `Matchup/propuestas/equipos-filtros-rediseno/index.html` (mismo criterio que los otros maquetados de la carpeta `propuestas/`: banner "PROPUESTA DE REDISEÑO" arriba, sin lógica real). Reemplaza los dos campos inventados por campos reales del backend:
- **Sexo** (campo real `sexo`, valores vistos "MASCULINO" — el enum sugiere que también admite FEMENINO/MIXTO).
- **Nivel** (campo real `nivel`, "A"/"B" confirmados) — se mantiene igual que ya estaba, porque **es real** (ver corrección en sección 2.1: se verificó explícitamente a pedido de la usuaria, no es un campo inventado como se pensó en un primer momento).
- **"Con lugares disponibles"** (toggle nuevo) — calculado con `jugadoresCant` vs `cupoMaximo`, mismo dato que ya se ve en la card actual ("7/15").
- **Ubicación** — ya era real (`ubicacion`), se mantiene con el mismo patrón de modal que usan Partidos/Canchas.

El archivo del maquetado tiene una caja de nota explicando exactamente qué cambia y por qué, con los nombres de campo reales citados. **Estado: enviado a la usuaria dos veces (versión inicial + versión corregida tras verificar `nivel` contra el backend), a la espera de su aprobación explícita antes de tocar `FiltrosEquiposSidebar.tsx`/`equiposData.ts` reales.**

## 7. Pendientes explícitos (no resueltos, no confirmados por la usuaria)

- Decidir si el fix de seguridad de pagos (backend recalcula el monto, frontend no manda `precio`) se aplica ya en el código o solo se documenta como pendiente.
- Sumar la propuesta de esquema Mongo (`canchas`/`partidos` referenciados, precio congelado al crear, campo único `entradaJugador`) al doc de pendientes: `Matchup/documentacion/Syncro_Pendientes.md`.
- Commitear/pushear los cambios sin trackear (navbar + headers de Partidos/Canchas/Equipos + el batch anterior de Footer/UserMenuPlayer/Partidos/Canchas). Nadie pidió el commit todavía — no hacerlo sin confirmación explícita.
- `help-verde.svg` está sin trackear en git — agregarlo al commit cuando se haga.
- **Prioridad inmediata**: esperar la aprobación de la usuaria sobre el maquetado `Matchup/propuestas/equipos-filtros-rediseno/index.html` (sección 6.2) y recién ahí aplicar el fix real en `src/pages/Equipos/components/FiltrosEquiposSidebar.tsx` + `equiposData.ts` (sacar `tipo`/`superficie`, sumar `sexo`/"con lugares disponibles", ajustar nombres de campo a los reales del backend `sexo`/`cupoMaximo`).
- Aplicar el mismo criterio de auditoría ("¿este filtro usa campos que el backend realmente devuelve?") a **Partidos** también — no se revisó en esta sesión, solo Canchas (ya corregido en sesión anterior) y Equipos (mockup en curso).

## 8. Cómo seguir

Si retomás este trabajo: leé este archivo primero, después corré `git status` y `git diff` en `Test de ramas/develop/Syncro` para ver el estado exacto del working tree, y priorizá lo de la sección 7. No agregues datos de negocio que no estén en la sección 3 — esa es la única fuente de verdad confirmada por la usuaria.
