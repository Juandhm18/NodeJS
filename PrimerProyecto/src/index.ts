let nombre:string = "Diego";
let nombre2:(string|number)[];
type myType = {
    nombre:string,
    apellido:string,
    edad:number,
    direccion:string,
    getNombre:(a:number)=>string
};

function filtrarPares<T>(arr: T[], condicion: (item: T) => boolean): T[] {
  return arr.filter(condicion);
}
const numeros = [1, 2, 3, 4, 5, 6];
const pares = filtrarPares(numeros, n => n % 2 === 0);

console.log(pares); // [2, 4, 6]

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

const completeRobot: Required<robot> = {
  head: "steel",
  arms: 2,
  legs: 2,
  body: "iron",
};

console.log(completeRobot);
console.log(halfRobot);
