import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../db/index.js";

interface BookAttributes {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  genre: string;
  language: string;
  cover_url?: string;
  description: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
  owner_id: number;
};

export type BookCreation = Optional<BookAttributes, "id" | "created_at" | "updated_at">;

export class Book extends Model<BookAttributes, BookCreation>
  implements BookAttributes {
  public id!: number;
  public title!: string;
  public author!: string;
  public isbn?: string;
  public genre!: string;
  public language!: string;
  public cover_url?: string;
  public description!: string;
  public status!: string;
  public created_at?: Date;
  public updated_at?: Date;
  public owner_id!: number;
};

Book.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        author:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isbn:{
            type: DataTypes.STRING(20)
        },
        genre:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        language:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        cover_url:{
            type: DataTypes.TEXT
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status:{
            type: DataTypes.ENUM('available', 'borrowed', 'inactive'),
            allowNull: false,
            defaultValue: 'available'
        },
        created_at:{
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: DataTypes.NOW
        },
        updated_at:{
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: DataTypes.NOW
        },
        owner_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "books",
        timestamps: false
    }
);