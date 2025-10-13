import { sequelize } from "../config/database";
import { User } from "../models/user.model";
import { Warehouse } from "../models/warehouse.model";
import { Product } from "../models/product.model";
import bcrypt from "bcrypt";

(async () => {
  await sequelize.sync({ force: true });
  console.log("BD reiniciada");

  const password = await bcrypt.hash("admin123", 10);

  await User.bulkCreate([
    { username: "admin", password, role: "admin" },
    { username: "analyst", password, role: "analyst" },
  ]);

  await Warehouse.bulkCreate([
    { name: "Bodega Central", location: "Medellín" },
    { name: "Bodega Cali", location: "Cali" },
  ]);

  await Product.bulkCreate([
    { name: "Tornillos", code: "P001", stock: 200 },
    { name: "Tuercas", code: "P002", stock: 150 },
  ]);

  console.log("Seed completado");
  process.exit();
})();
