import PlaceholderTab from "./components/PlaceholderTab";
import { GearIcon } from "./components/icons";

const Configuracion = () => (
  <PlaceholderTab
    titulo="Configuración"
    descripcion="Acá vas a poder configurar los datos de tu complejo, medios de pago y preferencias de la cuenta."
    icono={<GearIcon />}
  />
);

export default Configuracion;
