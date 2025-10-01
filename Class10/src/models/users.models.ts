import {  Model, type Optional } from "sequelize";
import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

interface UserAttributes {
    id: number;
    name: string;
    last_name: string;
    email: string;
    password_hash: string;
    phone?: string;
    address?: string;
    role: string;
    created_at?: Date;
    updated_at?: Date;
};

type UserCreation = Optional<UserAttributes, "id" | "created_at" | "updated_at">;

export class User extends Model< UserAttributes, UserCreation>
    implements UserAttributes {
    public id!: number;
    public name!: string;
    public last_name!: string;
    public email!: string;
    public password_hash!: string;
    public phone?: string;
    public address?: string;
    public role!: string;
    public created_at?: Date;
    public updated_at?: Date;
};

User.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        last_name:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password_hash:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        phone:{
            type: DataTypes.STRING(20)
        },
        address:{
            type: DataTypes.TEXT
        },
        role:{
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "user"
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
        tableName: "users",
        timestamps: false
    }
);