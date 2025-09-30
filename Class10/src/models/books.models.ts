import { DataTypes, Model } from "sequelize";
import type { Optional } from 'sequelize';

interface BookAttributes {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  language?: string;
  cover_url?: string;
  description?: string;
  owner_id: number;
  status: "available" | "borrowed" | "inactive";
  created_at?: Date;
}

type BookCreationAttributes = Optional<BookAttributes, "id" | "created_at" | "status">;

class Book extends Model<BookAttributes, BookCreationAttributes>
  implements BookAttributes {
  public id!: number;
  public title!: string;
  public author!: string;
  public isbn?: string;
  public genre?: string;
  public language?: string;
  public cover_url?: string;
  public description?: string;
  public owner_id!: number;
  public status!: "available" | "borrowed" | "inactive";
  public created_at?: Date;
}

Book.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    isbn: DataTypes.STRING,
    genre: DataTypes.STRING,
    language: DataTypes.STRING,
    cover_url: DataTypes.STRING,
    description: DataTypes.TEXT,
    owner_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("available", "borrowed", "inactive"),
      defaultValue: "available",
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: "books",
    timestamps: false,
  }
);

export default Book;