import PlaceholderTabPlayer from "./components/PlaceholderTabPlayer";

const Historial = () => (
  <PlaceholderTabPlayer
    titulo="Historial"
    descripcion="Acá vas a poder ver el historial completo de tus partidos jugados."
    icono={<img src={`${import.meta.env.BASE_URL}assets/icons/historial-dashboard.svg`} alt="" />}
  />
);

export default Historial;