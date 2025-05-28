// Interview questions for tutorials - 50 questions per language in accordion format

export interface TutorialInterviewQuestion {
  id: string;
  question: string;
  answer: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  codeExample?: string;
  relatedTopics: string[];
}

export const tutorialInterviewQuestions: Record<
  string,
  TutorialInterviewQuestion[]
> = {
  javascript: [
    {
      id: "js_q1",
      question: "What is JavaScript and what are its main features?",
      answer:
        "JavaScript is a high-level, interpreted programming language primarily used for web development. Main features include: dynamic typing, first-class functions, prototype-based object orientation, event-driven programming, and the ability to run both client-side and server-side.",
      difficulty: "beginner",
      category: "Basics",
      relatedTopics: [
        "fundamentals",
        "web development",
        "programming concepts",
      ],
    },
    {
      id: "js_q2",
      question: "What is the difference between var, let, and const?",
      answer:
        "var is function-scoped and hoisted with undefined initialization. let and const are block-scoped and hoisted but not initialized (temporal dead zone). const cannot be reassigned after declaration, while let can be reassigned.",
      difficulty: "beginner",
      category: "Variables",
      codeExample: `var x = 1;    // Function-scoped, can be redeclared
let y = 2;    // Block-scoped, can be reassigned
const z = 3;  // Block-scoped, cannot be reassigned`,
      relatedTopics: ["scope", "hoisting", "variable declaration"],
    },
    {
      id: "js_q3",
      question: "What is hoisting in JavaScript?",
      answer:
        "Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during compilation. Variables declared with var are hoisted and initialized with undefined, while let and const are hoisted but not initialized.",
      difficulty: "intermediate",
      category: "Concepts",
      codeExample: `console.log(x); // undefined (not error)
var x = 5;

console.log(y); // ReferenceError
let y = 10;`,
      relatedTopics: ["scope", "compilation", "variable declaration"],
    },
    {
      id: "js_q4",
      question: "What are closures in JavaScript?",
      answer:
        "A closure is a function that has access to variables in its outer scope even after the outer function has returned. Closures are created when a function is defined inside another function.",
      difficulty: "intermediate",
      category: "Functions",
      codeExample: `function outerFunction(x) {
  return function innerFunction(y) {
    return x + y; // x is from outer scope
  };
}
const add5 = outerFunction(5);
console.log(add5(3)); // 8`,
      relatedTopics: ["scope", "functions", "lexical environment"],
    },
    {
      id: "js_q5",
      question: "What is the difference between == and === operators?",
      answer:
        "== performs type coercion before comparison (loose equality), while === compares both value and type without coercion (strict equality). === is generally preferred for predictable comparisons.",
      difficulty: "beginner",
      category: "Operators",
      codeExample: `console.log(5 == "5");  // true (type coercion)
console.log(5 === "5"); // false (strict comparison)
console.log(null == undefined);  // true
console.log(null === undefined); // false`,
      relatedTopics: ["comparison", "type coercion", "operators"],
    },
    {
      id: "js_q6",
      question: "What is the event loop in JavaScript?",
      answer:
        "The event loop is a mechanism that handles asynchronous operations in JavaScript. It continuously checks the call stack and callback queue, moving callbacks to the call stack when it's empty.",
      difficulty: "advanced",
      category: "Async Programming",
      codeExample: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2`,
      relatedTopics: ["asynchronous", "callbacks", "promises", "microtasks"],
    },
    {
      id: "js_q7",
      question:
        "What are arrow functions and how do they differ from regular functions?",
      answer:
        'Arrow functions are a shorter syntax for writing functions. Key differences: no own "this" binding, cannot be used as constructors, no arguments object, and more concise syntax.',
      difficulty: "intermediate",
      category: "Functions",
      codeExample: `// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Arrow function with this binding difference
const obj = {
  name: 'John',
  regular: function() { return this.name; },
  arrow: () => this.name // undefined in browser
};`,
      relatedTopics: ["functions", "this binding", "ES6"],
    },
    {
      id: "js_q8",
      question: "What is destructuring in JavaScript?",
      answer:
        "Destructuring is a syntax that allows you to extract values from arrays or properties from objects into distinct variables. It provides a clean way to unpack values.",
      difficulty: "intermediate",
      category: "Syntax",
      codeExample: `// Array destructuring
const [a, b, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
const {name, age} = {name: 'John', age: 30};

// Function parameter destructuring
function greet({name, age = 25}) {
  return \`Hello \${name}, age \${age}\`;
}`,
      relatedTopics: ["ES6", "arrays", "objects", "syntax"],
    },
    {
      id: "js_q9",
      question: "What are promises in JavaScript?",
      answer:
        "Promises are objects representing the eventual completion or failure of an asynchronous operation. They provide a cleaner alternative to callbacks for handling asynchronous code.",
      difficulty: "intermediate",
      category: "Async Programming",
      codeExample: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));`,
      relatedTopics: ["asynchronous", "callbacks", "async/await"],
    },
    {
      id: "js_q10",
      question: "What is async/await in JavaScript?",
      answer:
        "Async/await is syntactic sugar for promises that makes asynchronous code look and behave more like synchronous code. async functions return promises, and await pauses execution until the promise resolves.",
      difficulty: "intermediate",
      category: "Async Programming",
      codeExample: `async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
      relatedTopics: ["promises", "asynchronous", "error handling"],
    },
    {
      id: "js_q11",
      question: "What is the difference between null and undefined?",
      answer:
        "undefined means a variable has been declared but not assigned a value, while null is an assignment value representing no value or empty value. undefined is a type itself, while null is an object.",
      difficulty: "beginner",
      category: "Data Types",
      codeExample: `let a;
console.log(a);        // undefined
console.log(typeof a); // "undefined"

let b = null;
console.log(b);        // null
console.log(typeof b); // "object"`,
      relatedTopics: ["data types", "variables", "type checking"],
    },
    {
      id: "js_q12",
      question: "What are template literals in JavaScript?",
      answer:
        "Template literals are string literals that allow embedded expressions using backticks (`). They support multi-line strings and string interpolation using ${expression} syntax.",
      difficulty: "beginner",
      category: "Syntax",
      codeExample: `const name = "John";
const age = 30;

// Template literal
const message = \`Hello, my name is \${name} and I am \${age} years old.\`;

// Multi-line string
const multiline = \`This is
a multi-line
string\`;`,
      relatedTopics: ["strings", "ES6", "interpolation"],
    },
    {
      id: "js_q13",
      question: "What is the spread operator in JavaScript?",
      answer:
        "The spread operator (...) allows an iterable to be expanded in places where zero or more arguments or elements are expected. It can be used with arrays, objects, and function calls.",
      difficulty: "intermediate",
      category: "Syntax",
      codeExample: `// Array spreading
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Object spreading
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Function arguments
function sum(a, b, c) {
  return a + b + c;
}
const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6`,
      relatedTopics: ["ES6", "arrays", "objects", "function parameters"],
    },
    {
      id: "js_q14",
      question: "What is the rest parameter in JavaScript?",
      answer:
        "The rest parameter (...) allows a function to accept an indefinite number of arguments as an array. It collects all remaining arguments into an array.",
      difficulty: "intermediate",
      category: "Functions",
      codeExample: `function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

function greet(greeting, ...names) {
  return \`\${greeting} \${names.join(', ')}\`;
}

console.log(greet("Hello", "John", "Jane", "Bob")); // "Hello John, Jane, Bob"`,
      relatedTopics: ["functions", "parameters", "ES6", "arrays"],
    },
    {
      id: "js_q15",
      question: "What are JavaScript modules and how do they work?",
      answer:
        "JavaScript modules are reusable pieces of code that can be exported from one file and imported into another. They help organize code and manage dependencies using export and import statements.",
      difficulty: "intermediate",
      category: "Modules",
      codeExample: `// math.js - Named exports
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}

// utils.js - Default export
export default function formatDate(date) {
  return date.toLocaleDateString();
}

// main.js - Importing
import formatDate from './utils.js';
import { PI, add } from './math.js';
import * as math from './math.js';`,
      relatedTopics: ["modules", "import", "export", "ES6"],
    },
    {
      id: "js_q16",
      question: "What is prototypal inheritance in JavaScript?",
      answer:
        "Prototypal inheritance is a feature where objects can inherit properties and methods from other objects through the prototype chain. Every object has a prototype property that points to another object.",
      difficulty: "advanced",
      category: "OOP",
      codeExample: `function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return \`Hello, I'm \${this.name}\`;
};

function Student(name, grade) {
  Person.call(this, name);
  this.grade = grade;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

const student = new Student("Alice", "A");
console.log(student.greet()); // "Hello, I'm Alice"`,
      relatedTopics: [
        "prototype",
        "inheritance",
        "OOP",
        "constructor functions",
      ],
    },
    {
      id: "js_q17",
      question: "What is the difference between call, apply, and bind?",
      answer:
        'call() and apply() immediately invoke a function with a specified "this" value. call() takes arguments individually, apply() takes an array. bind() returns a new function with a bound "this" value.',
      difficulty: "intermediate",
      category: "Functions",
      codeExample: `const person = { name: "John" };

function greet(greeting, punctuation) {
  return \`\${greeting}, I'm \${this.name}\${punctuation}\`;
}

// call - arguments individually
console.log(greet.call(person, "Hello", "!")); // "Hello, I'm John!"

// apply - arguments as array
console.log(greet.apply(person, ["Hi", "."])); // "Hi, I'm John."

// bind - returns new function
const boundGreet = greet.bind(person, "Hey");
console.log(boundGreet("?")); // "Hey, I'm John?"`,
      relatedTopics: ["this binding", "function methods", "context"],
    },
    {
      id: "js_q18",
      question: "What are JavaScript classes and how do they work?",
      answer:
        "JavaScript classes are syntactic sugar over prototypal inheritance. They provide a cleaner syntax for creating objects and implementing inheritance using class, constructor, extends, and super keywords.",
      difficulty: "intermediate",
      category: "OOP",
      codeExample: `class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return \`\${this.name} makes a sound\`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return \`\${this.name} barks\`;
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.speak()); // "Buddy barks"`,
      relatedTopics: ["classes", "inheritance", "constructor", "super"],
    },
    {
      id: "js_q19",
      question:
        "What is the difference between synchronous and asynchronous JavaScript?",
      answer:
        "Synchronous code executes line by line, blocking subsequent code until completion. Asynchronous code allows other code to run while waiting for operations to complete, using callbacks, promises, or async/await.",
      difficulty: "intermediate",
      category: "Async Programming",
      codeExample: `// Synchronous
console.log("1");
console.log("2");
console.log("3");
// Output: 1, 2, 3

// Asynchronous
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");
// Output: 1, 3, 2

// Async/await
async function fetchData() {
  const data = await fetch('/api/data');
  return data.json();
}`,
      relatedTopics: ["asynchronous", "callbacks", "promises", "async/await"],
    },
    {
      id: "js_q20",
      question: "What are higher-order functions in JavaScript?",
      answer:
        "Higher-order functions are functions that either take other functions as arguments or return functions as results. Examples include map(), filter(), reduce(), and custom functions that accept callbacks.",
      difficulty: "intermediate",
      category: "Functions",
      codeExample: `// Function that takes another function as argument
function processArray(arr, callback) {
  return arr.map(callback);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = processArray(numbers, x => x * 2);

// Function that returns another function
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
console.log(double(5)); // 10`,
      relatedTopics: ["functions", "callbacks", "functional programming"],
    },
    // Continue with more questions to reach 50...
  ],

  python: [
    {
      id: "py_q1",
      question: "What is Python and what are its key features?",
      answer:
        "Python is a high-level, interpreted programming language known for its simplicity and readability. Key features include: easy-to-learn syntax, dynamic typing, automatic memory management, extensive standard library, cross-platform compatibility, and strong community support.",
      difficulty: "beginner",
      category: "Basics",
      relatedTopics: [
        "fundamentals",
        "programming concepts",
        "language features",
      ],
    },
    {
      id: "py_q2",
      question: "What is the difference between list and tuple in Python?",
      answer:
        "Lists are mutable (can be changed) and use square brackets [], while tuples are immutable (cannot be changed) and use parentheses (). Lists are slower than tuples for iteration but more flexible for data manipulation.",
      difficulty: "beginner",
      category: "Data Types",
      codeExample: `# List (mutable)
my_list = [1, 2, 3]
my_list[0] = 10  # This works
my_list.append(4)  # This works

# Tuple (immutable)
my_tuple = (1, 2, 3)
# my_tuple[0] = 10  # This would raise TypeError`,
      relatedTopics: ["data structures", "mutability", "collections"],
    },
    {
      id: "py_q3",
      question: "What are Python decorators?",
      answer:
        "Decorators are a way to modify or enhance functions or classes without permanently modifying their structure. They use the @ symbol and are essentially functions that take another function as an argument.",
      difficulty: "intermediate",
      category: "Advanced",
      codeExample: `def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function call")
        result = func(*args, **kwargs)
        print("After function call")
        return result
    return wrapper

@my_decorator
def greet(name):
    return f"Hello, {name}!"`,
      relatedTopics: ["functions", "wrapper functions", "metaprogramming"],
    },
    {
      id: "py_q4",
      question: "What is the difference between *args and **kwargs?",
      answer:
        "*args allows a function to accept any number of positional arguments, while **kwargs allows it to accept any number of keyword arguments. They provide flexibility in function definitions.",
      difficulty: "intermediate",
      category: "Functions",
      codeExample: `def example_function(*args, **kwargs):
    print("Positional arguments:", args)
    print("Keyword arguments:", kwargs)

example_function(1, 2, 3, name="John", age=30)
# Output:
# Positional arguments: (1, 2, 3)
# Keyword arguments: {'name': 'John', 'age': 30}`,
      relatedTopics: ["functions", "parameters", "unpacking"],
    },
    {
      id: "py_q5",
      question: "What is list comprehension in Python?",
      answer:
        "List comprehension is a concise way to create lists based on existing lists or other iterables. It provides a more readable and efficient alternative to traditional for loops for creating lists.",
      difficulty: "beginner",
      category: "Data Structures",
      codeExample: `# Traditional approach
squares = []
for x in range(10):
    squares.append(x**2)

# List comprehension
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]`,
      relatedTopics: ["lists", "loops", "functional programming"],
    },
    {
      id: "py_q6",
      question: "What is the Global Interpreter Lock (GIL) in Python?",
      answer:
        "The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously. This means only one thread can execute Python code at a time, affecting multithreading performance for CPU-bound tasks.",
      difficulty: "advanced",
      category: "Concurrency",
      codeExample: `import threading
import time

def cpu_bound_task():
    count = 0
    for i in range(100000000):
        count += 1
    return count

# Due to GIL, this won't be faster than single-threaded
threads = []
for i in range(2):
    t = threading.Thread(target=cpu_bound_task)
    threads.append(t)
    t.start()

for t in threads:
    t.join()`,
      relatedTopics: [
        "threading",
        "concurrency",
        "performance",
        "multiprocessing",
      ],
    },
    {
      id: "py_q7",
      question: "What are Python generators?",
      answer:
        "Generators are functions that return an iterator object which can be iterated over. They use the yield keyword instead of return and generate values on-demand, making them memory efficient for large datasets.",
      difficulty: "intermediate",
      category: "Advanced",
      codeExample: `def fibonacci_generator(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Usage
fib = fibonacci_generator(10)
for num in fib:
    print(num)`,
      relatedTopics: ["iterators", "memory efficiency", "lazy evaluation"],
    },
    {
      id: "py_q8",
      question: "What is the difference between deep copy and shallow copy?",
      answer:
        "Shallow copy creates a new object but inserts references to objects found in the original. Deep copy creates a new object and recursively copies all nested objects. Changes to nested objects in shallow copy affect the original.",
      difficulty: "intermediate",
      category: "Memory Management",
      codeExample: `import copy

original = [[1, 2, 3], [4, 5, 6]]

# Shallow copy
shallow = copy.copy(original)
shallow[0][0] = 'X'  # This affects original

# Deep copy
deep = copy.deepcopy(original)
deep[0][0] = 'Y'  # This doesn't affect original`,
      relatedTopics: ["memory", "objects", "references"],
    },
    {
      id: "py_q9",
      question: "What are Python context managers?",
      answer:
        'Context managers are objects that define methods to be used with the "with" statement. They ensure proper resource management by automatically handling setup and cleanup operations.',
      difficulty: "intermediate",
      category: "Advanced",
      codeExample: `# Built-in context manager
with open('file.txt', 'r') as f:
    content = f.read()
# File is automatically closed

# Custom context manager
class MyContextManager:
    def __enter__(self):
        print("Entering context")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Exiting context")

with MyContextManager():
    print("Inside context")`,
      relatedTopics: [
        "resource management",
        "file handling",
        "exception handling",
      ],
    },
    {
      id: "py_q10",
      question: "What is the difference between __str__ and __repr__ methods?",
      answer:
        "__str__ is meant to return a human-readable string representation of an object, while __repr__ should return an unambiguous string representation that could ideally be used to recreate the object.",
      difficulty: "intermediate",
      category: "OOP",
      codeExample: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        return f"{self.name}, {self.age} years old"

    def __repr__(self):
        return f"Person('{self.name}', {self.age})"

p = Person("Alice", 30)
print(str(p))   # Alice, 30 years old
print(repr(p))  # Person('Alice', 30)`,
      relatedTopics: ["object representation", "debugging", "string methods"],
    },
    // Add 40 more Python questions here...
  ],
};

// Function to get interview questions for a specific language
export function getTutorialInterviewQuestions(
  language: string
): TutorialInterviewQuestion[] {
  return tutorialInterviewQuestions[language] || [];
}

// Function to get questions by difficulty
export function getTutorialQuestionsByDifficulty(
  language: string,
  difficulty: "beginner" | "intermediate" | "advanced" | "all"
): TutorialInterviewQuestion[] {
  const questions = getTutorialInterviewQuestions(language);

  if (difficulty === "all") {
    return questions;
  }

  return questions.filter((q) => q.difficulty === difficulty);
}

// Function to get questions by category
export function getTutorialQuestionsByCategory(
  language: string,
  category: string
): TutorialInterviewQuestion[] {
  const questions = getTutorialInterviewQuestions(language);
  return questions.filter((q) => q.category === category);
}
