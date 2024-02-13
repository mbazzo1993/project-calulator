/** GLOBAL VARIABLES */
let x = '0';
let y = '0';
let op = '';
const mathOpsArr = ['/','x','-','+'];
let xIsDefined = false;

const smallDispDiv = document.querySelector('#display-small');
const bigDispDiv = document.querySelector('#display-big');
const buttonsDiv = document.querySelector('#buttons');

/** ADD EVENT LISTENERS */

buttonsDiv.addEventListener('click',buttonClickHandler);

/** NAMED FUNCTIONS FOR CALCULATOR */
/**
 * Adds two numbers
 * @param {Number} x 
 * @param {Number} y 
 * @returns {Number}
 */
function add(x,y) {
    return x + y;
}

/**
 * Subtracts second number from first
 * @param {Number} x 
 * @param {Number} y 
 * @returns {Number}
 */
function subtract(x,y) {
    return add(x,-y);
}

/**
 * Multiply two numbers
 * @param {Number} x 
 * @param {Number} y 
 * @returns {Number}
 */
function mutiply(x,y) {
    return x * y;
}

/**
 * Divide first number by second
 * @param {Number} x 
 * @param {Number} y 
 * @returns {Number}
 */
function divide(x,y) {
    return y === 0 ? undefined : x / y;
}

/**
 * Operate on user-provided inputs
 * @param {Number} x 
 * @param {String} op 
 * @param {Number} y 
 * @returns {Number} (result of the operation)
 */
function operate(x,op,y) {

    switch (op) {
        case "+":
            return add(x,y);
            break;
        case "-":
            return subtract(x,y);
            break;
        case "x":
            return mutiply(x,y);
            break;
        case "/":
            return divide(x,y);
            break;
        default:
            return undefined;
    }
}