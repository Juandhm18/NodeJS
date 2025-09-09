//Utility types

import os = require("os");

/* Partial<Type>
Constructs a type with all properties of a Type and it sets to optional. This utility will return a type that represents all subsets of a given type.
*/

type robot = {
    head: string;
    arms?: number;
    legs?: number;
    body: string;
}

const halfRobot: Partial<robot> = {
    head: "red head",
    arms: 2,
};

/* Required<Type>
Constructs a type with all the properties of a Type and it sets to required. the opposite of Partial */

const completeRobot: Required<robot> = {
  head: "steel",
  arms: 2,
  legs: 2,
  body: "iron",
};
console.log(completeRobot);
console.log(halfRobot);