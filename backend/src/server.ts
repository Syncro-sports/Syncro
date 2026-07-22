import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import canchasRoutes from "./routes/canchas.routes";
import partidosRoutes from "./routes/partidos.routes";
import equiposRoutes from "./routes/equipos.routes";
import reservasRoutes from "./routes/reservas.routes";
import matchmakingRoutes from "./routes/matchmaking.routes";
import pagosRoutes from "./routes/pagos.routes";
import cajaRoutes from "./routes/caja.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/canchas", canchasRoutes);
app.use("/api/partidos", partidosRoutes);
app.use("/api/equipos", equiposRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/matchmaking", matchmakingRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/caja", cajaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
