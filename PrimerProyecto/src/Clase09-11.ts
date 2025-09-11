import promptSync from 'prompt-sync';
const prompt = promptSync();
/*### 1. Invertir una cadena
Crea una función que reciba un string y devuelva ese mismo string invertido.
 Ejemplo:
// Entrada: "typescript"
// Salida: "tpircsytpe"*/
function invertString(word: string) {
    let reverseWord = word.toLowerCase().split('').reverse().join('');
    return reverseWord;
}
const word = prompt("Type any word: ", "Example" ) ;
console.log(invertString(word));

/*### 2. Verificar paréntesis balanceados
Implementa una función que determine si una expresión matemática tiene los paréntesis correctamente balanceados.
ts
// Ejemplo:
// "(a+b)"  -> true
// "(a+b))" -> false*/

function verifyParenthesis(equation: string){
    let count: number = 0;
    for (let i = 0; i<equation.length; i++){
        if (equation[i] === '('){
            count++;
        }else if(equation[i] === ')'){
            count--;
            if (count<0){
                return false;
            }
        }
    }
    if (count === 0){
        return true;
    }else{
        return false;
    }
}
const equation = prompt("Please type any equation: ", "()");
console.log(verifyParenthesis(equation));

/*### 3. Cola de impresión
Simula una cola de impresión en la que llegan documentos y se imprimen en orden. Debes poder agregar, retirar y contar documentos.*/
class PrintQueue {
    private queue: string[] = [];
        enqueue(document: string): void {
            this.queue.push(document)
    }

    dequeue(): string | undefined {
        if (this.queue.length === 0){
            console.log("The queue is empty. ")
        }
        const documentsQueue = this.queue.shift();
        console.log("document errased ")
        return documentsQueue
    }

    size(): number {
        return this.queue.length;
    }
}

const documentsQueue = new PrintQueue();
documentsQueue.enqueue("Factura_001.pdf");
documentsQueue.enqueue("Reporte_Septiembre.docx");
documentsQueue.enqueue("Foto_Vacaciones.png");

console.log(documentsQueue);
documentsQueue.dequeue();
console.log(documentsQueue);
console.log(documentsQueue.size);

/*### 4. Primera letra no repetida
Dado un string, encuentra la primera letra que no se repite.
// Ejemplo:
// Entrada: "swiss"
// Salida: "w"*/

function firtsDupLetter(word: string){
    let letter: string | undefined;
    for (let i = 0; i < word.length; i++){
        let count: number = 0;
        letter = word[i]
        for (let j = i+1; j < word.length; j++){
            if (letter === word[j]){
                count++;
            }
        }
        if (count === 0){
            return letter;
        }
    }
}
const firstLetter: string = prompt("Please type any word: ", "swiss");
console.log(firtsDupLetter(firstLetter));

/*### 5. Eliminar duplicados de un arreglo
Escribe una función que elimine los duplicados de un arreglo.
// Entrada: [1, 2, 2, 3, 4, 4, 5]
// Salida: [1, 2, 3, 4, 5]*/

function dupNums(arr: number[]): number[] {
  const dupNums: number[] = [];

  for (const num of arr) {
    if (!dupNums.includes(num)) {
      dupNums.push(num);
    }
  }

  return dupNums;
}
const arrNum = [1, 2, 2, 3, 4, 4, 5];
const duplica = dupNums(arrNum) ;
console.log(duplica)