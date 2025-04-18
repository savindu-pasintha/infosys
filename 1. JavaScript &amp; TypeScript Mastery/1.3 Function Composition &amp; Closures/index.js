/**
 * Composes functions from right to left
 * Supports both synchronous and asynchronous functions
 */
function compose(...fns) {
    return async (...args) => {
        if (fns.length === 0) {
            throw new Error('compose requires at least one function');
        }
        let result = fns[0](...args);
        for (let i = 1; i < fns.length; i++) {
            result = await result;
            result = fns[i](result);
        }
        return await result;
    };
}
// Example usage
const add5 = (x) => x + 5;
const multiply3 = (x) => x * 3;
const showResult = (x) => `Final: ${x}`;
// Works with sync functions
compose(multiply3, add5, showResult)(2)
    .then(console.log); // "Final: 11"
// Works with async functions too
const asyncDouble = async (x) => x * 2;
compose(asyncDouble, multiply3, showResult)(3)
    .then(console.log); // "Final: 18"
// to run used:  tsc index.ts --target ES2017 && node index.js    
