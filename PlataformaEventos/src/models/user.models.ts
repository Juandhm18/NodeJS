import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize.config";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  rol: "admin" | "organizador" | "participante";
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare rol: "admin" | "organizador" | "participante";
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM("admin", "organizador", "participante"),
      allowNull: false,
      defaultValue: "participante",
    },
  },
  {
    sequelize,
    modelName: "User", // <-- mejor mantenerlo igual que la clase
    tableName: "usuarios",
    timestamps: false,
  }
);
