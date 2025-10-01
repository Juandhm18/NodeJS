/*CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,                       
    user_id INT NOT NULL,                        
    plan_id INT NOT NULL,                        
    start_date DATE NOT NULL,                    
    end_date DATE,                               
    status VARCHAR(20) NOT NULL,                 
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    CONSTRAINT status_check CHECK (status IN ('active', 'expired', 'canceled'))
);*/

import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../db/index.js";

interface SubscriptionAttributes {
  id: number;
  user_id:number;
  plan_id:number;
  start_date: Date;
  end_date?: Date;
  status: string;
  created_at?: Date;
  updated_at?: Date;
};

type SubscriptionCreation = Optional<SubscriptionAttributes, "id" | "end_date" | "created_at" | "updated_at">;

export class Subscription extends Model<SubscriptionAttributes, SubscriptionCreation>
  implements SubscriptionAttributes {
    public id!: number;
    public user_id!: number;
    public plan_id!: number;
    public start_date!: Date;
    public end_date?: Date;
    public status!: string;
    public created_at?: Date;
    public updated_at?: Date;
};

Subscription.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        plan_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        start_date:{
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        end_date:{
            type: DataTypes.DATEONLY,
        },
        status:{
            type: DataTypes.STRING(20),
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
        tableName: "subscriptions",
        timestamps: false
    }
);