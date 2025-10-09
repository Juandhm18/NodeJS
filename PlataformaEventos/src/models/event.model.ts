import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.config";
import { User } from "./user.models";
import { date } from "zod";

export class Event extends Model{
    public id!: number;
    public title!: string;
    public description!: string;
    public date!: Date;
    public capacity!: number;
    public place!: string;
    public OrganizatorID!: number;
}

Event.init({
    id:{ 
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT
    },
    date:{
        type: DataTypes.DATE,
        allowNull: false 
    },
    place: {
        type: DataTypes.STRING,
        allowNull: false
    },
    OrganizatorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "usuarios",
            key: "id"
        }
    }
},{
    sequelize,
    modelName: "Event",
    tableName: "events",
    timestamps: false,
});

Event.belongsTo(User, { foreignKey: "OrganizatorID", as: "organizador"});
User.hasMany(Event, {foreignKey: "OrganizatorID", as: "eventos"});