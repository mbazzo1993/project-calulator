/** GLOBAL VARIABLES */
let x = '0';
let y = '0';
let op = '';
const mathOpsArr = ['/','x','-','+'];
let xIsDefined = false;
let yIsDefined = false;

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
            let xIsSmallEnough = x.length < 11;
            let keyIsDecimal = btn.value === '.';
            let xHasDecimal = x.includes('.');
            let xIsZero = x === '0';

            // append decimal
            if ((xIsSmallEnough) && (keyIsDecimal && !xHasDecimal)) {
                x += btn.value;
            }

            // append number
            if (xIsSmallEnough && !keyIsDecimal) {
                if (xIsZero) x = btn.value;
                if (!xIsZero) x += btn.value;
            }

            bigDispDiv.innerHTML = formatOutput(x);
        } else {
            // if x is defined, append number to y
            let yIsSmallEnough = y.length < 11;
            let keyIsDecimal = btn.value === '.';
            let yHasDecimal = y.includes('.');
            let yIsZero = y === '0';
            let opIsBlank = op === '';

            // if op is blank but x is defined, perform reset and 
            // append key value to x
            if (opIsBlank) {
                clear();
                buttonClickHandler(event);
                return;
            }

            // append decimal
            if ((yIsSmallEnough) && (keyIsDecimal && !yHasDecimal)) {
                y += btn.value;
                yIsDefined = true;
            }

            // append number
            if (yIsSmallEnough && !keyIsDecimal) {
                if (yIsZero) y = btn.value;
                if (!yIsZero) y += btn.value;
                yIsDefined = true;
            }

                bigDispDiv.innerHTML = formatOutput(y);
        } 
    } else { // button clicked is an operator...
        
        let isMathOp = mathOpsArr.includes(btn.value);
        let isOpEmpty = op === '';
        let isOpClear = btn.value === 'AC';
        let isOpEquals = btn.value === '=';
        let isOpDel = btn.value === '<';


        // handle a math operation - x, y are not defined
        if (isMathOp && isOpEmpty && !xIsDefined && !yIsDefined) {
            xIsDefined = true;
            op = btn.value;
        }

        // handle math operation - only x is defined
        else if (isMathOp && isOpEmpty && xIsDefined && !yIsDefined) {
            op = btn.value;
        }

        // handle math operation - x and y are defined
        else if (isMathOp && !isOpEmpty && xIsDefined && yIsDefined) {
            // eval, store in x, reset y
            x = String(operate(parseFloat(x),op,parseFloat(y)));
            y = '0'
            yIsDefined = false;
            bigDispDiv.innerHTML = formatOutput(x);
            op = btn.value;
        }

        // handle clear operation
        else if (isOpClear) {
            clear();
            bigDispDiv.innerHTML = formatOutput(x);
        } 

        // handle equals / eval operation
        else if (isOpEquals && xIsDefined && yIsDefined && !isOpEmpty) {
            console.log(operate(parseFloat(x),op,parseFloat(y)));
            x = operate(parseFloat(x),op,parseFloat(y)) === undefined ? 'ERROR' : String(operate(parseFloat(x),op,parseFloat(y)));
            y = '0';
            op = '';
            yIsDefined = false;
            bigDispDiv.innerHTML = formatOutput(x);
        }

        // handle delete operation - x,y not defined
        else if (isOpDel && !xIsDefined && !yIsDefined) {
            let xIsZero = x === '0';
            let xIsLengthOne = x.length === 1;
            let isDeleteTenth = x.slice(-2,-1) === '.'
            
            // deleting the last character
            if (xIsZero || xIsLengthOne) x = '0';

            // deleting character before decimal - double delete
            if (isDeleteTenth) x = x.slice(0,-2);

            // otherwise just delete
            if (!xIsZero && !xIsLengthOne && !isDeleteTenth) x = x.slice(0,-1)

            bigDispDiv.innerHTML = formatOutput(x);
        }

        // handle delete operation - only x defined
        else if (isOpDel && xIsDefined && !yIsDefined) {
            // do nothing
        }

        // handle delete operation - x,y are defined
        else if (isOpDel && xIsDefined && yIsDefined) {
            let yIsZero = y === '0';
            let yIsLengthOne = y.length === 1;
            let isDeleteTenth = y.slice(-2,-1) === '.'
            
            // deleting the last character
            if (yIsZero || yIsLengthOne) y = '0';

            // deleting character before decimal - double delete
            if (isDeleteTenth) y = y.slice(0,-2);

            // otherwise just delete
            if (!yIsZero && !yIsLengthOne && !isDeleteTenth) y = y.slice(0,-1)

            bigDispDiv.innerHTML = formatOutput(y);
        }


    }
    
    console.log('x= '+x);
    console.log('op= '+op);
    console.log('y= '+y);
    console.log('xIsDefined= '+xIsDefined);
    console.log('yIsDefined= '+yIsDefined);
}

/**
 * Clears div that displays numbers and resets variables
 */
function clear() {
    x = '0';
    y = '0';
    op = ''
    xIsDefined = false;
    yIsDefined = false;
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
        numStr = numStr.slice(0,10)+"."+numStr.slice(10);
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