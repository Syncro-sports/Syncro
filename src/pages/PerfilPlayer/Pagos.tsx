import PlaceholderTabPlayer from "./components/PlaceholderTabPlayer";

const Pagos = () => (
  <PlaceholderTabPlayer
    titulo="Pagos"
    descripcion="Acá vas a poder ver y gestionar tus pagos y métodos de pago."
    icono={<img src={`${import.meta.env.BASE_URL}assets/icons/pagos-dashboard.svg`} alt="" />}
  />
);

export default Pagos;