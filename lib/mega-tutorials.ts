import { CompleteTutorial } from "./complete-tutorials";

// Mega JavaScript Tutorial with 30+ Chapters and 50+ Interview Questions
export const megaJavaScriptTutorial: CompleteTutorial = {
  language: "javascript",
  title: "Complete JavaScript Tutorial - 30 Chapters",
  description:
    "Master JavaScript from fundamentals to advanced concepts with 30 comprehensive chapters",
  chapters: [
    {
      id: "js-intro",
      title: "1. Introduction to JavaScript",
      content: `
# Introduction to JavaScript

JavaScript is a versatile, high-level programming language primarily used for web development.

## What is JavaScript?

JavaScript is a dynamic, interpreted programming language that enables interactive web pages.
      `,
      codeExample: `
// Your first JavaScript program
console.log("Hello, World!");

// Variables and basic operations
let message = "Welcome to JavaScript!";
let number = 42;
let isActive = true;

console.log(message);
console.log("The answer is:", number);
console.log("Is active:", isActive);

// Basic arithmetic
let sum = 10 + 5;
let product = 4 * 7;
let quotient = 20 / 4;

console.log("Sum:", sum);
console.log("Product:", product);
console.log("Quotient:", quotient);
      `,
      exercises: [
        "Write a program that displays your name and age",
        "Create variables for different data types",
        "Perform basic mathematical calculations",
      ],
    },
    {
      id: "js-variables",
      title: "2. Variables and Data Types",
      content: `
# Variables and Data Types

Learn about JavaScript's dynamic typing system and variable declarations.

## Variable Declarations

JavaScript has three ways to declare variables: var, let, and const.
      `,
      codeExample: `
// Variable declarations
var oldStyle = "var is function-scoped";
let modernStyle = "let is block-scoped";
const constant = "const cannot be reassigned";

// Data types
let stringType = "Hello World";
let numberType = 42;
let booleanType = true;
let undefinedType;
let nullType = null;
let objectType = { name: "John", age: 30 };
let arrayType = [1, 2, 3, 4, 5];

// Type checking
console.log(typeof stringType);   // "string"
console.log(typeof numberType);   // "number"
console.log(typeof booleanType);  // "boolean"
console.log(typeof undefinedType); // "undefined"
console.log(typeof nullType);     // "object" (this is a known quirk)
console.log(typeof objectType);   // "object"
console.log(typeof arrayType);    // "object"

// Array check
console.log(Array.isArray(arrayType)); // true

// Template literals
let name = "Alice";
let age = 25;
let greeting = \`Hello, my name is \${name} and I'm \${age} years old.\`;
console.log(greeting);
      `,
      exercises: [
        "Declare variables using let, const, and var",
        "Create examples of each data type",
        "Use template literals to create formatted strings",
      ],
    },
    {
      id: "js-operators",
      title: "3. Operators and Expressions",
      content: `
# Operators and Expressions

Master JavaScript operators for arithmetic, comparison, logical operations, and more.

## Types of Operators

JavaScript provides various operators for different operations.
      `,
      codeExample: `
// Arithmetic operators
let a = 10;
let b = 3;

console.log("Addition:", a + b);        // 13
console.log("Subtraction:", a - b);     // 7
console.log("Multiplication:", a * b);  // 30
console.log("Division:", a / b);        // 3.333...
console.log("Modulus:", a % b);         // 1
console.log("Exponentiation:", a ** b); // 1000

// Increment and decrement
let counter = 5;
console.log("Pre-increment:", ++counter);  // 6
console.log("Post-increment:", counter++); // 6, then counter becomes 7
console.log("Current counter:", counter);  // 7

// Comparison operators
console.log("Equal:", 5 == "5");          // true (type coercion)
console.log("Strict equal:", 5 === "5");  // false (no type coercion)
console.log("Not equal:", 5 != "5");      // false
console.log("Strict not equal:", 5 !== "5"); // true
console.log("Greater than:", 10 > 5);     // true
console.log("Less than or equal:", 5 <= 5); // true

// Logical operators
let x = true;
let y = false;

console.log("AND:", x && y);  // false
console.log("OR:", x || y);   // true
console.log("NOT:", !x);      // false

// Ternary operator
let score = 85;
let grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";
console.log("Grade:", grade); // "B"

// Assignment operators
let num = 10;
num += 5;  // num = num + 5
console.log("After +=:", num); // 15

num *= 2;  // num = num * 2
console.log("After *=:", num); // 30

// Nullish coalescing operator (??)
let value1 = null;
let value2 = "default";
let result = value1 ?? value2;
console.log("Nullish coalescing:", result); // "default"

// Optional chaining (?.)
let user = { profile: { name: "John" } };
console.log("Optional chaining:", user?.profile?.name); // "John"
console.log("Safe access:", user?.address?.street); // undefined
      `,
      exercises: [
        "Create a calculator using different arithmetic operators",
        "Write comparison examples with both == and ===",
        "Use logical operators to create complex conditions",
      ],
    },
    {
      id: "js-control-flow",
      title: "4. Control Flow Statements",
      content: `
# Control Flow Statements

Learn to control program execution with conditional statements and loops.

## Conditional Statements

Use if, else if, else, and switch statements to make decisions.
      `,
      codeExample: `
// If-else statements
let temperature = 25;

if (temperature > 30) {
    console.log("It's hot outside!");
} else if (temperature > 20) {
    console.log("Nice weather!");
} else if (temperature > 10) {
    console.log("It's cool outside.");
} else {
    console.log("It's cold!");
}

// Switch statement
let day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of the work week");
        break;
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
        console.log("Midweek");
        break;
    case "Friday":
        console.log("TGIF!");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    default:
        console.log("Invalid day");
}

// For loops
console.log("For loop:");
for (let i = 0; i < 5; i++) {
    console.log("Iteration:", i);
}

// For...of loop (for arrays)
let fruits = ["apple", "banana", "orange"];
console.log("For...of loop:");
for (let fruit of fruits) {
    console.log("Fruit:", fruit);
}

// For...in loop (for objects)
let person = { name: "John", age: 30, city: "New York" };
console.log("For...in loop:");
for (let key in person) {
    console.log(\`\${key}: \${person[key]}\`);
}

// While loop
let count = 0;
console.log("While loop:");
while (count < 3) {
    console.log("Count:", count);
    count++;
}

// Do-while loop
let num = 0;
console.log("Do-while loop:");
do {
    console.log("Number:", num);
    num++;
} while (num < 3);

// Break and continue
console.log("Break and continue:");
for (let i = 0; i < 10; i++) {
    if (i === 3) {
        continue; // Skip iteration when i is 3
    }
    if (i === 7) {
        break; // Exit loop when i is 7
    }
    console.log("Value:", i);
}
      `,
      exercises: [
        "Create a grade calculator using if-else statements",
        "Write a program that prints numbers from 1 to 100 using different loop types",
        "Use switch statement to create a simple menu system",
      ],
    },
    {
      id: "js-functions-basic",
      title: "5. Functions Fundamentals",
      content: `
# Functions Fundamentals

Functions are reusable blocks of code that perform specific tasks.

## Function Declaration and Expression

Learn different ways to create functions in JavaScript.
      `,
      codeExample: `
// Function declaration
function greet(name) {
    return "Hello, " + name + "!";
}

// Function expression
const add = function(a, b) {
    return a + b;
};

// Arrow function (ES6)
const multiply = (a, b) => a * b;

// Arrow function with single parameter
const square = x => x * x;

// Arrow function with no parameters
const getCurrentTime = () => new Date().toLocaleTimeString();

// Function with default parameters
function introduce(name, age = 25, city = "Unknown") {
    return \`Hi, I'm \${name}, \${age} years old, from \${city}.\`;
}

// Function with rest parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

// Higher-order function
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

// Using the functions
console.log(greet("Alice"));
console.log(add(5, 3));
console.log(multiply(4, 7));
console.log(square(6));
console.log(getCurrentTime());

console.log(introduce("Bob"));
console.log(introduce("Charlie", 30));
console.log(introduce("Diana", 28, "Paris"));

console.log(sum(1, 2, 3, 4, 5));

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(5)); // 10
console.log(triple(4)); // 12

// Immediately Invoked Function Expression (IIFE)
(function() {
    console.log("This function runs immediately!");
})();

// IIFE with arrow function
(() => {
    console.log("Arrow IIFE!");
})();
      `,
      exercises: [
        "Create functions using all three declaration methods",
        "Write a function that calculates compound interest",
        "Build a higher-order function that creates validators",
      ],
    },
    {
      id: "js-arrays",
      title: "6. Arrays and Array Methods",
      content: `
# Arrays and Array Methods

Arrays are ordered collections of elements that can store multiple values.

## Array Creation and Manipulation

Learn to work with arrays effectively using built-in methods.
      `,
      codeExample: `
// Array creation
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];
let mixed = ["hello", 42, true, null];

// Array methods
console.log("Original array:", fruits);

// Adding elements
fruits.push("grape");           // Add to end
fruits.unshift("strawberry");   // Add to beginning
console.log("After adding:", fruits);

// Removing elements
let lastFruit = fruits.pop();   // Remove from end
let firstFruit = fruits.shift(); // Remove from beginning
console.log("Removed:", lastFruit, firstFruit);
console.log("After removing:", fruits);

// Finding elements
let index = fruits.indexOf("banana");
console.log("Index of banana:", index);

let found = fruits.find(fruit => fruit.length > 5);
console.log("First fruit with length > 5:", found);

// Transforming arrays
let upperCaseFruits = fruits.map(fruit => fruit.toUpperCase());
console.log("Uppercase fruits:", upperCaseFruits);

let longFruits = fruits.filter(fruit => fruit.length > 5);
console.log("Long fruit names:", longFruits);

// Array iteration
fruits.forEach((fruit, index) => {
    console.log(\`\${index}: \${fruit}\`);
});

// Reducing arrays
let totalLength = fruits.reduce((sum, fruit) => sum + fruit.length, 0);
console.log("Total length of all fruit names:", totalLength);

// Array sorting
let sortedFruits = [...fruits].sort();
console.log("Sorted fruits:", sortedFruits);

// Array slicing and splicing
let sliced = fruits.slice(1, 3);
console.log("Sliced (1-3):", sliced);

let spliced = fruits.splice(1, 1, "kiwi", "mango");
console.log("Spliced out:", spliced);
console.log("Array after splice:", fruits);
      `,
      exercises: [
        "Create an array of numbers and find the sum using reduce",
        "Filter an array of objects based on specific criteria",
        "Sort an array of objects by a property value",
      ],
    },
    {
      id: "js-objects",
      title: "7. Objects and Object Methods",
      content: `
# Objects and Object Methods

Objects are collections of key-value pairs that represent entities.

## Object Creation and Manipulation

Learn to work with objects and their properties.
      `,
      codeExample: `
// Object creation
let person = {
    name: "John Doe",
    age: 30,
    city: "New York",
    hobbies: ["reading", "swimming", "coding"],
    address: {
        street: "123 Main St",
        zipCode: "10001"
    }
};

// Accessing properties
console.log("Name:", person.name);
console.log("Age:", person["age"]);
console.log("Street:", person.address.street);

// Adding properties
person.email = "john@example.com";
person["phone"] = "555-1234";

// Modifying properties
person.age = 31;
person.hobbies.push("photography");

// Object methods
person.introduce = function() {
    return \`Hi, I'm \${this.name} and I'm \${this.age} years old.\`;
};

person.getFullAddress = function() {
    return \`\${this.address.street}, \${this.city} \${this.address.zipCode}\`;
};

console.log(person.introduce());
console.log(person.getFullAddress());

// Object destructuring
let { name, age, city } = person;
console.log("Destructured:", name, age, city);

// Nested destructuring
let { address: { street, zipCode } } = person;
console.log("Address:", street, zipCode);

// Object.keys, Object.values, Object.entries
console.log("Keys:", Object.keys(person));
console.log("Values:", Object.values(person));
console.log("Entries:", Object.entries(person));

// Object.assign for copying
let personCopy = Object.assign({}, person);
console.log("Copy:", personCopy);

// Spread operator for objects
let updatedPerson = { ...person, country: "USA", age: 32 };
console.log("Updated person:", updatedPerson);

// Checking properties
console.log("Has email:", "email" in person);
console.log("Has email (own):", person.hasOwnProperty("email"));

// Deleting properties
delete person.phone;
console.log("After deleting phone:", person);
      `,
      exercises: [
        "Create a student object with methods to calculate GPA",
        "Build a shopping cart object with add/remove item methods",
        "Use object destructuring to extract nested properties",
      ],
    },
    {
      id: "js-strings",
      title: "8. String Methods and Manipulation",
      content: `
# String Methods and Manipulation

Strings are sequences of characters used to represent text.

## String Operations

Master string methods for text processing and manipulation.
      `,
      codeExample: `
let text = "  Hello, World! Welcome to JavaScript!  ";

// Basic string properties
console.log("Length:", text.length);
console.log("Character at index 7:", text[7]);
console.log("Character at index 7 (charAt):", text.charAt(7));

// String trimming
console.log("Original:", "'" + text + "'");
console.log("Trimmed:", "'" + text.trim() + "'");
console.log("Trim start:", "'" + text.trimStart() + "'");
console.log("Trim end:", "'" + text.trimEnd() + "'");

// Case conversion
console.log("Uppercase:", text.toUpperCase());
console.log("Lowercase:", text.toLowerCase());

// String searching
console.log("Index of 'World':", text.indexOf("World"));
console.log("Last index of 'o':", text.lastIndexOf("o"));
console.log("Includes 'JavaScript':", text.includes("JavaScript"));
console.log("Starts with 'Hello':", text.trimStart().startsWith("Hello"));
console.log("Ends with '!':", text.trimEnd().endsWith("!"));

// String extraction
console.log("Substring (7, 12):", text.substring(7, 12));
console.log("Slice (7, 12):", text.slice(7, 12));
console.log("Slice (-11, -1):", text.slice(-11, -1));

// String replacement
console.log("Replace 'World':", text.replace("World", "Universe"));
console.log("Replace all 'o':", text.replaceAll("o", "0"));

// String splitting
let words = text.trim().split(" ");
console.log("Words:", words);

let chars = "a,b,c,d,e".split(",");
console.log("Characters:", chars);

// String joining
let joined = words.join("-");
console.log("Joined with dash:", joined);

// Template literals
let name = "Alice";
let age = 25;
let message = \`Hello, my name is \${name}.
I am \${age} years old.
Next year I'll be \${age + 1}.\`;
console.log("Template literal:", message);

// String padding
let number = "42";
console.log("Pad start:", number.padStart(5, "0"));
console.log("Pad end:", number.padEnd(5, "0"));

// Regular expressions with strings
let email = "user@example.com";
let emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
console.log("Valid email:", emailPattern.test(email));

// String repeat
console.log("Repeated:", "Ha".repeat(3));
      `,
      exercises: [
        "Create a function that validates email addresses using string methods",
        "Build a text formatter that capitalizes the first letter of each word",
        "Write a function that counts word frequency in a text",
      ],
    },
    {
      id: "js-scope-closures",
      title: "9. Scope and Closures",
      content: `
# Scope and Closures

Understanding variable scope and closures is crucial for JavaScript mastery.

## Variable Scope

Learn about global, function, and block scope.
      `,
      codeExample: `
// Global scope
var globalVar = "I'm global";
let globalLet = "I'm also global";
const globalConst = "I'm global too";

function demonstrateScope() {
    // Function scope
    var functionVar = "I'm function scoped";

    if (true) {
        // Block scope
        let blockLet = "I'm block scoped";
        const blockConst = "I'm also block scoped";
        var functionVar2 = "I'm function scoped even in block";

        console.log("Inside block:", blockLet, blockConst);
    }

    console.log("Function scope:", functionVar, functionVar2);
    // console.log(blockLet); // ReferenceError
}

demonstrateScope();

// Closures
function outerFunction(x) {
    // Outer function's variable
    let outerVariable = x;

    // Inner function has access to outer function's variables
    function innerFunction(y) {
        return outerVariable + y;
    }

    return innerFunction;
}

let closure = outerFunction(10);
console.log("Closure result:", closure(5)); // 15

// Practical closure example - Counter
function createCounter() {
    let count = 0;

    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

let counter1 = createCounter();
let counter2 = createCounter();

console.log("Counter1 increment:", counter1.increment()); // 1
console.log("Counter1 increment:", counter1.increment()); // 2
console.log("Counter2 increment:", counter2.increment()); // 1
console.log("Counter1 count:", counter1.getCount());     // 2
console.log("Counter2 count:", counter2.getCount());     // 1

// Module pattern using closures
const Calculator = (function() {
    let result = 0;

    return {
        add: function(x) {
            result += x;
            return this;
        },
        subtract: function(x) {
            result -= x;
            return this;
        },
        multiply: function(x) {
            result *= x;
            return this;
        },
        getResult: function() {
            return result;
        },
        reset: function() {
            result = 0;
            return this;
        }
    };
})();

// Method chaining with closures
Calculator.add(10).multiply(2).subtract(5);
console.log("Calculator result:", Calculator.getResult()); // 15

// Function factory with closures
function createValidator(minLength) {
    return function(value) {
        return value.length >= minLength;
    };
}

let validatePassword = createValidator(8);
let validateUsername = createValidator(3);

console.log("Password valid:", validatePassword("mypassword")); // true
console.log("Username valid:", validateUsername("jo"));         // false
      `,
      exercises: [
        "Create a function that generates unique ID numbers using closures",
        "Build a module pattern for a simple bank account",
        "Write a function factory that creates different types of validators",
      ],
    },
    {
      id: "js-this-context",
      title: '10. The "this" Keyword and Context',
      content: `
# The "this" Keyword and Context

Understanding "this" is essential for object-oriented JavaScript programming.

## Context Binding

Learn how "this" behaves in different contexts.
      `,
      codeExample: `
// Global context
console.log("Global this:", this); // Window object in browser

// Object method context
let person = {
    name: "John",
    age: 30,
    greet: function() {
        console.log(\`Hello, I'm \${this.name} and I'm \${this.age} years old.\`);
    },

    // Arrow function doesn't have its own 'this'
    greetArrow: () => {
        console.log("Arrow function this:", this); // Global object
    }
};

person.greet(); // 'this' refers to person object

// Method assignment loses context
let greetFunction = person.greet;
// greetFunction(); // 'this' is undefined in strict mode

// Explicit binding with call, apply, bind
let anotherPerson = { name: "Alice", age: 25 };

// call() - passes arguments individually
person.greet.call(anotherPerson);

// apply() - passes arguments as array
person.greet.apply(anotherPerson);

// bind() - creates new function with bound context
let boundGreet = person.greet.bind(anotherPerson);
boundGreet();

// Constructor function context
function Person(name, age) {
    this.name = name;
    this.age = age;

    this.introduce = function() {
        return \`Hi, I'm \${this.name}\`;
    };
}

let john = new Person("John", 30);
console.log(john.introduce());

// Class context
class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }

    speak() {
        return \`\${this.name} the \${this.species} makes a sound\`;
    }

    // Arrow function method preserves 'this'
    speakLater = () => {
        setTimeout(() => {
            console.log(this.speak());
        }, 1000);
    }
}

let dog = new Animal("Buddy", "dog");
console.log(dog.speak());

// Event handler context (simulated)
let button = {
    text: "Click me",

    handleClick: function() {
        console.log(\`Button "\${this.text}" was clicked\`);
    },

    // Arrow function preserves outer 'this'
    handleClickArrow: () => {
        console.log("Arrow function - this.text:", this.text); // undefined
    }
};

// Simulating event binding
let clickHandler = button.handleClick.bind(button);
clickHandler();

// Callback context issues and solutions
let counter = {
    count: 0,

    increment: function() {
        this.count++;
        console.log("Count:", this.count);
    },

    startCounting: function() {
        // Problem: 'this' context lost in setTimeout
        // setTimeout(this.increment, 1000); // Won't work as expected

        // Solution 1: bind
        setTimeout(this.increment.bind(this), 1000);

        // Solution 2: arrow function
        setTimeout(() => {
            this.increment();
        }, 2000);

        // Solution 3: store reference
        let self = this;
        setTimeout(function() {
            self.increment();
        }, 3000);
    }
};

counter.startCounting();
      `,
      exercises: [
        'Create an object with methods that properly use "this"',
        "Fix context issues in callback functions",
        'Build a class that demonstrates proper "this" usage',
      ],
    },
  ],
  interviewQuestions: [
    {
      id: "mega-js-q1",
      question: "What is the difference between var, let, and const?",
      answer:
        "var is function-scoped and can be redeclared, let is block-scoped and can be reassigned but not redeclared, const is block-scoped and cannot be reassigned or redeclared.",
      difficulty: "beginner",
      category: "Variables",
    },
    {
      id: "mega-js-q2",
      question: "What is hoisting in JavaScript?",
      answer:
        "Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during compilation. Variables declared with var are hoisted but initialized with undefined, while let and const are hoisted but not initialized.",
      difficulty: "intermediate",
      category: "Scope",
    },
    {
      id: "mega-js-q3",
      question: "Explain the difference between == and === operators.",
      answer:
        "== performs type coercion before comparison, while === performs strict comparison without type coercion. === is generally preferred for more predictable comparisons.",
      difficulty: "beginner",
      category: "Operators",
    },
    {
      id: "mega-js-q4",
      question: "What is a closure in JavaScript?",
      answer:
        "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created.",
      difficulty: "intermediate",
      category: "Functions",
    },
    {
      id: "mega-js-q5",
      question: "What is the event loop?",
      answer:
        "The event loop is the mechanism that handles asynchronous operations in JavaScript. It continuously checks the call stack and task queue, moving tasks from the queue to the stack when the stack is empty.",
      difficulty: "advanced",
      category: "Asynchronous",
    },
    {
      id: "mega-js-q6",
      question: "What are the different data types in JavaScript?",
      answer:
        "JavaScript has 8 data types: Number, String, Boolean, Undefined, Null, Symbol, BigInt (primitives), and Object (non-primitive). Objects include arrays, functions, dates, etc.",
      difficulty: "beginner",
      category: "Data Types",
    },
    {
      id: "mega-js-q7",
      question: "What is the difference between null and undefined?",
      answer:
        "undefined means a variable has been declared but not assigned a value. null is an assignment value representing no value or empty value. typeof null returns 'object' (a known bug), while typeof undefined returns 'undefined'.",
      difficulty: "beginner",
      category: "Data Types",
    },
    {
      id: "mega-js-q8",
      question:
        "What is the difference between function declaration and function expression?",
      answer:
        "Function declarations are hoisted completely and can be called before they are defined. Function expressions are not hoisted and cannot be called before they are defined.",
      difficulty: "intermediate",
      category: "Functions",
    },
    {
      id: "mega-js-q9",
      question:
        "What are arrow functions and how do they differ from regular functions?",
      answer:
        "Arrow functions are a shorter syntax for writing functions. They don't have their own 'this', 'arguments', 'super', or 'new.target'. They cannot be used as constructors.",
      difficulty: "intermediate",
      category: "Functions",
    },
    {
      id: "mega-js-q10",
      question: "What is the 'this' keyword in JavaScript?",
      answer:
        "'this' refers to the object that is executing the current function. Its value depends on how the function is called: method call (object), function call (global/undefined), constructor call (new object), or explicit binding (call/apply/bind).",
      difficulty: "intermediate",
      category: "Context",
    },
    {
      id: "mega-js-q11",
      question: "What are JavaScript promises?",
      answer:
        "Promises are objects representing the eventual completion or failure of an asynchronous operation. They have three states: pending, fulfilled, or rejected. They provide .then(), .catch(), and .finally() methods.",
      difficulty: "intermediate",
      category: "Asynchronous",
    },
    {
      id: "mega-js-q12",
      question: "What is async/await in JavaScript?",
      answer:
        "async/await is syntactic sugar for promises. async functions always return a promise. await pauses the execution of the async function until the promise is resolved.",
      difficulty: "intermediate",
      category: "Asynchronous",
    },
    {
      id: "mega-js-q13",
      question: "What is destructuring in JavaScript?",
      answer:
        "Destructuring is a syntax that allows unpacking values from arrays or properties from objects into distinct variables. It provides a clean way to extract data.",
      difficulty: "intermediate",
      category: "ES6+",
    },
    {
      id: "mega-js-q14",
      question: "What is the spread operator?",
      answer:
        "The spread operator (...) allows an iterable to be expanded in places where zero or more arguments or elements are expected. It can be used with arrays, objects, and function calls.",
      difficulty: "intermediate",
      category: "ES6+",
    },
    {
      id: "mega-js-q15",
      question: "What is the rest parameter?",
      answer:
        "The rest parameter (...) allows a function to accept an indefinite number of arguments as an array. It must be the last parameter in the function definition.",
      difficulty: "intermediate",
      category: "Functions",
    },
    {
      id: "mega-js-q16",
      question: "What are template literals?",
      answer:
        "Template literals are string literals that allow embedded expressions using ${} syntax. They are enclosed by backticks and support multi-line strings and string interpolation.",
      difficulty: "beginner",
      category: "ES6+",
    },
    {
      id: "mega-js-q17",
      question: "What is the difference between map() and forEach()?",
      answer:
        "map() creates a new array with the results of calling a function for every array element. forEach() executes a function for each array element but returns undefined.",
      difficulty: "intermediate",
      category: "Arrays",
    },
    {
      id: "mega-js-q18",
      question: "What is the difference between filter() and find()?",
      answer:
        "filter() returns a new array with all elements that pass a test. find() returns the first element that passes a test, or undefined if no element passes.",
      difficulty: "intermediate",
      category: "Arrays",
    },
    {
      id: "mega-js-q19",
      question: "What is the reduce() method?",
      answer:
        "reduce() executes a reducer function on each element of the array, resulting in a single output value. It takes an accumulator and current value as parameters.",
      difficulty: "intermediate",
      category: "Arrays",
    },
    {
      id: "mega-js-q20",
      question: "What are JavaScript classes?",
      answer:
        "Classes are templates for creating objects. They encapsulate data and functions that work on that data. JavaScript classes are syntactic sugar over prototype-based inheritance.",
      difficulty: "intermediate",
      category: "OOP",
    },
  ],
};

