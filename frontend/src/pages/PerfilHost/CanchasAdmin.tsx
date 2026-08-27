import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  CANCHAS,
  Cancha,
  DeporteTipo,
  FormatoTipo,
  SuperficieTipo,
  EstadoCancha,
  DEPORTES_OPCIONES,
  FORMATOS_OPCIONES,
  SUPERFICIES_OPCIONES,
  ESTADOS_OPCIONES,
  IMAGENES_PRESET,
  calcularDescuentoLabel,
} from "./canchasData";
import { canchasService } from "../../services/canchasService";
import {
  AlertTriangleIcon,
  BallIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  EditIcon,
  EyeIcon,
  PlusIcon,
  RoofIcon,
  SearchIcon,
  StarIcon,
  TrashIcon,
  TrophyIcon,
} from "./components/icons";
import type { HostOutletContextType } from "./PerfilHost";
import "./CanchasAdmin.css";

const formatPrecio = (precio: number) => `$${precio.toLocaleString("es-AR")}`;

interface ToastInfo {
  message: string;
  type: "success" | "info" | "warning";
}

const CanchasAdmin = () => {
  const [canchas, setCanchas] = useState<Cancha[]>(CANCHAS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCanchas = async () => {
      try {
        setIsLoading(true);
        const data = await canchasService.getAll();
        if (isMounted) {
          setCanchas(data);
        }
      } catch (err) {
        console.error("Error al cargar canchas:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCanchas();
    return () => {
      isMounted = false;
    };
  }, []);

  const outletContext = useOutletContext<HostOutletContextType | null>();
  const [localSearch, setLocalSearch] = useState("");
  const search = outletContext?.search ?? localSearch;
  const setSearch = outletContext?.setSearch ?? setLocalSearch;

  const [deporteFiltro, setDeporteFiltro] = useState<string>("todos");
  const [superficieFiltro, setSuperficieFiltro] = useState<string>("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos");
  const [soloTechada, setSoloTechada] = useState(false);
  const [soloCompetitivo, setSoloCompetitivo] = useState(false);
  const [soloReplay, setSoloReplay] = useState(false);
  const [orden, setOrden] = useState<string>("default");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [canchaEnEdicion, setCanchaEnEdicion] = useState<Cancha | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [canchaDetalle, setCanchaDetalle] = useState<Cancha | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [canchaAEliminar, setCanchaAEliminar] = useState<Cancha | null>(null);

  const [toast, setToast] = useState<ToastInfo | null>(null);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const [formNombre, setFormNombre] = useState("");
  const [formDeporte, setFormDeporte] = useState<DeporteTipo>("Fútbol");
  const [formFormato, setFormFormato] = useState<FormatoTipo>("5 vs 5");
  const [formSuperficie, setFormSuperficie] = useState<SuperficieTipo>("Sintético");
  const [formEstado, setFormEstado] = useState<EstadoCancha>("activa");
  const [formEsTechada, setFormEsTechada] = useState(false);
  const [formEsCompetitiva, setFormEsCompetitiva] = useState(false);
  const [formEsIluminada, setFormEsIluminada] = useState(true);
  const [formReplay, setFormReplay] = useState(false);
  const [formPrecioOriginal, setFormPrecioOriginal] = useState<number>(25000);
  const [formPrecioDescuento, setFormPrecioDescuento] = useState<number>(20000);
  const [formPrecioNoche, setFormPrecioNoche] = useState<number>(28000);
  const [formSenia, setFormSenia] = useState<number>(8000);
  const [formImagen, setFormImagen] = useState<string>(IMAGENES_PRESET[0]);
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formError, setFormError] = useState("");

  const autoDescuento = useMemo(
    () => calcularDescuentoLabel(formPrecioOriginal, formPrecioDescuento),
    [formPrecioOriginal, formPrecioDescuento]
  );

  const stats = useMemo(() => {
    const total = canchas.length;
    const activas = canchas.filter((c) => c.estado === "activa").length;
    return { total, activas };
  }, [canchas]);

  const canchasFiltradas = useMemo(() => {
    return canchas
      .filter((c) => {
        const matchesSearch =
          c.nombre.toLowerCase().includes(search.toLowerCase()) ||
          c.deporte.toLowerCase().includes(search.toLowerCase()) ||
          c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

        const matchesDeporte = deporteFiltro === "todos" || c.deporte === deporteFiltro;
        const matchesSuperficie = superficieFiltro === "todos" || c.superficie === superficieFiltro;
        const matchesEstado = estadoFiltro === "todos" || c.estado === estadoFiltro;
        const matchesTechada = !soloTechada || c.esTechada;
        const matchesCompetitivo = !soloCompetitivo || c.esCompetitiva;
        const matchesReplay = !soloReplay || c.replay;

        return (
          matchesSearch &&
          matchesDeporte &&
          matchesSuperficie &&
          matchesEstado &&
          matchesTechada &&
          matchesCompetitivo &&
          matchesReplay
        );
      })
      .sort((a, b) => {
        if (orden === "price-asc") {
          return (a.precioDescuento || a.precioOriginal) - (b.precioDescuento || b.precioOriginal);
        }
        if (orden === "price-desc") {
          return (b.precioDescuento || b.precioOriginal) - (a.precioDescuento || a.precioOriginal);
        }
        if (orden === "rating") {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (orden === "nombre") {
          return a.nombre.localeCompare(b.nombre);
        }
        if (typeof a.id === "number" && typeof b.id === "number") {
          return a.id - b.id;
        }
        return String(a.id).localeCompare(String(b.id));
      });
  }, [
    canchas,
    search,
    deporteFiltro,
    superficieFiltro,
    estadoFiltro,
    soloTechada,
    soloCompetitivo,
    soloReplay,
    orden,
  ]);

  const handleOpenCreate = () => {
    setFormMode("create");
    setCanchaEnEdicion(null);
    setFormNombre(`Cancha ${canchas.length + 1}`);
    setFormDeporte("Fútbol");
    setFormFormato("5 vs 5");
    setFormSuperficie("Sintético");
    setFormEstado("activa");
    setFormEsTechada(false);
    setFormEsCompetitiva(false);
    setFormEsIluminada(true);
    setFormReplay(false);
    setFormPrecioOriginal(25000);
    setFormPrecioDescuento(20000);
    setFormPrecioNoche(28000);
    setFormSenia(8000);
    setFormImagen(IMAGENES_PRESET[canchas.length % IMAGENES_PRESET.length] || IMAGENES_PRESET[0]);
    setFormDescripcion("");
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cancha: Cancha) => {
    setFormMode("edit");
    setCanchaEnEdicion(cancha);
    setFormNombre(cancha.nombre);
    setFormDeporte(cancha.deporte || "Fútbol");
    setFormFormato(cancha.formato || "5 vs 5");
    setFormSuperficie(cancha.superficie || "Sintético");
    setFormEstado(cancha.estado || "activa");
    setFormEsTechada(Boolean(cancha.esTechada));
    setFormEsCompetitiva(Boolean(cancha.esCompetitiva));
    setFormEsIluminada(cancha.esIluminada ?? true);
    setFormReplay(Boolean(cancha.replay));
    setFormPrecioOriginal(cancha.precioOriginal || 25000);
    setFormPrecioDescuento(cancha.precioDescuento || 20000);
    setFormPrecioNoche(cancha.precioNoche || 28000);
    setFormSenia(cancha.senia || 8000);
    setFormImagen(cancha.imagen || IMAGENES_PRESET[0]);
    setFormDescripcion(cancha.descripcion || "");
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenDetail = (cancha: Cancha) => {
    setCanchaDetalle(cancha);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (cancha: Cancha) => {
    setCanchaAEliminar(cancha);
    setIsDeleteOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formNombre.trim()) {
      setFormError("El nombre de la cancha es obligatorio.");
      return;
    }

    if (formPrecioOriginal <= 0 || formPrecioDescuento <= 0) {
      setFormError("Los precios deben ser mayores a 0.");
      return;
    }

    const generatedTags: string[] = [
      `${formDeporte} ${formFormato.replace(" vs ", "v")}`,
      formSuperficie,
    ];
    if (formEsTechada) generatedTags.push("Techada");
    if (formEsCompetitiva) generatedTags.push("Competitiva");
    if (formReplay) generatedTags.push("Replay");
    generatedTags.push(`${(canchaEnEdicion?.rating || 4.8).toFixed(1)} ★`);

    const calculoPromo = calcularDescuentoLabel(Number(formPrecioOriginal), Number(formPrecioDescuento));

    try {
      if (formMode === "create") {
        const nuevaCanchaData: Omit<Cancha, "id"> = {
          nombre: formNombre.trim(),
          imagen: formImagen,
          deporte: formDeporte,
          formato: formFormato,
          superficie: formSuperficie,
          esTechada: formEsTechada,
          esCompetitiva: formEsCompetitiva,
          esIluminada: formEsIluminada,
          replay: formReplay,
          estado: formEstado,
          precioOriginal: Number(formPrecioOriginal),
          precioDescuento: Number(formPrecioDescuento),
          precioNoche: Number(formPrecioNoche),
          senia: Number(formSenia),
          descuentoLabel: calculoPromo,
          rating: 4.8,
          tags: generatedTags,
          descripcion: formDescripcion.trim(),
        };

        const creada = await canchasService.create(nuevaCanchaData);
        setCanchas((prev) => [...prev, creada]);
        showToast(`¡${creada.nombre} creada con éxito!`, "success");
      } else if (canchaEnEdicion) {
        const canchaActualizadaData: Partial<Cancha> = {
          nombre: formNombre.trim(),
          imagen: formImagen,
          deporte: formDeporte,
          formato: formFormato,
          superficie: formSuperficie,
          esTechada: formEsTechada,
          esCompetitiva: formEsCompetitiva,
          esIluminada: formEsIluminada,
          replay: formReplay,
          estado: formEstado,
          precioOriginal: Number(formPrecioOriginal),
          precioDescuento: Number(formPrecioDescuento),
          precioNoche: Number(formPrecioNoche),
          senia: Number(formSenia),
          descuentoLabel: calculoPromo,
          tags: generatedTags,
          descripcion: formDescripcion.trim(),
        };

        const actualizada = await canchasService.update(canchaEnEdicion.id, canchaActualizadaData);
        setCanchas((prev) =>
          prev.map((c) => (c.id === canchaEnEdicion.id ? actualizada : c))
        );
        showToast(`Cancha "${actualizada.nombre}" actualizada.`, "info");
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error al guardar cancha:", err);
      showToast("Hubo un error al guardar los cambios.", "warning");
    }
  };

  const handleConfirmDelete = async () => {
    if (!canchaAEliminar) return;
    try {
      await canchasService.delete(canchaAEliminar.id);
      setCanchas((prev) => prev.filter((c) => c.id !== canchaAEliminar.id));
      showToast(`Se eliminó la ${canchaAEliminar.nombre}.`, "warning");
    } catch (err) {
      console.error("Error al eliminar cancha:", err);
      showToast("No se pudo eliminar la cancha.", "warning");
    } finally {
      setIsDeleteOpen(false);
      setCanchaAEliminar(null);
    }
  };

  const handleQuickStatusChange = async (id: number | string, nuevoEstado: EstadoCancha) => {
    try {
      await canchasService.updateStatus(id, nuevoEstado);
      setCanchas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
      );
      const canchaMod = canchas.find((c) => c.id === id);
      showToast(`Estado de "${canchaMod?.nombre || "cancha"}" cambiado a ${nuevoEstado}.`, "info");
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      showToast("No se pudo actualizar el estado.", "warning");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setDeporteFiltro("todos");
    setSuperficieFiltro("todos");
    setEstadoFiltro("todos");
    setSoloTechada(false);
    setSoloCompetitivo(false);
    setSoloReplay(false);
    setOrden("default");
  };

  const hasActiveFilters =
    Boolean(search) ||
    deporteFiltro !== "todos" ||
    superficieFiltro !== "todos" ||
    estadoFiltro !== "todos" ||
    soloTechada ||
    soloCompetitivo ||
    soloReplay ||
    orden !== "default";

  return (
    <div className="host-canchas">
      {toast && (
        <div className="host-toast">
          <CheckIcon />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="host-canchas__header">
        <div className="host-canchas__title-wrap">
          <div className="host-canchas__title-row">
            <h1 className="host-canchas__title">Canchas</h1>
            <span className="host-canchas__count-badge">{canchas.length} registradas</span>
          </div>
          <p className="host-canchas__subtitle">
            Administrá las canchas de tu complejo, configurá tarifas, características y disponibilidad.
          </p>
        </div>

        <button type="button" className="host-canchas__btn-add" onClick={handleOpenCreate}>
          <PlusIcon />
          Añadir cancha
        </button>
      </div>

      <div className="host-canchas__stats">
        <div className="host-canchas-stat">
          <div className="host-canchas-stat__icon">
            <BallIcon />
          </div>
          <div className="host-canchas-stat__info">
            <span className="host-canchas-stat__label">Total Canchas</span>
            <strong className="host-canchas-stat__value">{stats.total}</strong>
          </div>
        </div>

        <div className="host-canchas-stat">
          <div className="host-canchas-stat__icon">
            <CheckIcon />
          </div>
          <div className="host-canchas-stat__info">
            <span className="host-canchas-stat__label">Canchas Activas</span>
            <strong className="host-canchas-stat__value">{stats.activas}</strong>
          </div>
        </div>
      </div>

      <div className="host-canchas__toolbar">
        <div className="host-canchas__search-row">
          <div className="host-canchas__select-group">
            <div className="host-select-wrapper">
              <select
                value={deporteFiltro}
                onChange={(e) => setDeporteFiltro(e.target.value)}
                aria-label="Filtrar por deporte"
              >
                <option value="todos">Todos los deportes</option>
                {DEPORTES_OPCIONES.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </div>

            <div className="host-select-wrapper">
              <select
                value={superficieFiltro}
                onChange={(e) => setSuperficieFiltro(e.target.value)}
                aria-label="Filtrar por superficie"
              >
                <option value="todos">Todas las superficies</option>
                {SUPERFICIES_OPCIONES.map((sup) => (
                  <option key={sup} value={sup}>
                    {sup}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </div>

            <div className="host-select-wrapper">
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                aria-label="Ordenar canchas"
              >
                <option value="default">Orden por defecto</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Valoradas</option>
                <option value="nombre">Nombre (A-Z)</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        <div className="host-canchas__chips-row">
          <div className="host-canchas__chips">
            <button
              type="button"
              className={`host-chip ${estadoFiltro === "todos" ? "is-active" : ""}`}
              onClick={() => setEstadoFiltro("todos")}
            >
              Todas ({canchas.length})
            </button>
            <button
              type="button"
              className={`host-chip ${estadoFiltro === "activa" ? "is-active" : ""}`}
              onClick={() => setEstadoFiltro(estadoFiltro === "activa" ? "todos" : "activa")}
            >
              Activas ({canchas.filter((c) => c.estado === "activa").length})
            </button>
            <button
              type="button"
              className={`host-chip ${estadoFiltro === "mantenimiento" ? "is-active" : ""}`}
              onClick={() =>
                setEstadoFiltro(estadoFiltro === "mantenimiento" ? "todos" : "mantenimiento")
              }
            >
              Mantenimiento ({canchas.filter((c) => c.estado === "mantenimiento").length})
            </button>
            <button
              type="button"
              className={`host-chip ${soloTechada ? "is-active" : ""}`}
              onClick={() => setSoloTechada(!soloTechada)}
            >
              <RoofIcon />
              Techadas
            </button>
            <button
              type="button"
              className={`host-chip ${soloCompetitivo ? "is-active" : ""}`}
              onClick={() => setSoloCompetitivo(!soloCompetitivo)}
            >
              <TrophyIcon />
              Competitiva
            </button>
            <button
              type="button"
              className={`host-chip ${soloReplay ? "is-active" : ""}`}
              onClick={() => setSoloReplay(!soloReplay)}
            >
              <CameraIcon />
              Con Replay
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="host-canchas__reset-filters"
              onClick={handleResetFilters}
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      <div className="host-canchas__grid">
        {canchasFiltradas.map((cancha) => {
          const isActiva = cancha.estado === "activa";
          const isMantenimiento = cancha.estado === "mantenimiento";

          return (
            <div
              className={`cancha-card ${!isActiva ? "cancha-card--inactive" : ""}`}
              key={cancha.id}
            >
              <div
                className="cancha-card__photo"
                style={{ backgroundImage: `url(${cancha.imagen})` }}
              >
                <div className="cancha-card__top-badges">
                  <span className="cancha-card__sport-badge">
                    {cancha.deporte} • {cancha.formato}
                  </span>
                  <span
                    className={`cancha-status-badge cancha-status-badge--${cancha.estado || "activa"}`}
                  >
                    {isActiva ? "Activa" : isMantenimiento ? "Mantenimiento" : "Inactiva"}
                  </span>
                </div>

                <div className="cancha-card__name-row">
                  <span className="cancha-card__name">{cancha.nombre}</span>
                  <span className="cancha-card__rating">
                    <StarIcon /> {cancha.rating || "4.8"}
                  </span>
                </div>
              </div>

              <div className="cancha-card__tags">
                {cancha.tags.map((tag) => (
                  <span
                    key={tag}
                    className={
                      tag.includes("Techada") || tag.includes("Replay") || tag.includes("Competitiva")
                        ? "tag-highlight"
                        : ""
                    }
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="cancha-card__price-row">
                <span className="cancha-card__price-original">
                  {formatPrecio(cancha.precioOriginal)}
                </span>
                <span className="cancha-card__price-note">Tarifa diurna base</span>
              </div>
              <div className="cancha-card__price-row cancha-card__price-row--final">
                <strong>{formatPrecio(cancha.precioDescuento || cancha.precioOriginal)}</strong>
                {Boolean(calcularDescuentoLabel(cancha.precioOriginal, cancha.precioDescuento) || cancha.descuentoLabel) && (
                  <span className="discount-pill">
                    {calcularDescuentoLabel(cancha.precioOriginal, cancha.precioDescuento) || cancha.descuentoLabel}
                  </span>
                )}
              </div>

              <div className="cancha-card__meta-row">
                <span>Noche: {formatPrecio(cancha.precioNoche || cancha.precioOriginal + 3000)}</span>
                <span>Seña mín: {formatPrecio(cancha.senia || 8000)}</span>
              </div>

              <div className="cancha-card__actions">
                <div className="cancha-card__btn-group">
                  <button
                    type="button"
                    className="cancha-action-btn"
                    onClick={() => handleOpenDetail(cancha)}
                    title="Ver detalle completo"
                  >
                    <EyeIcon />
                    Detalles
                  </button>

                  <button
                    type="button"
                    className="cancha-action-btn"
                    onClick={() => handleOpenEdit(cancha)}
                    title="Editar cancha"
                  >
                    <EditIcon />
                    Editar
                  </button>
                </div>

                <div className="cancha-card__btn-group">
                  <select
                    className="cancha-status-select"
                    value={cancha.estado || "activa"}
                    onChange={(e) =>
                      handleQuickStatusChange(cancha.id, e.target.value as EstadoCancha)
                    }
                    title="Cambiar estado rápido"
                  >
                    <option value="activa">Activa</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="inactiva">Inactiva</option>
                  </select>

                  <button
                    type="button"
                    className="cancha-action-btn cancha-action-btn--danger cancha-action-btn--icon-only"
                    onClick={() => handleOpenDelete(cancha)}
                    title="Eliminar cancha"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="cancha-card cancha-card--add"
          onClick={handleOpenCreate}
        >
          <div className="cancha-card--add-icon-wrap">
            <img src={`${import.meta.env.BASE_URL}assets/icons/balon-mas.svg`} alt="" />
          </div>
          <div>
            <strong>Añadir nueva cancha</strong>
            <p style={{ fontSize: "0.8rem", marginTop: "0.25rem", opacity: 0.7 }}>
              Configurá superficies, fotos y tarifas
            </p>
          </div>
        </button>

        {!isLoading && canchasFiltradas.length === 0 && (
          <div className="host-canchas__empty">
            <div className="host-canchas__empty-icon">
              <SearchIcon />
            </div>
            <h3>No se encontraron canchas</h3>
            <p>No hay canchas que coincidan con los filtros y término de búsqueda ingresado.</p>
            <button
              type="button"
              className="host-btn-secondary"
              onClick={handleResetFilters}
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="host-modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="host-modal" onClick={(e) => e.stopPropagation()}>
            <div className="host-modal__header">
              <h2>{formMode === "create" ? "Nueva Cancha" : `Editar: ${formNombre}`}</h2>
              <button
                type="button"
                className="host-modal__close"
                onClick={() => setIsFormOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="host-modal__body">
                {formError && (
                  <div
                    style={{
                      backgroundColor: "rgba(255, 82, 82, 0.15)",
                      border: "1px solid #ff5252",
                      color: "#ff5252",
                      borderRadius: "6px",
                      padding: "0.6rem 0.85rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    {formError}
                  </div>
                )}

                <div className="host-form-group">
                  <label htmlFor="cancha-nombre">
                    Nombre de la cancha <span className="req">*</span>
                  </label>
                  <input
                    id="cancha-nombre"
                    type="text"
                    className="host-form-input"
                    placeholder="Ej: Cancha 1 - Monumental"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="host-form-row--3">
                  <div className="host-form-group">
                    <label>
                      Deporte <span className="req">*</span>
                    </label>
                    <select
                      className="host-form-select"
                      value={formDeporte}
                      onChange={(e) => setFormDeporte(e.target.value as DeporteTipo)}
                    >
                      {DEPORTES_OPCIONES.map((dep) => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="host-form-group">
                    <label>
                      Formato <span className="req">*</span>
                    </label>
                    <select
                      className="host-form-select"
                      value={formFormato}
                      onChange={(e) => setFormFormato(e.target.value as FormatoTipo)}
                    >
                      {FORMATOS_OPCIONES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="host-form-group">
                    <label>
                      Superficie <span className="req">*</span>
                    </label>
                    <select
                      className="host-form-select"
                      value={formSuperficie}
                      onChange={(e) => setFormSuperficie(e.target.value as SuperficieTipo)}
                    >
                      {SUPERFICIES_OPCIONES.map((sup) => (
                        <option key={sup} value={sup}>
                          {sup}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="host-form-row">
                  <div className="host-form-group">
                    <label htmlFor="precio-dia">
                      Precio Día Base ($) <span className="req">*</span>
                    </label>
                    <input
                      id="precio-dia"
                      type="number"
                      className="host-form-input"
                      value={formPrecioOriginal}
                      onChange={(e) => setFormPrecioOriginal(Number(e.target.value))}
                      min="1000"
                      step="500"
                      required
                    />
                  </div>

                  <div className="host-form-group">
                    <label htmlFor="precio-promo">
                      Precio con Descuento ($) <span className="req">*</span>
                    </label>
                    <input
                      id="precio-promo"
                      type="number"
                      className="host-form-input"
                      value={formPrecioDescuento}
                      onChange={(e) => setFormPrecioDescuento(Number(e.target.value))}
                      min="1000"
                      step="500"
                      required
                    />
                  </div>
                </div>

                <div className="host-form-row--3">
                  <div className="host-form-group">
                    <label htmlFor="precio-noche">Precio Noche ($)</label>
                    <input
                      id="precio-noche"
                      type="number"
                      className="host-form-input"
                      value={formPrecioNoche}
                      onChange={(e) => setFormPrecioNoche(Number(e.target.value))}
                      min="1000"
                      step="500"
                    />
                  </div>

                  <div className="host-form-group">
                    <label htmlFor="senia">Seña Requerida ($)</label>
                    <input
                      id="senia"
                      type="number"
                      className="host-form-input"
                      value={formSenia}
                      onChange={(e) => setFormSenia(Number(e.target.value))}
                      min="0"
                      step="500"
                    />
                  </div>

                  <div className="host-form-group">
                    <label htmlFor="descuento-label">Etiqueta Promo (Automática)</label>
                    <input
                      id="descuento-label"
                      type="text"
                      className="host-form-input"
                      value={autoDescuento || "Sin descuento (0%)"}
                      disabled
                      readOnly
                      title="Se calcula automáticamente con la diferencia entre el precio base y con descuento"
                      style={{ opacity: 0.8, cursor: "default", backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                    />
                  </div>
                </div>

                <div className="host-form-group">
                  <label>Características e Instalaciones</label>
                  <div className="host-checkboxes-group">
                    <label className={`host-checkbox-card ${formEsTechada ? "is-checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={formEsTechada}
                        onChange={(e) => setFormEsTechada(e.target.checked)}
                      />
                      <span>Techada</span>
                    </label>

                    <label className={`host-checkbox-card ${formEsCompetitiva ? "is-checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={formEsCompetitiva}
                        onChange={(e) => setFormEsCompetitiva(e.target.checked)}
                      />
                      <span>Apta Competitivo</span>
                    </label>

                    <label className={`host-checkbox-card ${formEsIluminada ? "is-checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={formEsIluminada}
                        onChange={(e) => setFormEsIluminada(e.target.checked)}
                      />
                      <span>Iluminación LED</span>
                    </label>

                    <label className={`host-checkbox-card ${formReplay ? "is-checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={formReplay}
                        onChange={(e) => setFormReplay(e.target.checked)}
                      />
                      <span>Cámaras / Replay</span>
                    </label>
                  </div>
                </div>

                <div className="host-form-group">
                  <label>Estado operativo de la cancha</label>
                  <select
                    className="host-form-select"
                    value={formEstado}
                    onChange={(e) => setFormEstado(e.target.value as EstadoCancha)}
                  >
                    {ESTADOS_OPCIONES.map((est) => (
                      <option key={est.valor} value={est.valor}>
                        {est.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="host-form-group">
                  <label>Foto de portada</label>
                  <div className="host-image-presets">
                    {IMAGENES_PRESET.map((imgUrl, idx) => (
                      <div
                        key={imgUrl}
                        className={`host-image-preset-thumb ${formImagen === imgUrl ? "is-selected" : ""
                          }`}
                        style={{ backgroundImage: `url(${imgUrl})` }}
                        onClick={() => setFormImagen(imgUrl)}
                        title={`Foto predefinida ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <input
                    type="text"
                    className="host-form-input"
                    placeholder="O ingresá una URL de imagen personalizada..."
                    value={formImagen}
                    onChange={(e) => setFormImagen(e.target.value)}
                    style={{ marginTop: "0.4rem" }}
                  />
                </div>

                <div className="host-form-group">
                  <label htmlFor="descripcion">Descripción / Notas internas</label>
                  <textarea
                    id="descripcion"
                    className="host-form-textarea"
                    placeholder="Detalles sobre el césped, mantenimiento o características especiales..."
                    value={formDescripcion}
                    onChange={(e) => setFormDescripcion(e.target.value)}
                  />
                </div>
              </div>

              <div className="host-modal__footer">
                <button
                  type="button"
                  className="host-btn-secondary"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="host-btn-primary">
                  {formMode === "create" ? "Crear Cancha" : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailOpen && canchaDetalle && (
        <div className="host-modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="host-modal" onClick={(e) => e.stopPropagation()}>
            <div className="host-modal__header">
              <h2>{canchaDetalle.nombre}</h2>
              <button
                type="button"
                className="host-modal__close"
                onClick={() => setIsDetailOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="host-modal__body">
              <div
                className="host-detail-banner"
                style={{ backgroundImage: `url(${canchaDetalle.imagen})` }}
              >
                <div className="host-detail-banner__content">
                  <div>
                    <span className="cancha-card__sport-badge">
                      {canchaDetalle.deporte} • {canchaDetalle.formato}
                    </span>
                    <h3 style={{ color: "#fff", fontSize: "1.4rem", marginTop: "0.3rem" }}>
                      {canchaDetalle.nombre}
                    </h3>
                  </div>
                  <span
                    className={`cancha-status-badge cancha-status-badge--${canchaDetalle.estado || "activa"}`}
                  >
                    {canchaDetalle.estado === "activa"
                      ? "Activa"
                      : canchaDetalle.estado === "mantenimiento"
                        ? "En Mantenimiento"
                        : "Inactiva"}
                  </span>
                </div>
              </div>

              {canchaDetalle.descripcion && (
                <p style={{ color: "var(--host-text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  {canchaDetalle.descripcion}
                </p>
              )}

              <div className="host-detail-grid">
                <div className="host-detail-card">
                  <span className="host-detail-card__label">Superficie</span>
                  <span className="host-detail-card__value">{canchaDetalle.superficie}</span>
                </div>

                <div className="host-detail-card">
                  <span className="host-detail-card__label">Instalación</span>
                  <span className="host-detail-card__value">
                    {canchaDetalle.esTechada ? "Techada (Cubierta)" : "Al aire libre"}
                  </span>
                </div>

                <div className="host-detail-card">
                  <span className="host-detail-card__label">Modo de Juego</span>
                  <span className="host-detail-card__value">
                    {canchaDetalle.esCompetitiva ? "Apta para Torneos / Competitivo" : "Recreativa / Estándar"}
                  </span>
                </div>

                <div className="host-detail-card">
                  <span className="host-detail-card__label">Iluminación</span>
                  <span className="host-detail-card__value">
                    {canchaDetalle.esIluminada ? "LED Profesional" : "Estándar"}
                  </span>
                </div>

                <div className="host-detail-card">
                  <span className="host-detail-card__label">Sistema de Grabación</span>
                  <span className="host-detail-card__value">
                    {canchaDetalle.replay ? "Cámaras Replay Habilitadas" : "No disponible"}
                  </span>
                </div>

                <div className="host-detail-card">
                  <span className="host-detail-card__label">Tarifa Día (Con Promo)</span>
                  <span className="host-detail-card__value is-green">
                    {formatPrecio(canchaDetalle.precioDescuento || canchaDetalle.precioOriginal)}
                  </span>
                </div>

                <div className="host-detail-card">
                  <span className="host-detail-card__label">Tarifa Noche</span>
                  <span className="host-detail-card__value">
                    {formatPrecio(canchaDetalle.precioNoche || canchaDetalle.precioOriginal + 3000)}
                  </span>
                </div>

                <div className="host-detail-card">
                  <span className="host-detail-card__label">Seña Requerida</span>
                  <span className="host-detail-card__value">
                    {formatPrecio(canchaDetalle.senia || 8000)}
                  </span>
                </div>

                <div className="host-detail-card">
                  <span className="host-detail-card__label">Valoración promedio</span>
                  <span className="host-detail-card__value">
                    ⭐ {canchaDetalle.rating || "4.8"} / 5.0
                  </span>
                </div>
              </div>
            </div>

            <div className="host-modal__footer">
              <button
                type="button"
                className="host-btn-secondary"
                onClick={() => setIsDetailOpen(false)}
              >
                Cerrar
              </button>
              <button
                type="button"
                className="host-btn-primary"
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenEdit(canchaDetalle);
                }}
              >
                Editar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && canchaAEliminar && (
        <div className="host-modal-overlay" onClick={() => setIsDeleteOpen(false)}>
          <div className="host-modal host-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="host-modal__header">
              <h2>¿Eliminar cancha?</h2>
              <button
                type="button"
                className="host-modal__close"
                onClick={() => setIsDeleteOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="host-modal__body" style={{ textAlign: "center", alignItems: "center" }}>
              <AlertTriangleIcon />
              <p style={{ color: "var(--host-text)", fontSize: "1rem" }}>
                ¿Estás seguro de que querés eliminar <strong>"{canchaAEliminar.nombre}"</strong>?
              </p>
              <p style={{ color: "var(--host-text-secondary)", fontSize: "0.85rem" }}>
                Esta acción removerá la cancha del complejo y cancelará la visualización para nuevas reservas.
              </p>
            </div>

            <div className="host-modal__footer" style={{ justifyContent: "center" }}>
              <button
                type="button"
                className="host-btn-secondary"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="host-btn-danger"
                onClick={handleConfirmDelete}
              >
                Sí, eliminar cancha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanchasAdmin;
