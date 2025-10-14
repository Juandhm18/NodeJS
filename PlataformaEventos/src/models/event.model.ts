import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize.config";
import { User } from "./user.models";

interface EventAttributes {
  id: number;
  title: string;
  description?: string;
  date: Date;
  place: string;
  capacity: number;
  organizerId: number;
}

interface EventCreationAttributes extends Optional<EventAttributes, "id"> {}

export class Event extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public date!: Date;
  public place!: string;
  public capacity!: number;
  public organizerId!: number;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      field: "organizer_id", // nombre real de la columna en SQL
    },
  },
  {
    sequelize,
    modelName: "Event",
    tableName: "events",
    timestamps: false,
  }
);

// Relaciones
Event.belongsTo(User, { foreignKey: "organizerId", as: "organizer" });
User.hasMany(Event, { foreignKey: "organizerId", as: "events" });
