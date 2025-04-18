/**
 * Utility type that extracts the keys of required properties from an object type T
 * @typeParam T - The object type to extract required keys from
 * @returns A union type of all required keys in T
 */
type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
  }[keyof T];
  
  /**
   * Gets an array of required keys for type T
   * @typeParam T - The object type to get required keys from
   * @returns An array of required keys
   */
  function getRequiredKeys<T>(): Array<RequiredKeys<T>> {
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
  function validateRequiredKeys<T extends object>(
    obj: Partial<T>,
    requiredKeys: ReadonlyArray<RequiredKeys<T>>
  ): asserts obj is T {
    const missingKeys = requiredKeys.filter((key) => !(key in obj));
  
    if (missingKeys.length > 0) {
      throw new Error(`Missing required properties: ${missingKeys.join(', ')}`);
    }
  }
  
  /**
   * Type-safe function builder that ensures all required keys are present
   * @param obj - The object to validate
   * @param requiredKeys - Array of keys that are required
   * @returns The original object with type narrowed to ensure all required keys are present
   * @throws Error if any required keys are missing
   */
  function withRequiredKeys<T extends object>(
    obj: Partial<T>,
    requiredKeys: ReadonlyArray<RequiredKeys<T>>
  ): T {
    validateRequiredKeys(obj, requiredKeys);
    return obj as T;
  }
  
  // Example usage:
  interface User {
    id: number;
    name: string;
    email?: string;
    age?: number;
  }
  
  // type UserRequiredKeys = "id" | "name"
  type UserRequiredKeys = RequiredKeys<User>;
  
  // You need to explicitly provide required keys at runtime
  const userRequiredKeys: ReadonlyArray<UserRequiredKeys> = ['id', 'name'] as const;
  
  // Valid case
  const validUser = withRequiredKeys<User>(
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com"
    },
    userRequiredKeys
  );
  
  console.log(validUser); // OK
  
  // Invalid case (missing 'name')
  try {
    const invalidUser = withRequiredKeys<User>(
      {
        id: 1,
        // name is missing
        email: "john@example.com"
      },
      userRequiredKeys
    );
    console.log(invalidUser);
  } catch (e) {
    console.log(e); // Error: Missing required properties: name
  }

  //for run tsc RequiredKeys.ts && node RequiredKeys.js
  // tsc index.ts && node index.ts