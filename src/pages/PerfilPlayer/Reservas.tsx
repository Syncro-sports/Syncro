import PlaceholderTabPlayer from "./components/PlaceholderTabPlayer";

const Reservas = () => (
  <PlaceholderTabPlayer
    titulo="Reservas"
    descripcion="Acá vas a poder ver y gestionar tus próximas reservas de canchas."
    icono={<img src={`${import.meta.env.BASE_URL}assets/icons/reservas-dashboard.svg`} alt="" />}
  />
);

export default Reservas;