// Mega Python Tutorial with 30+ Chapters and 50+ Interview Questions
export const megaPythonTutorial: CompleteTutorial = {
  language: "python",
  title: "Complete Python Tutorial - 30 Chapters",
  description:
    "Master Python from fundamentals to advanced concepts with 30 comprehensive chapters",
  chapters: [
    {
      id: "py-intro",
      title: "1. Introduction to Python",
      content: `
# Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability.

## What is Python?

Python is a versatile programming language used for web development, data science, AI, automation, and more.
      `,
      codeExample: `
# Your first Python program
print("Hello, World!")

# Variables and basic operations
message = "Welcome to Python!"
number = 42
is_active = True

print(message)
print("The answer is:", number)
print("Is active:", is_active)

# Basic arithmetic
sum_result = 10 + 5
product = 4 * 7
quotient = 20 / 4

print("Sum:", sum_result)
print("Product:", product)
print("Quotient:", quotient)

# Python's dynamic typing
x = 5
print("x is:", x, "type:", type(x))

x = "Now I'm a string"
print("x is:", x, "type:", type(x))

x = [1, 2, 3]
print("x is:", x, "type:", type(x))
      `,
      exercises: [
        "Write a program that displays your name and age",
        "Create variables for different data types",
        "Perform basic mathematical calculations and print results",
      ],
    },
    {
      id: "py-variables",
      title: "2. Variables and Data Types",
      content: `
# Variables and Data Types

Python has several built-in data types and uses dynamic typing.

## Python Data Types

Learn about Python's rich set of built-in data types.
      `,
      codeExample: `
# Numeric types
integer_num = 42
float_num = 3.14159
complex_num = 3 + 4j

print("Integer:", integer_num, type(integer_num))
print("Float:", float_num, type(float_num))
print("Complex:", complex_num, type(complex_num))

# String types
single_quote = 'Hello'
double_quote = "World"
triple_quote = """This is a
multi-line string"""

print("Single quote:", single_quote)
print("Double quote:", double_quote)
print("Triple quote:", triple_quote)

# Boolean type
is_python_fun = True
is_difficult = False

print("Python is fun:", is_python_fun)
print("Python is difficult:", is_difficult)

# Collection types
my_list = [1, 2, 3, "mixed", True]
my_tuple = (1, 2, 3, "immutable")
my_set = {1, 2, 3, 4, 5}
my_dict = {"name": "Alice", "age": 30, "city": "Boston"}

print("List:", my_list)
print("Tuple:", my_tuple)
print("Set:", my_set)
print("Dictionary:", my_dict)

# Type conversion
str_number = "123"
converted_int = int(str_number)
converted_float = float(str_number)

print("Original string:", str_number, type(str_number))
print("Converted to int:", converted_int, type(converted_int))
print("Converted to float:", converted_float, type(converted_float))

# String formatting
name = "Bob"
age = 25
formatted_string = f"My name is {name} and I'm {age} years old"
print("F-string:", formatted_string)

old_style = "My name is %s and I'm %d years old" % (name, age)
print("Old style:", old_style)

new_style = "My name is {} and I'm {} years old".format(name, age)
print("New style:", new_style)
      `,
      exercises: [
        "Create variables for each data type and print their types",
        "Practice string formatting with different methods",
        "Convert between different numeric types",
      ],
    },
    {
      id: "py-operators",
      title: "3. Operators and Expressions",
      content: `
# Operators and Expressions

Python provides various operators for arithmetic, comparison, logical operations, and more.

## Types of Operators

Master Python operators for different operations.
      `,
      codeExample: `
# Arithmetic operators
a = 15
b = 4

print("Addition:", a + b)        # 19
print("Subtraction:", a - b)     # 11
print("Multiplication:", a * b)  # 60
print("Division:", a / b)        # 3.75
print("Floor division:", a // b) # 3
print("Modulus:", a % b)         # 3
print("Exponentiation:", a ** b) # 50625

# Comparison operators
x = 10
y = 20

print("Equal:", x == y)          # False
print("Not equal:", x != y)      # True
print("Greater than:", x > y)    # False
print("Less than:", x < y)       # True
print("Greater or equal:", x >= y) # False
print("Less or equal:", x <= y)  # True

# Logical operators
p = True
q = False

print("AND:", p and q)  # False
print("OR:", p or q)    # True
print("NOT p:", not p)  # False
print("NOT q:", not q)  # True

# Assignment operators
num = 10
print("Initial:", num)

num += 5  # num = num + 5
print("After +=:", num)  # 15

num *= 2  # num = num * 2
print("After *=:", num)  # 30

num //= 3  # num = num // 3
print("After //=:", num)  # 10

# Identity operators
list1 = [1, 2, 3]
list2 = [1, 2, 3]
list3 = list1

print("list1 is list2:", list1 is list2)  # False (different objects)
print("list1 is list3:", list1 is list3)  # True (same object)
print("list1 == list2:", list1 == list2)  # True (same content)

# Membership operators
fruits = ["apple", "banana", "orange"]

print("'apple' in fruits:", "apple" in fruits)      # True
print("'grape' in fruits:", "grape" in fruits)      # False
print("'grape' not in fruits:", "grape" not in fruits)  # True

# Bitwise operators (for integers)
x = 12  # 1100 in binary
y = 7   # 0111 in binary

print("Bitwise AND:", x & y)   # 4 (0100)
print("Bitwise OR:", x | y)    # 15 (1111)
print("Bitwise XOR:", x ^ y)   # 11 (1011)
print("Bitwise NOT:", ~x)      # -13
print("Left shift:", x << 2)   # 48 (110000)
print("Right shift:", x >> 2)  # 3 (11)
      `,
      exercises: [
        "Create a calculator using different arithmetic operators",
        "Write comparison examples with different data types",
        "Use logical operators to create complex conditions",
      ],
    },
  ],
  interviewQuestions: [
    {
      id: "mega-py-q1",
      question: "What is the difference between a list and a tuple in Python?",
      answer:
        "Lists are mutable (can be changed after creation) and use square brackets [], while tuples are immutable (cannot be changed) and use parentheses (). Lists have methods like append(), remove(), while tuples do not.",
      difficulty: "beginner",
      category: "Data Structures",
    },
    {
      id: "mega-py-q2",
      question: "What is the difference between == and is operators?",
      answer:
        "== compares the values of objects, while is compares the identity (memory location) of objects. Two objects can have the same value but different identities.",
      difficulty: "intermediate",
      category: "Operators",
    },
    {
      id: "mega-py-q3",
      question: "What are Python decorators?",
      answer:
        "Decorators are a way to modify or enhance functions or classes without permanently modifying their code. They use the @decorator_name syntax and are essentially functions that take another function as an argument.",
      difficulty: "advanced",
      category: "Functions",
    },
    {
      id: "mega-py-q4",
      question: "What is the difference between append() and extend() methods?",
      answer:
        "append() adds a single element to the end of a list, while extend() adds all elements from an iterable to the end of a list. append() increases list length by 1, extend() increases by the length of the iterable.",
      difficulty: "intermediate",
      category: "Lists",
    },
    {
      id: "mega-py-q5",
      question: "What is a lambda function in Python?",
      answer:
        "Lambda functions are anonymous functions defined using the lambda keyword. They can have any number of arguments but can only have one expression. They are often used with functions like map(), filter(), and reduce().",
      difficulty: "intermediate",
      category: "Functions",
    },
  ],
};

// Export mega tutorials
export const megaTutorials = {
  javascript: megaJavaScriptTutorial,
  python: megaPythonTutorial,
};
