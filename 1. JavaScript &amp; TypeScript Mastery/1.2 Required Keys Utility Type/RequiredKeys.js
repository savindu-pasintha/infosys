/**
 * Gets an array of required keys for type T
 * @typeParam T - The object type to get required keys from
 * @returns An array of required keys
 */
function getRequiredKeys() {
    // This is a type-level operation - runtime implementation would need metadata
    // In a real app, you might use a decorator or metadata system
    throw new Error('This should be used for type inference only');
}
/**
 * Function that validates an object contains all required properties of type T
 * @param obj - The object to validate
 * @param requiredKeys - Array of keys that should be required
 * @throws Error if any required keys are missing
 * @returns The original object if validation passes
 */
function validateRequiredKeys(obj, requiredKeys) {
    var missingKeys = requiredKeys.filter(function (key) { return !(key in obj); });
    if (missingKeys.length > 0) {
        throw new Error("Missing required properties: ".concat(missingKeys.join(', ')));
    }
}
/**
 * Type-safe function builder that ensures all required keys are present
 * @param obj - The object to validate
 * @param requiredKeys - Array of keys that are required
 * @returns The original object with type narrowed to ensure all required keys are present
 * @throws Error if any required keys are missing
 */
function withRequiredKeys(obj, requiredKeys) {
    validateRequiredKeys(obj, requiredKeys);
    return obj;
}
// You need to explicitly provide required keys at runtime
var userRequiredKeys = ['id', 'name'];
// Valid case
var validUser = withRequiredKeys({
    id: 1,
    name: "John Doe",
    email: "john@example.com"
}, userRequiredKeys);
console.log(validUser); // OK
// Invalid case (missing 'name')
try {
    var invalidUser = withRequiredKeys({
        id: 1,
        // name is missing
        email: "john@example.com"
    }, userRequiredKeys);
    console.log(invalidUser);
}
catch (e) {
    console.log(e); // Error: Missing required properties: name
}
