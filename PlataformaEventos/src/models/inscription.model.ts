import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.config";
import { User } from "./user.models";
import { Event } from "./event.model";

export class Inscription extends Model {
  public id!: number;
  public estado!: "pendiente" | "confirmada" | "cancelada";
  public UserID!: number;
  public EventID!: number;
}

Inscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "confirmada", "cancelada"),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    sequelize,
    modelName: "Inscription",
    tableName: "inscriptions",
    timestamps: false,
  }
);

// Relaciones
User.hasMany(Inscription, {
  foreignKey: "UserID",
  as: "inscripciones",
});

Inscription.belongsTo(User, {
  foreignKey: "UserID",
  as: "usuario",
});

Event.hasMany(Inscription, {
  foreignKey: "EventID",
  as: "inscripciones",
});

Inscription.belongsTo(Event, {
  foreignKey: "EventID",
  as: "evento",
});
  