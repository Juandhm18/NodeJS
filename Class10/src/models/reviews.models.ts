import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../db/index.js";

interface ReviewAttributes {
  id: number;
  book_id: number;
  reviewer_id: number;
  rating: number;
  comment?: string;
  created_at?: Date;
}

type ReviewCreation = Optional<ReviewAttributes, "id" | "comment" | "created_at">;

export class Review extends Model<ReviewAttributes, ReviewCreation>
  implements ReviewAttributes {
  public id!: number;
  public book_id!: number;
  public reviewer_id!: number;
  public rating!: number;
  public comment?: string;
  public created_at?: Date;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5, 
      },
    },
    comment: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "reviews",
    timestamps: false, 
  }
);
