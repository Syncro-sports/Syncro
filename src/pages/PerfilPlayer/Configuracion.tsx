import PlaceholderTabPlayer from "./components/PlaceholderTabPlayer";

const Configuracion = () => (
  <PlaceholderTabPlayer
    titulo="Configuración"
    descripcion="Acá vas a poder editar tu perfil y tus preferencias de cuenta."
    icono={<img src={`${import.meta.env.BASE_URL}assets/icons/config-dashboard.svg`} alt="" />}
  />
);

export default Configuracion;