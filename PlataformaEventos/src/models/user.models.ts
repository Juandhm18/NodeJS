import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.config";

export class User extends Model{
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public rol!: "admin" | "organizador" | "Participante"
}

User.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM("admin", "organizador", "Participante"),
        defaultValue: "participante",
    },
},{
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: false,
});