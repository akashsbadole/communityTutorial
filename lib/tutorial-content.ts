// Tutorial content structure like W3Schools/MDN
export interface TutorialSection {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  tryItYourself?: string;
  output?: string;
  tips?: string[];
  nextSection?: string;
  prevSection?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  sections: TutorialSection[];
  prerequisites?: string[];
  whatYouWillLearn: string[];
}

export const tutorialContent: Record<string, Tutorial[]> = {
  javascript: [
    {
      id: "js_basics",
      title: "JavaScript Basics",
      description: "Learn the fundamentals of JavaScript programming language",
      difficulty: "beginner",
      estimatedTime: "2 hours",
      prerequisites: ["Basic HTML knowledge"],
      whatYouWillLearn: [
        "Variables and data types",
        "Functions and scope",
        "Control structures",
        "Basic DOM manipulation",
      ],
      sections: [
        {
          id: "variables",
          title: "Variables and Data Types",
          content: `
# Variables in JavaScript

JavaScript variables are containers for storing data values. You can declare variables using \`var\`, \`let\`, or \`const\`.

## Variable Declaration

- **let**: Block-scoped variable that can be reassigned
- **const**: Block-scoped variable that cannot be reassigned
- **var**: Function-scoped variable (avoid in modern JavaScript)

## Data Types

JavaScript has several built-in data types:

1. **String**: Text data
2. **Number**: Numeric data (integers and decimals)
3. **Boolean**: true or false
4. **Undefined**: Variable declared but not assigned
5. **Null**: Intentional absence of value
6. **Object**: Complex data type
7. **Symbol**: Unique identifier (ES6+)
          `,
          codeExample: `// Variable declarations
let name = "John Doe";
const age = 25;
let isStudent = true;

// Different data types
let message = "Hello World";        // String
let count = 42;                     // Number
let isActive = false;               // Boolean
let data;                          // Undefined
let result = null;                 // Null

// Check data types
console.log(typeof name);          // "string"
console.log(typeof age);           // "number"
console.log(typeof isActive);      // "boolean"`,
          tryItYourself: `// Try creating your own variables
let yourName = "Your Name Here";
let yourAge = 0;
let isLearning = true;

console.log("Name:", yourName);
console.log("Age:", yourAge);
console.log("Learning:", isLearning);`,
          output: `Name: Your Name Here
Age: 0
Learning: true`,
          tips: [
            "Use const by default, let when you need to reassign",
            "Avoid var in modern JavaScript",
            "Use descriptive variable names",
            "JavaScript is case-sensitive",
          ],
          nextSection: "functions",
        },
        {
          id: "functions",
          title: "Functions",
          content: `
# Functions in JavaScript

Functions are reusable blocks of code that perform specific tasks. They are one of the fundamental building blocks in JavaScript.

## Function Declaration

There are several ways to create functions in JavaScript:

1. **Function Declaration**: Hoisted and can be called before declaration
2. **Function Expression**: Not hoisted, must be declared before use
3. **Arrow Functions**: Shorter syntax, different \`this\` binding

## Parameters and Arguments

Functions can accept parameters (inputs) and return values (outputs).
          `,
          codeExample: `// Function Declaration
function greet(name) {
    return "Hello, " + name + "!";
}

// Function Expression
const add = function(a, b) {
    return a + b;
};

// Arrow Function
const multiply = (a, b) => {
    return a * b;
};

// Arrow Function (shorter syntax)
const square = x => x * x;

// Using functions
console.log(greet("Alice"));        // "Hello, Alice!"
console.log(add(5, 3));            // 8
console.log(multiply(4, 6));       // 24
console.log(square(5));            // 25`,
          tryItYourself: `// Create a function that calculates the area of a rectangle
function calculateArea(width, height) {
    return width * height;
}

// Test your function
let area = calculateArea(10, 5);
console.log("Area:", area);

// Create an arrow function for circle area
const circleArea = radius => Math.PI * radius * radius;
console.log("Circle area:", circleArea(3));`,
          output: `Area: 50
Circle area: 28.274333882308138`,
          tips: [
            "Use arrow functions for short, simple functions",
            "Function names should describe what they do",
            "Keep functions small and focused",
            "Use return statements to output values",
          ],
          prevSection: "variables",
          nextSection: "conditionals",
        },
        {
          id: "conditionals",
          title: "Conditional Statements",
          content: `
# Conditional Statements

Conditional statements allow you to execute different code blocks based on different conditions.

## If Statement

The \`if\` statement executes code if a condition is true.

## If-Else Statement

The \`if-else\` statement executes one block if condition is true, another if false.

## Switch Statement

The \`switch\` statement compares a value against multiple cases.
          `,
          codeExample: `// If statement
let age = 18;
if (age >= 18) {
    console.log("You are an adult");
}

// If-else statement
let score = 85;
if (score >= 90) {
    console.log("Grade: A");
} else if (score >= 80) {
    console.log("Grade: B");
} else if (score >= 70) {
    console.log("Grade: C");
} else {
    console.log("Grade: F");
}

// Switch statement
let day = "Monday";
switch (day) {
    case "Monday":
        console.log("Start of work week");
        break;
    case "Friday":
        console.log("TGIF!");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    default:
        console.log("Regular day");
}`,
          tryItYourself: `// Create a function to check if a number is positive, negative, or zero
function checkNumber(num) {
    if (num > 0) {
        return "Positive";
    } else if (num < 0) {
        return "Negative";
    } else {
        return "Zero";
    }
}

// Test your function
console.log(checkNumber(5));   // Positive
console.log(checkNumber(-3));  // Negative
console.log(checkNumber(0));   // Zero`,
          output: `Positive
Negative
Zero`,
          tips: [
            "Use === for strict equality comparison",
            "Remember to use break in switch statements",
            "Consider using ternary operator for simple conditions",
            "Group related conditions with logical operators",
          ],
          prevSection: "functions",
          nextSection: "loops",
        },
        {
          id: "loops",
          title: "Loops and Iteration",
          content: `
# Loops in JavaScript

Loops allow you to execute code repeatedly based on a condition. JavaScript provides several types of loops.

## Types of Loops

1. **for loop**: Execute code a specific number of times
2. **while loop**: Execute code while a condition is true
3. **do-while loop**: Execute code at least once, then while condition is true
4. **for...in loop**: Iterate over object properties
5. **for...of loop**: Iterate over iterable objects (arrays, strings)

## When to Use Each Loop

Choose the right loop based on your specific needs and data structure.
          `,
          codeExample: `// For loop - when you know the number of iterations
for (let i = 0; i < 5; i++) {
    console.log("Iteration:", i);
}

// While loop - when condition-based iteration
let count = 0;
while (count < 3) {
    console.log("Count:", count);
    count++;
}

// Do-while loop - execute at least once
let num = 0;
do {
    console.log("Number:", num);
    num++;
} while (num < 2);

// For...in loop - iterate over object properties
const person = { name: "John", age: 30, city: "New York" };
for (let key in person) {
    console.log(key + ":", person[key]);
}

// For...of loop - iterate over arrays
const fruits = ["apple", "banana", "orange"];
for (let fruit of fruits) {
    console.log("Fruit:", fruit);
}`,
          tryItYourself: `// Create a multiplication table
function multiplicationTable(num) {
    console.log(\`Multiplication table for \${num}:\`);
    for (let i = 1; i <= 10; i++) {
        console.log(\`\${num} x \${i} = \${num * i}\`);
    }
}

multiplicationTable(5);

// Find even numbers in an array
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenNumbers = [];

for (let number of numbers) {
    if (number % 2 === 0) {
        evenNumbers.push(number);
    }
}

console.log("Even numbers:", evenNumbers);`,
          output: `Multiplication table for 5:
5 x 1 = 5
5 x 2 = 10
5 x 3 = 15
5 x 4 = 20
5 x 5 = 25
5 x 6 = 30
5 x 7 = 35
5 x 8 = 40
5 x 9 = 45
5 x 10 = 50
Even numbers: [2, 4, 6, 8, 10]`,
          tips: [
            "Use for loops when you know the exact number of iterations",
            "Use while loops for condition-based iteration",
            "Be careful to avoid infinite loops by ensuring the condition eventually becomes false",
            "for...of is preferred for arrays, for...in for objects",
          ],
          prevSection: "conditionals",
          nextSection: "arrays",
        },
        {
          id: "arrays",
          title: "Arrays and Array Methods",
          content: `
# Arrays in JavaScript

Arrays are ordered collections of items. JavaScript provides many built-in methods to work with arrays efficiently.

## Creating Arrays

You can create arrays using array literals or the Array constructor.

## Common Array Methods

1. **push()**: Add elements to the end
2. **pop()**: Remove last element
3. **shift()**: Remove first element
4. **unshift()**: Add elements to the beginning
5. **slice()**: Extract a portion of array
6. **splice()**: Add/remove elements at specific position
7. **map()**: Transform each element
8. **filter()**: Filter elements based on condition
9. **reduce()**: Reduce array to single value
          `,
          codeExample: `// Creating arrays
const fruits = ["apple", "banana", "orange"];
const numbers = [1, 2, 3, 4, 5];
const mixed = ["hello", 42, true, null];

// Adding and removing elements
fruits.push("grape");           // Add to end
console.log(fruits);            // ["apple", "banana", "orange", "grape"]

const lastFruit = fruits.pop(); // Remove from end
console.log(lastFruit);         // "grape"

fruits.unshift("mango");        // Add to beginning
console.log(fruits);            // ["mango", "apple", "banana", "orange"]

// Array methods
const doubled = numbers.map(num => num * 2);
console.log(doubled);           // [2, 4, 6, 8, 10]

const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers);       // [2, 4]

const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum);               // 15`,
          tryItYourself: `// Working with a shopping cart
let cart = [];

// Add items to cart
cart.push({ name: "Laptop", price: 999 });
cart.push({ name: "Mouse", price: 25 });
cart.push({ name: "Keyboard", price: 75 });

console.log("Cart items:", cart);

// Calculate total price
const totalPrice = cart.reduce((total, item) => total + item.price, 0);
console.log("Total price: $" + totalPrice);

// Find expensive items (over $50)
const expensiveItems = cart.filter(item => item.price > 50);
console.log("Expensive items:", expensiveItems);

// Get just the names
const itemNames = cart.map(item => item.name);
console.log("Item names:", itemNames);`,
          output: `Cart items: [
  { name: "Laptop", price: 999 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 75 }
]
Total price: $1099
Expensive items: [
  { name: "Laptop", price: 999 },
  { name: "Keyboard", price: 75 }
]
Item names: ["Laptop", "Mouse", "Keyboard"]`,
          tips: [
            "Use map() to transform arrays, filter() to select elements",
            "reduce() is powerful for calculations and transformations",
            "Arrays are zero-indexed (first element is at index 0)",
            "Use const for arrays you won't reassign (you can still modify contents)",
          ],
          prevSection: "loops",
          nextSection: "objects",
        },
        {
          id: "objects",
          title: "Objects and Object Methods",
          content: `
# Objects in JavaScript

Objects are collections of key-value pairs. They are one of the most important data types in JavaScript and form the foundation of many programming concepts.

## Creating Objects

You can create objects using object literals, constructor functions, or Object.create().

## Object Properties and Methods

Objects can contain properties (data) and methods (functions).

## Accessing Object Properties

Use dot notation or bracket notation to access object properties.
          `,
          codeExample: `// Object literal
const person = {
    name: "John",
    age: 30,
    city: "New York",
    greet: function() {
        return "Hello, I'm " + this.name;
    }
};

// Accessing properties
console.log(person.name);        // "John"
console.log(person["age"]);      // 30

// Adding properties
person.email = "john@email.com";
person.sayAge = function() {
    return "I am " + this.age + " years old";
};

// Object methods
console.log(person.greet());     // "Hello, I'm John"
console.log(person.sayAge());    // "I am 30 years old"

// Object.keys, Object.values, Object.entries
console.log(Object.keys(person));    // ["name", "age", "city", "email", "greet", "sayAge"]
console.log(Object.values(person));  // Values array
console.log(Object.entries(person)); // [key, value] pairs

// Constructor function
function Car(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.start = function() {
        return this.make + " " + this.model + " is starting";
    };
}

const myCar = new Car("Toyota", "Camry", 2020);
console.log(myCar.start()); // "Toyota Camry is starting"`,
          tryItYourself: `// Create a student object with methods
const student = {
    name: "Alice",
    subjects: ["Math", "Science", "English"],
    grades: [85, 92, 78],

    addGrade: function(subject, grade) {
        this.subjects.push(subject);
        this.grades.push(grade);
    },

    getAverage: function() {
        const sum = this.grades.reduce((total, grade) => total + grade, 0);
        return sum / this.grades.length;
    },

    getInfo: function() {
        return \`\${this.name} studies \${this.subjects.length} subjects with an average of \${this.getAverage().toFixed(1)}\`;
    }
};

// Test the student object
console.log(student.getInfo());
student.addGrade("History", 88);
console.log("After adding History:");
console.log(student.getInfo());
console.log("Subjects:", student.subjects);
console.log("Grades:", student.grades);`,
          output: `Alice studies 3 subjects with an average of 85.0
After adding History:
Alice studies 4 subjects with an average of 85.8
Subjects: ["Math", "Science", "English", "History"]
Grades: [85, 92, 78, 88]`,
          tips: [
            "Use dot notation for known property names, bracket notation for dynamic properties",
            'Methods inside objects can access other properties using "this"',
            "Object.keys(), Object.values(), and Object.entries() are useful for iteration",
            "Constructor functions should start with a capital letter",
          ],
          prevSection: "arrays",
          nextSection: "strings",
        },
        {
          id: "strings",
          title: "String Methods and Manipulation",
          content: `
# String Methods in JavaScript

Strings are sequences of characters and JavaScript provides many built-in methods to manipulate them.

## Common String Methods

1. **length**: Get string length
2. **charAt()**: Get character at index
3. **indexOf()**: Find position of substring
4. **slice()**: Extract part of string
5. **split()**: Split string into array
6. **replace()**: Replace text
7. **toUpperCase()/toLowerCase()**: Change case
8. **trim()**: Remove whitespace

## Template Literals

Use backticks for string interpolation and multi-line strings.
          `,
          codeExample: `const text = "  Hello World  ";

// Basic properties and methods
console.log(text.length);           // 15
console.log(text.charAt(2));        // "H"
console.log(text.indexOf("World")); // 8

// Trimming and case conversion
console.log(text.trim());                    // "Hello World"
console.log(text.trim().toUpperCase());      // "HELLO WORLD"
console.log(text.trim().toLowerCase());      // "hello world"

// Slicing and substring
const greeting = "Hello World";
console.log(greeting.slice(0, 5));     // "Hello"
console.log(greeting.slice(6));        // "World"
console.log(greeting.substring(0, 5)); // "Hello"

// Splitting and joining
const words = greeting.split(" ");
console.log(words);                     // ["Hello", "World"]
console.log(words.join("-"));           // "Hello-World"

// Replacing text
console.log(greeting.replace("World", "JavaScript")); // "Hello JavaScript"
console.log(greeting.replaceAll("l", "L"));          // "HeLLo WorLd"

// Template literals
const name = "Alice";
const age = 25;
const message = \`Hello, my name is \${name} and I am \${age} years old.\`;
console.log(message);

// Multi-line strings
const poem = \`Roses are red,
Violets are blue,
JavaScript is awesome,
And so are you!\`;
console.log(poem);`,
          tryItYourself: `// String manipulation exercises
function analyzeText(text) {
    const cleaned = text.trim().toLowerCase();
    const words = cleaned.split(' ').filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = cleaned.length;
    const longestWord = words.reduce((longest, current) =>
        current.length > longest.length ? current : longest, '');

    return {
        original: text,
        cleaned: cleaned,
        wordCount: wordCount,
        charCount: charCount,
        longestWord: longestWord,
        summary: \`Text has \${wordCount} words and \${charCount} characters. Longest word: "\${longestWord}"\`
    };
}

// Test the function
const sampleText = "  JavaScript is a powerful programming language  ";
const analysis = analyzeText(sampleText);

console.log("Analysis Results:");
console.log("Original:", analysis.original);
console.log("Cleaned:", analysis.cleaned);
console.log("Word count:", analysis.wordCount);
console.log("Character count:", analysis.charCount);
console.log("Longest word:", analysis.longestWord);
console.log("Summary:", analysis.summary);`,
          output: `Analysis Results:
Original:   JavaScript is a powerful programming language
Cleaned: javascript is a powerful programming language
Word count: 6
Character count: 42
Longest word: programming
Summary: Text has 6 words and 42 characters. Longest word: "programming"`,
          tips: [
            "Strings are immutable - methods return new strings",
            "Use template literals for string interpolation",
            "indexOf() returns -1 if substring is not found",
            "slice() can take negative indices to count from the end",
          ],
          prevSection: "objects",
          nextSection: "error_handling",
        },
        {
          id: "error_handling",
          title: "Error Handling with Try-Catch",
          content: `
# Error Handling in JavaScript

Error handling allows your program to gracefully handle unexpected situations and continue running instead of crashing.

## Try-Catch-Finally

1. **try**: Code that might throw an error
2. **catch**: Handle the error if it occurs
3. **finally**: Code that always runs
4. **throw**: Manually throw an error

## Types of Errors

- SyntaxError: Invalid syntax
- ReferenceError: Variable not defined
- TypeError: Wrong data type
- RangeError: Number out of range

## Best Practices

Always handle errors gracefully and provide meaningful error messages.
          `,
          codeExample: `// Basic try-catch
try {
    let result = 10 / 0;
    console.log(result); // Infinity (not an error in JS)

    // This will cause an error
    let undefinedVar = someUndefinedVariable;
} catch (error) {
    console.log("An error occurred:", error.message);
    console.log("Error type:", error.name);
} finally {
    console.log("This always runs");
}

// Function with error handling
function divide(a, b) {
    try {
        if (b === 0) {
            throw new Error("Division by zero is not allowed");
        }
        return a / b;
    } catch (error) {
        console.error("Error in divide function:", error.message);
        return null;
    }
}

console.log(divide(10, 2)); // 5
console.log(divide(10, 0)); // null (with error message)

// Handling JSON parsing errors
function parseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("Invalid JSON format:", error.message);
        } else {
            console.error("Unexpected error:", error.message);
        }
        return null;
    }
}

console.log(parseJSON('{"name": "John"}')); // {name: "John"}
console.log(parseJSON('invalid json'));     // null (with error message)`,
          tryItYourself: `// Create a safe calculator with error handling
class SafeCalculator {
    static add(a, b) {
        try {
            if (typeof a !== 'number' || typeof b !== 'number') {
                throw new TypeError("Both arguments must be numbers");
            }
            return a + b;
        } catch (error) {
            console.error("Addition error:", error.message);
            return NaN;
        }
    }

    static divide(a, b) {
        try {
            if (typeof a !== 'number' || typeof b !== 'number') {
                throw new TypeError("Both arguments must be numbers");
            }
            if (b === 0) {
                throw new Error("Cannot divide by zero");
            }
            return a / b;
        } catch (error) {
            console.error("Division error:", error.message);
            return NaN;
        }
    }

    static sqrt(a) {
        try {
            if (typeof a !== 'number') {
                throw new TypeError("Argument must be a number");
            }
            if (a < 0) {
                throw new RangeError("Cannot calculate square root of negative number");
            }
            return Math.sqrt(a);
        } catch (error) {
            console.error("Square root error:", error.message);
            return NaN;
        }
    }
}

// Test the calculator
console.log("Valid operations:");
console.log("5 + 3 =", SafeCalculator.add(5, 3));
console.log("10 / 2 =", SafeCalculator.divide(10, 2));
console.log("√16 =", SafeCalculator.sqrt(16));

console.log("\\nInvalid operations:");
console.log("5 + 'hello' =", SafeCalculator.add(5, "hello"));
console.log("10 / 0 =", SafeCalculator.divide(10, 0));
console.log("√(-4) =", SafeCalculator.sqrt(-4));`,
          output: `Valid operations:
5 + 3 = 8
10 / 2 = 5
√16 = 4

Invalid operations:
Addition error: Both arguments must be numbers
5 + 'hello' = NaN
Division error: Cannot divide by zero
10 / 0 = NaN
Square root error: Cannot calculate square root of negative number
√(-4) = NaN`,
          tips: [
            "Always use try-catch for operations that might fail",
            "Provide specific error messages to help with debugging",
            "Use finally block for cleanup code that must run",
            "Consider using custom error types for different error conditions",
          ],
          prevSection: "strings",
        },
      ],
    },
    {
      id: "js_dom",
      title: "DOM Manipulation",
      description: "Learn how to interact with HTML elements using JavaScript",
      difficulty: "intermediate",
      estimatedTime: "3 hours",
      prerequisites: ["JavaScript Basics", "HTML knowledge"],
      whatYouWillLearn: [
        "Selecting HTML elements",
        "Modifying element content and attributes",
        "Event handling",
        "Creating dynamic web pages",
      ],
      sections: [
        {
          id: "selecting_elements",
          title: "Selecting HTML Elements",
          content: `
# Selecting HTML Elements

The Document Object Model (DOM) allows JavaScript to interact with HTML elements. You can select elements using various methods.

## Common Selection Methods

1. **getElementById()**: Select by ID attribute
2. **getElementsByClassName()**: Select by class name
3. **getElementsByTagName()**: Select by tag name
4. **querySelector()**: Select using CSS selectors
5. **querySelectorAll()**: Select all matching CSS selectors
          `,
          codeExample: `// HTML structure:
// <div id="main">
//   <p class="text">Hello World</p>
//   <button id="btn">Click Me</button>
// </div>

// Select by ID
const mainDiv = document.getElementById('main');
const button = document.getElementById('btn');

// Select by class name
const textElements = document.getElementsByClassName('text');
const firstText = textElements[0];

// Select by tag name
const allParagraphs = document.getElementsByTagName('p');

// Select using CSS selectors
const mainDiv2 = document.querySelector('#main');
const textPara = document.querySelector('.text');
const allTexts = document.querySelectorAll('.text');

console.log(mainDiv);     // <div id="main">...</div>
console.log(textPara);    // <p class="text">Hello World</p>`,
          tryItYourself: `// Try selecting different elements
// Assume you have this HTML:
// <div class="container">
//   <h1 id="title">My Website</h1>
//   <p class="description">Welcome to my site</p>
//   <button class="btn primary">Get Started</button>
// </div>

const title = document.getElementById('title');
const description = document.querySelector('.description');
const button = document.querySelector('.btn.primary');

console.log(title.textContent);
console.log(description.textContent);
console.log(button.textContent);`,
          output: `My Website
Welcome to my site
Get Started`,
          tips: [
            "querySelector is more flexible than older methods",
            "Use querySelectorAll when you need multiple elements",
            "Always check if element exists before using it",
            "getElementById is faster for single element selection",
          ],
          nextSection: "modifying_elements",
        },
        {
          id: "modifying_elements",
          title: "Modifying HTML Elements",
          content: `
# Modifying HTML Elements

Once you've selected elements, you can modify their content, attributes, and styles using JavaScript.

## Common Modification Methods

1. **textContent**: Change text content
2. **innerHTML**: Change HTML content
3. **setAttribute()**: Set attributes
4. **style**: Modify CSS styles
5. **classList**: Add/remove CSS classes

## Best Practices

Always check if element exists before modifying it to avoid errors.
          `,
          codeExample: `// Modifying text content
const title = document.getElementById('title');
if (title) {
    title.textContent = 'New Title';
}

// Modifying HTML content
const container = document.querySelector('.container');
if (container) {
    container.innerHTML = '<p>New <strong>HTML</strong> content</p>';
}

// Modifying attributes
const image = document.querySelector('img');
if (image) {
    image.setAttribute('src', 'new-image.jpg');
    image.setAttribute('alt', 'New image description');
}

// Modifying styles
const button = document.querySelector('.btn');
if (button) {
    button.style.backgroundColor = 'blue';
    button.style.color = 'white';
    button.style.padding = '10px 20px';
}

// Working with classes
const element = document.querySelector('.box');
if (element) {
    element.classList.add('active');
    element.classList.remove('inactive');
    element.classList.toggle('highlighted');
}`,
          tryItYourself: `// Create a simple color changer
const colorButton = document.createElement('button');
colorButton.textContent = 'Change Color';
document.body.appendChild(colorButton);

const colors = ['red', 'blue', 'green', 'purple', 'orange'];
let currentColorIndex = 0;

colorButton.addEventListener('click', function() {
    document.body.style.backgroundColor = colors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % colors.length;

    // Update button text
    const nextColor = colors[currentColorIndex];
    colorButton.textContent = \`Next: \${nextColor}\`;
});

console.log('Color changer button created!');`,
          output: `Color changer button created!
// Button will cycle through colors when clicked`,
          tips: [
            "Use textContent for plain text, innerHTML for HTML content",
            "Always check if element exists before modifying",
            "classList methods are safer than directly modifying className",
            "Use CSS classes instead of inline styles when possible",
          ],
          prevSection: "selecting_elements",
          nextSection: "events",
        },
        {
          id: "events",
          title: "Event Handling",
          content: `
# Event Handling in JavaScript

Events allow you to respond to user interactions like clicks, key presses, and form submissions.

## Common Events

1. **click**: Mouse click
2. **keydown/keyup**: Keyboard input
3. **submit**: Form submission
4. **load**: Page/image loading
5. **resize**: Window resize
6. **scroll**: Page scrolling

## Event Listeners

Use addEventListener() to attach event handlers to elements.
          `,
          codeExample: `// Click event
const button = document.querySelector('#myButton');
button.addEventListener('click', function(event) {
    console.log('Button clicked!');
    console.log('Event type:', event.type);
});

// Keyboard events
document.addEventListener('keydown', function(event) {
    console.log('Key pressed:', event.key);
    if (event.key === 'Enter') {
        console.log('Enter key pressed!');
    }
});

// Form submission
const form = document.querySelector('#myForm');
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    console.log('Form submitted!');

    // Get form data
    const formData = new FormData(form);
    console.log('Form data:', Object.fromEntries(formData));
});

// Mouse events
const box = document.querySelector('.box');
box.addEventListener('mouseenter', function() {
    this.style.backgroundColor = 'lightblue';
});

box.addEventListener('mouseleave', function() {
    this.style.backgroundColor = 'white';
});`,
          tryItYourself: `// Create an interactive counter
let count = 0;

// Create elements
const counterDiv = document.createElement('div');
const countDisplay = document.createElement('h2');
const incrementBtn = document.createElement('button');
const decrementBtn = document.createElement('button');
const resetBtn = document.createElement('button');

// Set up elements
countDisplay.textContent = count;
incrementBtn.textContent = '+';
decrementBtn.textContent = '-';
resetBtn.textContent = 'Reset';

// Add event listeners
incrementBtn.addEventListener('click', function() {
    count++;
    countDisplay.textContent = count;
});

decrementBtn.addEventListener('click', function() {
    count--;
    countDisplay.textContent = count;
});

resetBtn.addEventListener('click', function() {
    count = 0;
    countDisplay.textContent = count;
});

// Add to page
counterDiv.appendChild(countDisplay);
counterDiv.appendChild(incrementBtn);
counterDiv.appendChild(decrementBtn);
counterDiv.appendChild(resetBtn);
document.body.appendChild(counterDiv);

console.log('Interactive counter created!');`,
          output: `Interactive counter created!
// Counter with +, -, and Reset buttons will appear on page`,
          tips: [
            "Use addEventListener() instead of onclick for better control",
            "event.preventDefault() stops default browser behavior",
            "Use event.target to get the element that triggered the event",
            "Remove event listeners when no longer needed to prevent memory leaks",
          ],
          prevSection: "modifying_elements",
        },
      ],
    },
    {
      id: "js_advanced",
      title: "Advanced JavaScript Concepts",
      description: "Master advanced JavaScript concepts and modern features",
      difficulty: "advanced",
      estimatedTime: "4 hours",
      prerequisites: ["JavaScript Basics", "DOM Manipulation"],
      whatYouWillLearn: [
        "ES6+ features and modern syntax",
        "Asynchronous programming patterns",
        "Object-oriented programming",
        "Functional programming concepts",
      ],
      sections: [
        {
          id: "es6_features",
          title: "ES6+ Modern Features",
          content: `
# ES6+ Modern JavaScript Features

ES6 (ECMAScript 2015) and later versions introduced many powerful features that make JavaScript more expressive and easier to work with.

## Key ES6+ Features

1. **Arrow Functions**: Shorter function syntax
2. **Template Literals**: String interpolation
3. **Destructuring**: Extract values from arrays/objects
4. **Spread/Rest Operators**: Expand or collect elements
5. **Classes**: Object-oriented syntax
6. **Modules**: Import/export functionality
7. **Promises**: Better async handling
8. **let/const**: Block-scoped variables

## Modern JavaScript Best Practices

Use these features to write cleaner, more maintainable code.
          `,
          codeExample: `// Arrow functions
const add = (a, b) => a + b;
const multiply = (a, b) => {
    const result = a * b;
    return result;
};

// Template literals
const name = "JavaScript";
const version = "ES6+";
const message = \`Learning \${name} \${version} is awesome!\`;

// Destructuring
const person = { name: "John", age: 30, city: "NYC" };
const { name: personName, age } = person;
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };

// Classes
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        return \`\${this.name} makes a sound\`;
    }
}

class Dog extends Animal {
    speak() {
        return \`\${this.name} barks\`;
    }
}

const dog = new Dog("Buddy");
console.log(dog.speak()); // "Buddy barks"

// Default parameters
function greet(name = "World") {
    return \`Hello, \${name}!\`;
}

console.log(greet());        // "Hello, World!"
console.log(greet("Alice")); // "Hello, Alice!"`,
          tryItYourself: `// Create a modern JavaScript utility library
class ModernUtils {
    // Static method with default parameters
    static formatCurrency(amount, currency = 'USD', locale = 'en-US') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Method using destructuring and spread
    static mergeObjects(...objects) {
        return objects.reduce((merged, obj) => ({ ...merged, ...obj }), {});
    }

    // Method using array destructuring
    static getMinMax(numbers) {
        const [first, ...rest] = numbers.sort((a, b) => a - b);
        return {
            min: first,
            max: rest[rest.length - 1] || first
        };
    }

    // Method using template literals
    static createSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
}

// Using the utility class
console.log("Currency formatting:");
console.log(ModernUtils.formatCurrency(1234.56));
console.log(ModernUtils.formatCurrency(1234.56, 'EUR', 'de-DE'));

console.log("\\nObject merging:");
const user = { name: "John", age: 30 };
const preferences = { theme: "dark", language: "en" };
const settings = { notifications: true };
const merged = ModernUtils.mergeObjects(user, preferences, settings);
console.log(merged);

console.log("\\nMin/Max finder:");
const numbers = [45, 12, 78, 23, 67];
console.log(ModernUtils.getMinMax(numbers));

console.log("\\nSlug creation:");
console.log(ModernUtils.createSlug("Hello World! This is a Test."));`,
          output: `Currency formatting:
$1,234.56
1.234,56 €

Object merging:
{ name: "John", age: 30, theme: "dark", language: "en", notifications: true }

Min/Max finder:
{ min: 12, max: 78 }

Slug creation:
hello-world-this-is-a-test`,
          tips: [
            "Use arrow functions for short, simple functions",
            "Destructuring makes code more readable and concise",
            "Spread operator is great for copying and merging",
            "Template literals are more readable than string concatenation",
          ],
          nextSection: "async_advanced",
        },
        {
          id: "async_advanced",
          title: "Advanced Asynchronous Programming",
          content: `
# Advanced Asynchronous Programming

Modern JavaScript provides powerful tools for handling asynchronous operations efficiently.

## Advanced Async Patterns

1. **Promise.all()**: Run multiple promises in parallel
2. **Promise.race()**: Get the first resolved promise
3. **Promise.allSettled()**: Wait for all promises to settle
4. **Async iterators**: Handle streams of data
5. **Error handling**: Robust error management

## Performance Considerations

Understanding when to use parallel vs sequential execution.
          `,
          codeExample: `// Advanced Promise patterns
async function fetchUserData(userId) {
    const response = await fetch(\`/api/users/\${userId}\`);
    return response.json();
}

async function fetchUserPosts(userId) {
    const response = await fetch(\`/api/users/\${userId}/posts\`);
    return response.json();
}

// Parallel execution with Promise.all
async function loadUserProfile(userId) {
    try {
        const [user, posts] = await Promise.all([
            fetchUserData(userId),
            fetchUserPosts(userId)
        ]);

        return { user, posts };
    } catch (error) {
        console.error('Error loading user profile:', error);
        throw error;
    }
}

// Promise.race for timeout handling
function withTimeout(promise, timeoutMs) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
    });

    return Promise.race([promise, timeout]);
}

// Promise.allSettled for handling mixed results
async function processMultipleOperations() {
    const operations = [
        fetch('/api/data1'),
        fetch('/api/data2'),
        fetch('/api/data3')
    ];

    const results = await Promise.allSettled(operations);

    const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

    const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

    return { successful, failed };
}

// Async generator for streaming data
async function* fetchDataStream() {
    for (let i = 1; i <= 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        yield { id: i, data: \`Item \${i}\` };
    }
}

// Using async generator
async function processStream() {
    for await (const item of fetchDataStream()) {
        console.log('Received:', item);
    }
}`,
          tryItYourself: `// Create an advanced API client
class APIClient {
    constructor(baseURL, timeout = 5000) {
        this.baseURL = baseURL;
        this.timeout = timeout;
    }

    async request(endpoint, options = {}) {
        const url = \`\${this.baseURL}\${endpoint}\`;
        const controller = new AbortController();

        // Set up timeout
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        }
    }

    async batchRequests(endpoints) {
        const requests = endpoints.map(endpoint =>
            this.request(endpoint).catch(error => ({ error: error.message }))
        );

        return await Promise.allSettled(requests);
    }

    async retryRequest(endpoint, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.request(endpoint);
            } catch (error) {
                if (attempt === maxRetries) {
                    throw new Error(\`Failed after \${maxRetries} attempts: \${error.message}\`);
                }

                console.log(\`Attempt \${attempt} failed, retrying in \${delay}ms...\`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
}

// Simulate API usage
const api = new APIClient('https://jsonplaceholder.typicode.com');

async function demonstrateAPIClient() {
    try {
        console.log("Single request:");
        const user = await api.request('/users/1');
        console.log('User:', user.name);

        console.log("\\nBatch requests:");
        const results = await api.batchRequests(['/users/1', '/users/2', '/users/999']);
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(\`Request \${index + 1}: Success\`);
            } else {
                console.log(\`Request \${index + 1}: Failed\`);
            }
        });

        console.log("\\nRetry mechanism:");
        await api.retryRequest('/users/1');
        console.log("Retry successful!");

    } catch (error) {
        console.error('API Error:', error.message);
    }
}

demonstrateAPIClient();`,
          output: `Single request:
User: Leanne Graham

Batch requests:
Request 1: Success
Request 2: Success
Request 3: Failed

Retry mechanism:
Retry successful!`,
          tips: [
            "Use Promise.all() for parallel operations to improve performance",
            "Implement proper error handling and timeouts for robust applications",
            "Consider using Promise.allSettled() when some operations can fail",
            "Use async generators for handling streams of data",
          ],
          prevSection: "es6_features",
        },
      ],
    },
  ],

  python: [
    {
      id: "py_basics",
      title: "Python Fundamentals",
      description: "Master the basics of Python programming",
      difficulty: "beginner",
      estimatedTime: "3 hours",
      prerequisites: ["Basic programming concepts"],
      whatYouWillLearn: [
        "Python syntax and indentation",
        "Variables and data types",
        "Control structures",
        "Functions and modules",
      ],
      sections: [
        {
          id: "python_syntax",
          title: "Python Syntax and Indentation",
          content: `
# Python Syntax

Python is known for its clean, readable syntax. Unlike many programming languages, Python uses indentation to define code blocks instead of curly braces.

## Key Features

1. **Indentation**: Python uses indentation (spaces or tabs) to group statements
2. **No Semicolons**: Statements end with a newline, not semicolons
3. **Case Sensitive**: Variable names are case sensitive
4. **Comments**: Use # for single-line comments, """ for multi-line

## The Zen of Python

Python follows the principle of "Beautiful is better than ugly" and "Simple is better than complex."
          `,
          codeExample: `# This is a comment
print("Hello, World!")  # This prints a message

# Variables (no declaration needed)
name = "Python"
version = 3.9
is_awesome = True

# Indentation is crucial in Python
if is_awesome:
    print(f"{name} {version} is awesome!")
    print("Learning Python is fun!")
else:
    print("Something is wrong...")

# Multi-line strings
description = """
Python is a high-level,
interpreted programming language
with dynamic semantics.
"""

print(description)`,
          tryItYourself: `# Try writing your own Python code
my_name = "Your Name"
my_age = 25
is_student = True

# Use f-strings for formatting
print(f"Hi, I'm {my_name}")
print(f"I am {my_age} years old")

if is_student:
    print("I am currently a student")
else:
    print("I am not a student")`,
          output: `Hello, World!
Python 3.9 is awesome!
Learning Python is fun!

Python is a high-level,
interpreted programming language
with dynamic semantics.

Hi, I'm Your Name
I am 25 years old
I am currently a student`,
          tips: [
            "Use 4 spaces for indentation (PEP 8 standard)",
            "Be consistent with indentation throughout your code",
            "Use meaningful variable names",
            "Follow PEP 8 style guide for clean code",
          ],
          nextSection: "data_types",
        },
        {
          id: "data_types",
          title: "Python Data Types",
          content: `
# Python Data Types

Python has several built-in data types that are essential for programming.

## Basic Data Types

1. **int**: Integer numbers
2. **float**: Decimal numbers
3. **str**: Text strings
4. **bool**: True/False values
5. **list**: Ordered, mutable collections
6. **tuple**: Ordered, immutable collections
7. **dict**: Key-value pairs
8. **set**: Unordered, unique collections

## Type Checking

Use the type() function to check the type of any variable.
          `,
          codeExample: `# Numbers
age = 25                    # int
height = 5.9               # float
temperature = -10          # int (negative)
pi = 3.14159              # float

# Strings
name = "Alice"
message = 'Hello World'
multiline = """This is a
multiline string"""

# Boolean
is_student = True
is_working = False

# Lists (mutable)
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]

# Tuples (immutable)
coordinates = (10, 20)
rgb_color = (255, 128, 0)

# Dictionaries
person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}

# Sets
unique_numbers = {1, 2, 3, 4, 5}
colors = {"red", "green", "blue"}

# Type checking
print(type(age))           # <class 'int'>
print(type(name))          # <class 'str'>
print(type(fruits))        # <class 'list'>`,
          tryItYourself: `# Create a student record
student = {
    "name": "Emma",
    "age": 20,
    "grades": [85, 92, 78, 96],
    "is_enrolled": True,
    "subjects": ("Math", "Science", "English")
}

# Print student information
print(f"Student: {student['name']}")
print(f"Age: {student['age']}")
print(f"Enrolled: {student['is_enrolled']}")

# Calculate average grade
average_grade = sum(student['grades']) / len(student['grades'])
print(f"Average grade: {average_grade:.1f}")

# Print subjects
print("Subjects:")
for subject in student['subjects']:
    print(f"  - {subject}")

# Check data types
print(f"Name type: {type(student['name'])}")
print(f"Grades type: {type(student['grades'])}")
print(f"Subjects type: {type(student['subjects'])}")`,
          output: `Student: Emma
Age: 20
Enrolled: True
Average grade: 87.8
Subjects:
  - Math
  - Science
  - English
Name type: <class 'str'>
Grades type: <class 'list'>
Subjects type: <class 'tuple'>`,
          tips: [
            "Lists are mutable (can be changed), tuples are immutable",
            "Use dictionaries for key-value relationships",
            "Sets automatically remove duplicates",
            "Use isinstance() to check if object is of specific type",
          ],
          prevSection: "python_syntax",
          nextSection: "control_flow",
        },
        {
          id: "control_flow",
          title: "Control Flow in Python",
          content: `
# Control Flow in Python

Control flow statements allow you to control the execution of your program based on conditions and loops.

## Conditional Statements

1. **if**: Execute code if condition is true
2. **elif**: Check additional conditions
3. **else**: Execute code if no conditions are true

## Loops

1. **for**: Iterate over sequences
2. **while**: Loop while condition is true
3. **break**: Exit loop early
4. **continue**: Skip to next iteration

## Comparison Operators

Use ==, !=, <, >, <=, >= for comparisons.
          `,
          codeExample: `# If-elif-else statements
score = 85

if score >= 90:
    grade = "A"
    print("Excellent!")
elif score >= 80:
    grade = "B"
    print("Good job!")
elif score >= 70:
    grade = "C"
    print("Not bad!")
else:
    grade = "F"
    print("Need improvement!")

print(f"Your grade is: {grade}")

# For loops
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(f"I like {fruit}")

# Range function
for i in range(5):
    print(f"Number: {i}")

# While loop
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1

# Loop control
for num in range(10):
    if num == 3:
        continue  # Skip 3
    if num == 7:
        break     # Stop at 7
    print(num)`,
          tryItYourself: `# Number guessing game
import random

secret_number = random.randint(1, 10)
max_attempts = 3
attempts = 0

print("Guess the number between 1 and 10!")
print(f"You have {max_attempts} attempts.")

while attempts < max_attempts:
    try:
        guess = int(input("Enter your guess: "))
        attempts += 1

        if guess == secret_number:
            print(f"Congratulations! You guessed it in {attempts} attempts!")
            break
        elif guess < secret_number:
            print("Too low!")
        else:
            print("Too high!")

        if attempts < max_attempts:
            print(f"Attempts remaining: {max_attempts - attempts}")
    except ValueError:
        print("Please enter a valid number!")
        attempts -= 1  # Don't count invalid input

if attempts == max_attempts and guess != secret_number:
    print(f"Game over! The number was {secret_number}")`,
          output: `Guess the number between 1 and 10!
You have 3 attempts.
Enter your guess: 5
Too low!
Attempts remaining: 2
Enter your guess: 8
Too high!
Attempts remaining: 1
Enter your guess: 7
Congratulations! You guessed it in 3 attempts!`,
          tips: [
            "Use elif instead of multiple if statements for better performance",
            "range(n) generates numbers from 0 to n-1",
            "break exits the loop, continue skips to next iteration",
            "Use try-except for error handling with user input",
          ],
          prevSection: "data_types",
          nextSection: "functions",
        },
        {
          id: "functions",
          title: "Functions in Python",
          content: `
# Functions in Python

Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.

## Function Definition

Use the def keyword to define functions. Functions can accept parameters and return values.

## Function Features

1. **Parameters**: Input values for functions
2. **Default parameters**: Parameters with default values
3. **Return values**: Output from functions
4. **Docstrings**: Function documentation
5. **Lambda functions**: Short, anonymous functions

## Scope

Variables defined inside functions have local scope.
          `,
          codeExample: `# Basic function
def greet(name):
    """Greet a person by name."""
    return f"Hello, {name}!"

# Function with default parameter
def introduce(name, age=25):
    return f"Hi, I'm {name} and I'm {age} years old."

# Function with multiple parameters
def calculate_area(length, width):
    """Calculate the area of a rectangle."""
    area = length * width
    return area

# Function with multiple return values
def get_name_parts(full_name):
    parts = full_name.split()
    first_name = parts[0]
    last_name = parts[-1] if len(parts) > 1 else ""
    return first_name, last_name

# Using functions
message = greet("Alice")
print(message)

intro1 = introduce("Bob")
intro2 = introduce("Carol", 30)
print(intro1)
print(intro2)

area = calculate_area(10, 5)
print(f"Area: {area}")

first, last = get_name_parts("John Doe")
print(f"First: {first}, Last: {last}")

# Lambda function
square = lambda x: x ** 2
print(f"Square of 5: {square(5)}")`,
          tryItYourself: `# Create a simple calculator
def add(a, b):
    """Add two numbers."""
    return a + b

def subtract(a, b):
    """Subtract second number from first."""
    return a - b

def multiply(a, b):
    """Multiply two numbers."""
    return a * b

def divide(a, b):
    """Divide first number by second."""
    if b != 0:
        return a / b
    else:
        return "Error: Division by zero!"

def calculator(operation, num1, num2):
    """Perform calculation based on operation."""
    operations = {
        '+': add,
        '-': subtract,
        '*': multiply,
        '/': divide
    }

    if operation in operations:
        result = operations[operation](num1, num2)
        return f"{num1} {operation} {num2} = {result}"
    else:
        return "Error: Invalid operation!"

# Test the calculator
print(calculator('+', 10, 5))
print(calculator('-', 10, 5))
print(calculator('*', 10, 5))
print(calculator('/', 10, 5))
print(calculator('/', 10, 0))`,
          output: `10 + 5 = 15
10 - 5 = 5
10 * 5 = 50
10 / 5 = 2.0
10 / 0 = Error: Division by zero!`,
          tips: [
            "Use docstrings to document your functions",
            "Functions should do one thing well (single responsibility)",
            "Use descriptive function and parameter names",
            "Return values instead of printing when possible for reusability",
          ],
          prevSection: "control_flow",
          nextSection: "modules",
        },
        {
          id: "modules",
          title: "Python Modules and Packages",
          content: `
# Python Modules and Packages

Modules are files containing Python code that can be imported and used in other programs. Packages are collections of modules.

## Importing Modules

1. **import**: Import entire module
2. **from...import**: Import specific functions/classes
3. **import...as**: Import with alias
4. **from...import ***: Import everything (not recommended)

## Standard Library

Python comes with a rich standard library of built-in modules.

## Creating Your Own Modules

You can create your own modules by saving Python code in .py files.
          `,
          codeExample: `# Importing standard library modules
import math
import random
import datetime
from collections import Counter
import json

# Using imported modules
print(math.pi)                    # 3.141592653589793
print(math.sqrt(16))             # 4.0
print(random.randint(1, 10))     # Random number between 1-10

# Working with dates
now = datetime.datetime.now()
print(f"Current time: {now}")

# Using Counter from collections
text = "hello world"
letter_count = Counter(text)
print(letter_count)              # Counter({'l': 3, 'o': 2, 'h': 1, 'e': 1, ' ': 1, 'w': 1, 'r': 1, 'd': 1})

# Working with JSON
data = {"name": "John", "age": 30}
json_string = json.dumps(data)
print(json_string)               # {"name": "John", "age": 30}

# Import with alias
import numpy as np  # Common convention
# np.array([1, 2, 3])  # Would work if numpy was installed

# Import specific functions
from math import sqrt, pow
print(sqrt(25))                  # 5.0
print(pow(2, 3))                 # 8.0`,
          tryItYourself: `# Create a utility module simulation
class MathUtils:
    @staticmethod
    def factorial(n):
        if n <= 1:
            return 1
        return n * MathUtils.factorial(n - 1)

    @staticmethod
    def is_prime(n):
        if n < 2:
            return False
        for i in range(2, int(n ** 0.5) + 1):
            if n % i == 0:
                return False
        return True

    @staticmethod
    def fibonacci(n):
        if n <= 1:
            return n
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b

class StringUtils:
    @staticmethod
    def reverse_words(text):
        return ' '.join(text.split()[::-1])

    @staticmethod
    def count_vowels(text):
        vowels = 'aeiouAEIOU'
        return sum(1 for char in text if char in vowels)

    @staticmethod
    def is_palindrome(text):
        cleaned = ''.join(text.lower().split())
        return cleaned == cleaned[::-1]

# Using our utility classes
print("Math Utils:")
print(f"Factorial of 5: {MathUtils.factorial(5)}")
print(f"Is 17 prime? {MathUtils.is_prime(17)}")
print(f"10th Fibonacci number: {MathUtils.fibonacci(10)}")

print("\\nString Utils:")
print(f"Reverse words: {StringUtils.reverse_words('Hello World Python')}")
print(f"Vowel count: {StringUtils.count_vowels('Programming')}")
print(f"Is palindrome? {StringUtils.is_palindrome('A man a plan a canal Panama')}")`,
          output: `Math Utils:
Factorial of 5: 120
Is 17 prime? True
10th Fibonacci number: 55

String Utils:
Reverse words: Python World Hello
Vowel count: 3
Is palindrome? True`,
          tips: [
            "Use import statements at the top of your file",
            "Prefer specific imports over importing everything with *",
            "Use aliases for long module names or common conventions",
            "Organize related functions into classes or separate modules",
          ],
          prevSection: "functions",
          nextSection: "file_handling",
        },
        {
          id: "file_handling",
          title: "File Handling in Python",
          content: `
# File Handling in Python

Python provides built-in functions to work with files. You can read, write, and manipulate files easily.

## File Operations

1. **open()**: Open a file
2. **read()**: Read file content
3. **write()**: Write to file
4. **close()**: Close file
5. **with**: Context manager for automatic file closing

## File Modes

- 'r': Read (default)
- 'w': Write (overwrites existing)
- 'a': Append
- 'x': Create new file
- 'b': Binary mode
- 't': Text mode (default)

## Best Practices

Always use context managers (with statement) for file operations.
          `,
          codeExample: `# Writing to a file
with open('example.txt', 'w') as file:
    file.write("Hello, World!\\n")
    file.write("This is a Python file handling example.\\n")
    file.write("Learning Python is fun!")

print("File written successfully!")

# Reading from a file
with open('example.txt', 'r') as file:
    content = file.read()
    print("File content:")
    print(content)

# Reading line by line
with open('example.txt', 'r') as file:
    print("\\nReading line by line:")
    for line_number, line in enumerate(file, 1):
        print(f"Line {line_number}: {line.strip()}")

# Appending to a file
with open('example.txt', 'a') as file:
    file.write("\\nThis line was appended!")

# Reading specific lines
with open('example.txt', 'r') as file:
    lines = file.readlines()
    print(f"\\nTotal lines: {len(lines)}")
    print(f"First line: {lines[0].strip()}")
    print(f"Last line: {lines[-1].strip()}")`,
          tryItYourself: `# Create a simple log file manager
import datetime

class LogManager:
    def __init__(self, filename):
        self.filename = filename

    def write_log(self, message, level="INFO"):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {level}: {message}\\n"

        with open(self.filename, 'a') as file:
            file.write(log_entry)
        print(f"Log written: {log_entry.strip()}")

    def read_logs(self):
        try:
            with open(self.filename, 'r') as file:
                logs = file.readlines()
                return [log.strip() for log in logs]
        except FileNotFoundError:
            return []

    def clear_logs(self):
        with open(self.filename, 'w') as file:
            file.write("")
        print("Logs cleared!")

    def get_log_count(self):
        logs = self.read_logs()
        return len(logs)

# Using the LogManager
logger = LogManager('app.log')

# Write some logs
logger.write_log("Application started")
logger.write_log("User logged in", "INFO")
logger.write_log("Database connection failed", "ERROR")
logger.write_log("Processing completed", "SUCCESS")

# Read logs
print(f"\\nTotal log entries: {logger.get_log_count()}")
print("\\nAll logs:")
for log in logger.read_logs():
    print(log)`,
          output: `Log written: [2024-01-15 10:30:45] INFO: Application started
Log written: [2024-01-15 10:30:45] INFO: User logged in
Log written: [2024-01-15 10:30:45] ERROR: Database connection failed
Log written: [2024-01-15 10:30:45] SUCCESS: Processing completed

Total log entries: 4

All logs:
[2024-01-15 10:30:45] INFO: Application started
[2024-01-15 10:30:45] INFO: User logged in
[2024-01-15 10:30:45] ERROR: Database connection failed
[2024-01-15 10:30:45] SUCCESS: Processing completed`,
          tips: [
            "Always use 'with' statement for automatic file closing",
            "Handle FileNotFoundError when reading files",
            "Use appropriate file modes for your needs",
            "Consider using pathlib for more advanced file operations",
          ],
          prevSection: "modules",
          nextSection: "error_handling_py",
        },
        {
          id: "error_handling_py",
          title: "Exception Handling in Python",
          content: `
# Exception Handling in Python

Exception handling allows your program to gracefully handle errors and continue execution.

## Try-Except-Finally

1. **try**: Code that might raise an exception
2. **except**: Handle specific exceptions
3. **else**: Code that runs if no exception occurs
4. **finally**: Code that always runs
5. **raise**: Manually raise an exception

## Common Exceptions

- ValueError: Invalid value
- TypeError: Wrong type
- FileNotFoundError: File doesn't exist
- IndexError: List index out of range
- KeyError: Dictionary key doesn't exist

## Best Practices

Be specific with exception types and provide helpful error messages.
          `,
          codeExample: `# Basic exception handling
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("Please enter a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
else:
    print("Operation completed successfully!")
finally:
    print("This always executes")

# Multiple exceptions in one except block
try:
    data = {"name": "John", "age": 30}
    print(data["email"])  # KeyError
except (KeyError, ValueError, TypeError) as e:
    print(f"Error: {e}")

# Custom exception handling function
def safe_divide(a, b):
    try:
        if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
            raise TypeError("Both arguments must be numbers")
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b
    except (TypeError, ValueError) as e:
        print(f"Error in division: {e}")
        return None

print(safe_divide(10, 2))    # 5.0
print(safe_divide(10, 0))    # None (with error message)
print(safe_divide("10", 2))  # None (with error message)`,
          tryItYourself: `# Create a robust data processor
class DataProcessor:
    def __init__(self):
        self.data = []

    def add_number(self, value):
        try:
            number = float(value)
            self.data.append(number)
            print(f"Added: {number}")
        except ValueError:
            print(f"Error: '{value}' is not a valid number")
        except Exception as e:
            print(f"Unexpected error: {e}")

    def get_average(self):
        try:
            if not self.data:
                raise ValueError("No data available to calculate average")
            return sum(self.data) / len(self.data)
        except ValueError as e:
            print(f"Error: {e}")
            return None

    def get_item(self, index):
        try:
            return self.data[index]
        except IndexError:
            print(f"Error: Index {index} is out of range (0-{len(self.data)-1})")
            return None
        except TypeError:
            print("Error: Index must be an integer")
            return None

    def save_to_file(self, filename):
        try:
            with open(filename, 'w') as file:
                for number in self.data:
                    file.write(f"{number}\\n")
            print(f"Data saved to {filename}")
        except PermissionError:
            print(f"Error: Permission denied to write to {filename}")
        except Exception as e:
            print(f"Error saving file: {e}")

# Test the DataProcessor
processor = DataProcessor()

# Add various types of data
processor.add_number("10.5")    # Valid
processor.add_number("20")      # Valid
processor.add_number("abc")     # Invalid
processor.add_number(30.7)      # Valid

print(f"\\nAverage: {processor.get_average()}")
print(f"First item: {processor.get_item(0)}")
print(f"Invalid index: {processor.get_item(10)}")

processor.save_to_file("data.txt")`,
          output: `Added: 10.5
Added: 20.0
Error: 'abc' is not a valid number
Added: 30.7

Average: 20.4
First item: 10.5
Error: Index 10 is out of range (0-2)
Invalid index: None
Data saved to data.txt`,
          tips: [
            "Be specific with exception types rather than using broad except clauses",
            "Use finally for cleanup code that must run",
            "Consider using else clause for code that should run only if no exception occurs",
            "Create custom exceptions for application-specific errors",
          ],
          prevSection: "file_handling",
        },
      ],
    },
    {
      id: "py_advanced",
      title: "Advanced Python Programming",
      description: "Master advanced Python concepts and best practices",
      difficulty: "advanced",
      estimatedTime: "4 hours",
      prerequisites: ["Python Fundamentals", "Basic OOP concepts"],
      whatYouWillLearn: [
        "Object-oriented programming in depth",
        "Decorators and metaclasses",
        "Advanced data structures",
        "Performance optimization",
      ],
      sections: [
        {
          id: "oop_advanced",
          title: "Advanced Object-Oriented Programming",
          content: `
# Advanced Object-Oriented Programming in Python

Python's OOP features go far beyond basic classes and inheritance. Understanding advanced concepts will make you a more effective Python developer.

## Advanced OOP Concepts

1. **Class Methods and Static Methods**: Different types of methods
2. **Property Decorators**: Getter/setter functionality
3. **Magic Methods**: Special methods for operator overloading
4. **Multiple Inheritance**: Inheriting from multiple classes
5. **Method Resolution Order (MRO)**: How Python resolves method calls
6. **Abstract Base Classes**: Defining interfaces

## Design Patterns

Understanding common design patterns in Python.
          `,
          codeExample: `# Class methods and static methods
class MathUtils:
    pi = 3.14159

    def __init__(self, precision=2):
        self.precision = precision

    @classmethod
    def create_high_precision(cls):
        return cls(precision=10)

    @staticmethod
    def add(a, b):
        return a + b

    @property
    def formatted_pi(self):
        return round(self.pi, self.precision)

# Property decorators
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature cannot be below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return (self._celsius * 9/5) + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5/9

# Magic methods
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

# Using the classes
math_util = MathUtils()
print(f"Pi with default precision: {math_util.formatted_pi}")

high_precision = MathUtils.create_high_precision()
print(f"Pi with high precision: {high_precision.formatted_pi}")

temp = Temperature(25)
print(f"25°C = {temp.fahrenheit}°F")

v1 = Vector(1, 2)
v2 = Vector(3, 4)
v3 = v1 + v2
print(f"{v1} + {v2} = {v3}")`,
          tryItYourself: `# Create a comprehensive bank account system
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List

class Transaction:
    def __init__(self, amount: float, transaction_type: str, description: str = ""):
        self.amount = amount
        self.type = transaction_type
        self.description = description
        self.timestamp = datetime.now()

    def __str__(self):
        return f"{self.timestamp.strftime('%Y-%m-%d %H:%M')} | {self.type} | $\{self.amount:.2f} | {self.description}"

class Account(ABC):
    def __init__(self, account_number: str, owner: str, initial_balance: float = 0):
        self._account_number = account_number
        self._owner = owner
        self._balance = initial_balance
        self._transactions: List[Transaction] = []

        if initial_balance > 0:
            self._transactions.append(Transaction(initial_balance, "DEPOSIT", "Initial deposit"))

    @property
    def balance(self):
        return self._balance

    @property
    def account_number(self):
        return self._account_number

    @property
    def owner(self):
        return self._owner

    @abstractmethod
    def withdraw(self, amount: float, description: str = "") -> bool:
        pass

    def deposit(self, amount: float, description: str = "") -> bool:
        if amount <= 0:
            return False

        self._balance += amount
        self._transactions.append(Transaction(amount, "DEPOSIT", description))
        return True

    def get_transaction_history(self) -> List[Transaction]:
        return self._transactions.copy()

    def __str__(self):
        return f"{self.__class__.__name__} {self._account_number} ({self._owner}): $\{self._balance:.2f}"

class CheckingAccount(Account):
    def __init__(self, account_number: str, owner: str, initial_balance: float = 0, overdraft_limit: float = 100):
        super().__init__(account_number, owner, initial_balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount: float, description: str = "") -> bool:
        if amount <= 0:
            return False

        if self._balance - amount >= -self.overdraft_limit:
            self._balance -= amount
            self._transactions.append(Transaction(-amount, "WITHDRAWAL", description))
            return True
        return False

class SavingsAccount(Account):
    def __init__(self, account_number: str, owner: str, initial_balance: float = 0, interest_rate: float = 0.02):
        super().__init__(account_number, owner, initial_balance)
        self.interest_rate = interest_rate

    def withdraw(self, amount: float, description: str = "") -> bool:
        if amount <= 0 or amount > self._balance:
            return False

        self._balance -= amount
        self._transactions.append(Transaction(-amount, "WITHDRAWAL", description))
        return True

    def apply_interest(self):
        interest = self._balance * self.interest_rate / 12  # Monthly interest
        if interest > 0:
            self.deposit(interest, "Monthly interest")

# Test the banking system
checking = CheckingAccount("CHK001", "Alice Johnson", 500, 200)
savings = SavingsAccount("SAV001", "Alice Johnson", 1000, 0.03)

print("Initial account states:")
print(checking)
print(savings)

print("\\nPerforming transactions:")
checking.deposit(200, "Salary deposit")
checking.withdraw(150, "Grocery shopping")
checking.withdraw(600, "Rent payment")  # This should use overdraft

savings.deposit(500, "Monthly savings")
savings.apply_interest()

print("\\nFinal account states:")
print(checking)
print(savings)

print("\\nChecking account transaction history:")
for transaction in checking.get_transaction_history():
    print(transaction)`,
          output: `Initial account states:
CheckingAccount CHK001 (Alice Johnson): $500.00
SavingsAccount SAV001 (Alice Johnson): $1000.00

Performing transactions:

Final account states:
CheckingAccount CHK001 (Alice Johnson): $-50.00
SavingsAccount SAV001 (Alice Johnson): $1503.75

Checking account transaction history:
2024-01-15 10:30:45 | DEPOSIT | $500.00 | Initial deposit
2024-01-15 10:30:45 | DEPOSIT | $200.00 | Salary deposit
2024-01-15 10:30:45 | WITHDRAWAL | $-150.00 | Grocery shopping
2024-01-15 10:30:45 | WITHDRAWAL | $-600.00 | Rent payment`,
          tips: [
            "Use @property for controlled access to attributes",
            "Abstract base classes help define clear interfaces",
            "Magic methods make your classes work with Python operators",
            "Type hints improve code readability and IDE support",
          ],
          nextSection: "decorators_advanced",
        },
        {
          id: "decorators_advanced",
          title: "Advanced Decorators and Metaclasses",
          content: `
# Advanced Decorators and Metaclasses

Decorators and metaclasses are powerful Python features that allow you to modify or enhance classes and functions.

## Advanced Decorator Patterns

1. **Parameterized Decorators**: Decorators that accept arguments
2. **Class Decorators**: Decorating entire classes
3. **Method Decorators**: Decorating class methods
4. **Decorator Factories**: Functions that return decorators
5. **Functools.wraps**: Preserving function metadata

## Metaclasses

Metaclasses are "classes that create classes" - they control class creation.

## Practical Applications

Real-world uses of decorators and metaclasses.
          `,
          codeExample: `import functools
import time
from typing import Any, Callable

# Parameterized decorator
def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise e
                    print(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay}s...")
                    time.sleep(delay)
        return wrapper
    return decorator

# Timing decorator
def timing(func: Callable) -> Callable:
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

# Class decorator
def add_repr(cls):
    def __repr__(self):
        attrs = ', '.join(f"{k}={v!r}" for k, v in self.__dict__.items())
        return f"{cls.__name__}({attrs})"
    cls.__repr__ = __repr__
    return cls

# Method decorator for caching
def memoize(func: Callable) -> Callable:
    cache = {}

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        key = str(args) + str(sorted(kwargs.items()))
        if key not in cache:
            cache[key] = func(*args, **kwargs)
        return cache[key]
    return wrapper

# Metaclass example
class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class DatabaseConnection(metaclass=SingletonMeta):
    def __init__(self, host: str = "localhost"):
        self.host = host
        self.connected = False

    def connect(self):
        self.connected = True
        print(f"Connected to database at {self.host}")

# Using decorators
@add_repr
class Person:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

@retry(max_attempts=3, delay=0.5)
@timing
def unreliable_function():
    import random
    if random.random() < 0.7:  # 70% chance of failure
        raise Exception("Random failure")
    return "Success!"

# Testing
person = Person("Alice", 30)
print(person)  # Uses the added __repr__ method

# Singleton test
db1 = DatabaseConnection("server1")
db2 = DatabaseConnection("server2")
print(f"Same instance? {db1 is db2}")  # True

try:
    result = unreliable_function()
    print(f"Function result: {result}")
except Exception as e:
    print(f"Function failed: {e}")`,
          tryItYourself: `# Create a comprehensive validation system using decorators
import functools
from typing import Any, Callable, Dict, List

class ValidationError(Exception):
    pass

def validate_types(**type_hints):
    """Decorator to validate function argument types"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Get function signature
            import inspect
            sig = inspect.signature(func)
            bound_args = sig.bind(*args, **kwargs)
            bound_args.apply_defaults()

            # Validate types
            for param_name, expected_type in type_hints.items():
                if param_name in bound_args.arguments:
                    value = bound_args.arguments[param_name]
                    if not isinstance(value, expected_type):
                        raise ValidationError(
                            f"Parameter '{param_name}' must be of type {expected_type.__name__}, "
                            f"got {type(value).__name__}"
                        )

            return func(*args, **kwargs)
        return wrapper
    return decorator

def validate_range(param_name: str, min_val: float = None, max_val: float = None):
    """Decorator to validate numeric parameter ranges"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            import inspect
            sig = inspect.signature(func)
            bound_args = sig.bind(*args, **kwargs)
            bound_args.apply_defaults()

            if param_name in bound_args.arguments:
                value = bound_args.arguments[param_name]
                if min_val is not None and value < min_val:
                    raise ValidationError(f"Parameter '{param_name}' must be >= {min_val}")
                if max_val is not None and value > max_val:
                    raise ValidationError(f"Parameter '{param_name}' must be <= {max_val}")

            return func(*args, **kwargs)
        return wrapper
    return decorator

def log_calls(func: Callable) -> Callable:
    """Decorator to log function calls"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        args_str = ', '.join(repr(arg) for arg in args)
        kwargs_str = ', '.join(f"{k}={v!r}" for k, v in kwargs.items())
        all_args = ', '.join(filter(None, [args_str, kwargs_str]))

        print(f"Calling {func.__name__}({all_args})")

        try:
            result = func(*args, **kwargs)
            print(f"{func.__name__} returned: {result!r}")
            return result
        except Exception as e:
            print(f"{func.__name__} raised: {e!r}")
            raise
    return wrapper

# Example usage of validation decorators
class Calculator:
    @log_calls
    @validate_types(a=(int, float), b=(int, float))
    @validate_range('b', min_val=0.001)  # Prevent division by very small numbers
    def divide(self, a: float, b: float) -> float:
        """Divide a by b with validation"""
        return a / b

    @log_calls
    @validate_types(base=(int, float), exponent=(int, float))
    @validate_range('base', min_val=0)
    @validate_range('exponent', min_val=0, max_val=100)
    def power(self, base: float, exponent: float) -> float:
        """Calculate base^exponent with validation"""
        return base ** exponent

    @log_calls
    @validate_types(numbers=list)
    def average(self, numbers: List[float]) -> float:
        """Calculate average of a list of numbers"""
        if not numbers:
            raise ValidationError("Cannot calculate average of empty list")

        # Validate all elements are numbers
        for i, num in enumerate(numbers):
            if not isinstance(num, (int, float)):
                raise ValidationError(f"Element at index \{i} must be a number")

        return sum(numbers) / len(numbers)

# Test the calculator
calc = Calculator()

print("Valid operations:")
print(f"10 / 2 = \{calc.divide(10, 2)}")
print(f"2^3 = \{calc.power(2, 3)}")
print(f"Average of [1,2,3,4,5] = \{calc.average([1, 2, 3, 4, 5])}")

print("\\nInvalid operations:")
try:
    calc.divide("10", 2)  # Type error
except ValidationError as e:
    print(f"Error: \{e}")

try:
    calc.divide(10, 0)  # Range error
except ValidationError as e:
    print(f"Error: \{e}")

try:
    calc.power(2, 150)  # Range error
except ValidationError as e:
    print(f"Error: \{e}")`,
          output: `Valid operations:
Calling divide(10, 2)
divide returned: 5.0
10 / 2 = 5.0
Calling power(2, 3)
power returned: 8.0
2^3 = 8.0
Calling average([1, 2, 3, 4, 5])
average returned: 3.0
Average of [1,2,3,4,5] = 3.0

Invalid operations:
Calling divide('10', 2)
divide raised: ValidationError("Parameter 'a' must be of type int, got str")
Error: Parameter 'a' must be of type int, got str
Error: Parameter 'b' must be >= 0.001
Error: Parameter 'exponent' must be <= 100`,
          tips: [
            "Use functools.wraps to preserve function metadata in decorators",
            "Parameterized decorators are functions that return decorators",
            "Metaclasses control class creation - use sparingly",
            "Combine multiple decorators for powerful functionality",
          ],
          prevSection: "oop_advanced",
        },
      ],
    },
  ],
};

// Function to get tutorial by language and tutorial ID
export function getTutorial(
  language: string,
  tutorialId: string
): Tutorial | null {
  const tutorials = tutorialContent[language];
  if (!tutorials) return null;

  return tutorials.find((tutorial) => tutorial.id === tutorialId) || null;
}

// Function to get all tutorials for a language
export function getTutorials(language: string): Tutorial[] {
  return tutorialContent[language] || [];
}

// Function to get tutorial section
export function getTutorialSection(
  language: string,
  tutorialId: string,
  sectionId: string
): TutorialSection | null {
  const tutorial = getTutorial(language, tutorialId);
  if (!tutorial) return null;

  return tutorial.sections.find((section) => section.id === sectionId) || null;
}
