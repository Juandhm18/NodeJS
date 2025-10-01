import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../db/index.js";

/*CREATE TABLE plans (
    id SERIAL PRIMARY KEY,                     
    name VARCHAR(100) NOT NULL,                
    price NUMERIC(10,2) NOT NULL,              
    billing_period VARCHAR(20) NOT NULL,       
    max_books_per_month INT NOT NULL,          
    description TEXT,                          
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);*/

interface PlanAttributes {
  id: number;
  name:string;
  price:number;
  billing_period:string;
  max_books_per_month:number;
  description:string;
  created_at?: Date;
  updated_at?: Date;
};

type PlanCreation = Optional<PlanAttributes, "id" | "created_at" | "updated_at">;

export class Plan extends Model<PlanAttributes, PlanCreation>
  implements PlanAttributes {
    public id!: number;
    public name!: string;
    public price!: number;
    public billing_period!: string;
    public max_books_per_month!: number;
    public description!: string;
    public created_at?: Date;
    public updated_at?: Date;
};

Plan.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        price:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        billing_period:{
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        max_books_per_month:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at:{
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: DataTypes.NOW,
        },
        updated_at:{
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        sequelize,
        tableName: "plans",
        timestamps: false
    }
);