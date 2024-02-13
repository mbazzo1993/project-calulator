/** GLOBAL VARIABLES */
let x = '0';
let y = '';
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

/**
 * Handle click of calculator button
 * @param {Event} event 
 */
function buttonClickHandler(event) {
    const btn = event.target;
    const btnType = btn.dataset.btnType;
    console.log('btnType= '+btnType);
    if (btnType === 'num') {
        // button clicked is a number or decimal sign
        if (!xIsDefined) {

            if (x.length < 11 && x !== '0') {
                x += (x.includes('.') || x.length === 0) && btn.value === '.' ?
                    '' :
                    btn.value;
                

            } else if (x === '0') {
                x = btn.value === '.' ? '0.' : btn.value;
            }

            bigDispDiv.innerHTML = formatOutput(x);
        } else {

            if (op !== ''){

                if (y.length < 11 && y !== '') {

                    y += (y.includes('.') || y.length === 0) && btn.value === '.' ?
                        '' :
                        btn.value;

                } else if (y === '') {
                    y = btn.value === '.' ? '0.' : btn.value;
                }

                bigDispDiv.innerHTML = formatOutput(y);
            } else {
                // if y is specified and op is blank, reset x and y. 
                // value is reassigned to x
                x = '0';
                y = '';
                xIsDefined = false;
                buttonClickHandler(event);

            }
        }
    } else {
        // button clicked is an operator
        if (mathOpsArr.includes(btn.value) && op === '') {
            // operator is empty
            xIsDefined = true;
            op += btn.value;
        } else if (mathOpsArr.includes(btn.value) && op !== '' && xIsDefined && y !== '') {
            // operator is selected while x and y are defined
            x = String(operate(parseFloat(x),op,parseFloat(y)));
            y = '';
            op = btn.value;
            bigDispDiv.innerHTML = formatOutput(x);
        } else if (mathOpsArr.includes(btn.value) && op !== '' && xIsDefined && y === '') {
            op = btn.value;
        }

        // handle clear
        if (btn.value === 'AC') clear();

        // handle equals / eval
        if (btn.value === '=' && x !== '' && y !== '' && op !== '') {
            console.log(operate(parseFloat(x),op,parseFloat(y)));
            x = operate(parseFloat(x),op,parseFloat(y)) === undefined ? 'ERROR' : String(operate(parseFloat(x),op,parseFloat(y)));
            y = '';
            op = '';
            bigDispDiv.innerHTML = formatOutput(x);
        }

    }
    
    console.log('x= '+x);
    console.log('op= '+op);
    console.log('y= '+y);
    console.log('xIsDefined= '+xIsDefined);
}

/**
 * Clears div that displays numbers and resets variables
 */
function clear() {
    xIsDefined = false;
    x = '0';
    y = '';
    op = '';
    bigDispDiv.innerHTML = x;
}

/**
 * Format number string output to ensure output respects calculator's screen
 * limitation of 11 characters.
 * @param {String} numStr 
 * @returns string representing formatted number
 */
function formatOutput (numStr) {

    // Case 5 - not a number
    if (isNaN(parseFloat(numStr))) return 'ERROR';

    if (Math.round(parseFloat(numStr)) > 99999999999) {
        // Case 1 - Very Large Number
        // for display overflow, use scientific notation
        let numInt = parseInt(numStr);
        let pow10Suffix = 'e'+String(String(numInt).length - 1);


        // number too large to display
        // DECISION: 'eXXX...' may only take up 8 characters
        if (pow10Suffix.length > 8) return 'ERROR';

        // first need to round to 11 places
        numStr = numStr.slice(0,11)+"."+numStr.slice(11);
        numStr = String(Math.round(parseFloat(numStr)));

        // then round to place based on length of pow10Suffix
        numStr = numStr.slice(0,-pow10Suffix.length)+'.'+numStr.slice(-pow10Suffix.length);
        numStr = String(Math.round(parseFloat(numStr)));

        // then remove trailing zeros
        numStr = removeTrailingZeros(numStr);

        // finally, add the pow10 suffix
        numStr = (numStr)[0]+'.'+(numStr).slice(1)+pow10Suffix;

        return numStr;
    } else if (numStr.length > 11) {
        // Case 2 - Number has too many digits
        // Logic: prioritize whole number portion then display
        // maximum digits from fractional portion using leftover space

        let pow10 = (numStr.split('.')[0] === '0') ? 0 : numStr.split('.')[0].length;
        // trivial case for 10 or 11 whole number digits
        if (pow10 + 1 >= 10) return String(Math.round(parseFloat(numStr)))

        // otherwise round to the 11th digit
        numStr =( 
            (pow10 === 0) 
                ?
            (
                (numStr.split('.')[1]).slice(0,9) +
                '.'+
                (numStr.split('.')[1]).slice(9)
            ) 
                :
            (
                (numStr.split('.')[0] + numStr.split('.')[1]).slice(0,10) +
                "." +
                (numStr.split('.')[0] + numStr.split('.')[1]).slice(10)
            )
        );
        numStr = String(Math.round(parseFloat(numStr)));

        // reinsert decimal
        numStr = (pow10 === 0) ? 
            '0'+'.'+numStr : 
            numStr.slice(0,pow10)+'.'+numStr.slice(pow10);
        console.log(numStr);

        numStr = removeTrailingZeros(numStr);

        numStr = numStr.slice(-1) === '.' ? numStr.slice(0,-1) : numStr;

        return numStr;

    } else if (numStr === 'ERROR') {
        // Case 4 : Error case
        return numStr
    } else {
        // Case 3 - No issue with displaying the digits

        // if there are 'useless' zeros after the decimal
        if (parseFloat(numStr.split('.')[0]) === parseFloat(numStr)) return numStr.split('.')[0];

        numStr = numStr.split('.')[0] + 
            "." +
            (
                numStr.split('.')[1] === undefined ? 
                '' :
                removeTrailingZeros(numStr.split('.')[1])
            );

        
        return numStr;

    }

}

/**
 * Helper function for formatOutput() which removes trailing zeros
 * from a string representing a number.
 * @param {String} numStr 
 * @returns string representing a number with fewer trailing zeros
 */
function removeTrailingZeros(numStr) {

    while (true) {
        if (numStr.length <= 2) break;
        if(numStr.slice(-1) === '0') {
            numStr = numStr.slice(0,-1);
        } else {
            break;
        }
    }

    return numStr;
}