
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.config";
import { User } from "./user.models";
import { Event } from "./event.model";


export class Inscription extends Model{
    public id!: number;
    public estado!: "pendiente" | "confirmada" | "cancelada";
    public UserID!: number;
    public eventID!: number;
}

Inscription.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    estado: {
        type: DataTypes.ENUM("pendiente", "confirmada", "cancelada"),
        defaultValue: "pendiente",
    },
},{
    sequelize,
    modelName: "Inscription",
    tableName: "inscription",
    timestamps: false,
});

User.hasMany(Inscription,{
    foreignKey:"UserID"
});
Inscription.belongsTo(User, {
    foreignKey: "UserID"
});

Event.hasMany(Inscription,{
    foreignKey:"EventID"
});
Inscription.belongsTo(User, {
    foreignKey: "EventID"
});
