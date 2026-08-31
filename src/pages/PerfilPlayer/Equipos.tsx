import PlaceholderTabPlayer from "./components/PlaceholderTabPlayer";

const Equipos = () => (
  <PlaceholderTabPlayer
    titulo="Equipos"
    descripcion="Acá vas a poder ver y gestionar los equipos de los que formás parte."
    icono={<img src={`${import.meta.env.BASE_URL}assets/icons/equipos-dashboard.svg`} alt="" />}
  />
);

export default Equipos;