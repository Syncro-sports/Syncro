import PlaceholderTab from "./components/PlaceholderTab";

const Staff = () => (
  <PlaceholderTab
    titulo="Staff"
    descripcion="Acá vas a poder gestionar a las personas que administran tu complejo junto a vos."
    icono={<img src={`${import.meta.env.BASE_URL}assets/icons/equipos.svg`} alt="" />}
  />
);

export default Staff;
