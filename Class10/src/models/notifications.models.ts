import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../db/index.js";

interface NotificationAttributes {
  id: number;
  user_id: number;
  type: "loan_request" | "loan_due" | "loan_approved" | "loan_rejected" | "general";
  message: string;
  read: boolean;
  created_at?: Date;
}

type NotificationCreation = Optional<NotificationAttributes, "id" | "read" | "created_at">;

export class Notification extends Model<NotificationAttributes, NotificationCreation>
  implements NotificationAttributes {
  public id!: number;
  public user_id!: number;
  public type!: "loan_request" | "loan_due" | "loan_approved" | "loan_rejected" | "general";
  public message!: string;
  public read!: boolean;
  public created_at?: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("loan_request", "loan_due", "loan_approved", "loan_rejected", "general"),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: false, // usamos columna manual created_at
  }
);
