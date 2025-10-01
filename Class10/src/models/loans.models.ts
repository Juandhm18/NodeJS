/*CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    borrower_id INT NOT NULL,
    owner_id INT NOT NULL,
    loan_date DATE NOT NULL DEFAULT CURRENT_DATE,   
    return_date DATE NOT NULL,                      
    actual_return_date DATE,                        
    status VARCHAR(20) NOT NULL,                    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT fk_borrower FOREIGN KEY (borrower_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT status_check CHECK (status IN ('active', 'returned', 'late', 'canceled'))
);*/

import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../db/index.js";

interface LoanAttributes {
  id: number;
  book_id:number;
  borrower_id:number;
  owner_id:number;
  loan_date?: Date;
  return_date: Date;
  actual_return_date?: Date;
  status: string;
  created_at?: Date;
  updated_at?: Date;
};

type LoanCreation = Optional<LoanAttributes, "id" | "loan_date" | "actual_return_date" | "created_at" | "updated_at">;

export class Loan extends Model<LoanAttributes, LoanCreation>
  implements LoanAttributes {
    public id!: number;
    public book_id!: number;
    public borrower_id!: number;
    public owner_id!: number;
    public loan_date?: Date;
    public return_date!: Date;
    public actual_return_date?: Date;
    public status!: string;
    public created_at?: Date;
    public updated_at?: Date;
  };

Loan.init(
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
    borrower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loan_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actual_return_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM("active", "returned", "late", "canceled"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "loans",
    timestamps: false,
  }
);
