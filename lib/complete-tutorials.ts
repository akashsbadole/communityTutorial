// Complete tutorial content with interactive examples and 50 interview questions per language
import { additionalTutorials } from "./additional-tutorials";
import { expandedTutorials } from "./expanded-tutorials";
import { comprehensiveTutorials } from "./comprehensive-tutorials";
import { megaTutorials } from "./mega-tutorials";
import { mega30Tutorials } from "./mega-comprehensive-system";

export interface TutorialChapter {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  interactiveExample?: string;
  exercises?: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  codeExample?: string;
}

export interface CompleteTutorial {
  language: string;
  title: string;
  description: string;
  chapters: TutorialChapter[];
  interviewQuestions: InterviewQuestion[];
}

// JavaScript Complete Tutorial
export const javascriptTutorial: CompleteTutorial = {
  language: "javascript",
  title: "Complete JavaScript Tutorial",
  description:
    "Master JavaScript from basics to advanced concepts with interactive examples",
  chapters: [
    {
      id: "js-basics",
      title: "JavaScript Fundamentals",
      content: `
# JavaScript Fundamentals

JavaScript is a versatile programming language that powers the web. Let's start with the basics.

## Variables and Data Types

JavaScript has several data types:
- **Numbers**: 42, 3.14
- **Strings**: "Hello World"
- **Booleans**: true, false
- **Arrays**: [1, 2, 3]
- **Objects**: {name: "John", age: 30}
- **Undefined**: undefined
- **Null**: null

## Variable Declarations

Use \`let\`, \`const\`, or \`var\` to declare variables:
      `,
      codeExample: `
// Variable declarations
let name = "John";
const age = 30;
var city = "New York";

// Data types
let number = 42;
let text = "Hello World";
let isActive = true;
let items = [1, 2, 3, 4, 5];
let person = {
  name: "Alice",
  age: 25,
  city: "Boston"
};

console.log(typeof number);  // "number"
console.log(typeof text);    // "string"
console.log(typeof isActive); // "boolean"
      `,
      exercises: [
        "Create variables for your name, age, and favorite color",
        "Create an array of your top 5 favorite movies",
        "Create an object representing a book with title, author, and pages",
      ],
    },
    {
      id: "js-functions",
      title: "Functions and Scope",
      content: `
# Functions and Scope

Functions are reusable blocks of code that perform specific tasks.

## Function Declaration vs Expression

There are multiple ways to create functions in JavaScript.
      `,
      codeExample: `
// Function Declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// Function Expression
const greetExpression = function(name) {
  return "Hello, " + name + "!";
};

// Arrow Function
const greetArrow = (name) => {
  return "Hello, " + name + "!";
};

// Short Arrow Function
const greetShort = name => "Hello, " + name + "!";

// Examples
console.log(greet("Alice"));
console.log(greetExpression("Bob"));
console.log(greetArrow("Charlie"));
console.log(greetShort("David"));
      `,
      exercises: [
        "Create a function that calculates the area of a rectangle",
        "Write an arrow function that returns the square of a number",
        "Create a function that takes an array and returns its length",
      ],
    },
    {
      id: "js-objects-arrays",
      title: "Objects and Arrays",
      content: `
# Working with Objects and Arrays

Objects and arrays are fundamental data structures in JavaScript.

## Array Methods

JavaScript provides many built-in methods for working with arrays.
      `,
      codeExample: `
// Array methods
const numbers = [1, 2, 3, 4, 5];

// Map - transform each element
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter - select elements that meet criteria
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// Reduce - combine all elements into single value
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

// Object manipulation
const person = {
  name: "John",
  age: 30,
  city: "New York"
};

// Destructuring
const { name, age } = person;
console.log(name, age); // "John" 30

// Object.keys, Object.values, Object.entries
console.log(Object.keys(person));   // ["name", "age", "city"]
console.log(Object.values(person)); // ["John", 30, "New York"]
      `,
      exercises: [
        "Create an array of numbers and find the maximum value",
        "Use map to convert an array of names to uppercase",
        "Filter an array of objects to find items with specific properties",
      ],
    },
    {
      id: "js-async",
      title: "Asynchronous JavaScript",
      content: `
# Asynchronous Programming

Learn how to handle asynchronous operations with callbacks, promises, and async/await.

## Promises and Async/Await

Modern JavaScript uses promises and async/await for handling asynchronous operations.
      `,
      codeExample: `
// Promise example
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { id: 1, name: "Sample Data" };
      resolve(data);
    }, 1000);
  });
}

// Using .then()
fetchData()
  .then(data => console.log("Promise result:", data))
  .catch(error => console.error("Error:", error));

// Using async/await
async function getData() {
  try {
    const data = await fetchData();
    console.log("Async/await result:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

getData();

// Fetch API example
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}
      `,
      exercises: [
        "Create a promise that resolves after 2 seconds",
        "Write an async function that fetches data from an API",
        "Handle errors in async operations using try/catch",
      ],
    },
    {
      id: "js-dom",
      title: "DOM Manipulation",
      content: `
# Document Object Model (DOM)

Learn how to interact with HTML elements using JavaScript.

## Selecting and Modifying Elements

The DOM API provides methods to select and modify HTML elements.
      `,
      codeExample: `
// Selecting elements
const element = document.getElementById('myElement');
const elements = document.querySelectorAll('.myClass');
const firstElement = document.querySelector('.myClass');

// Modifying content
element.textContent = 'New text content';
element.innerHTML = '<strong>Bold text</strong>';

// Modifying attributes
element.setAttribute('data-value', '123');
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('highlight');

// Creating new elements
const newDiv = document.createElement('div');
newDiv.textContent = 'New element';
newDiv.className = 'new-element';
document.body.appendChild(newDiv);

// Event handling
element.addEventListener('click', function(event) {
  console.log('Element clicked!', event);
});

// Modern event handling with arrow functions
element.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('Modern click handler');
});
      `,
      exercises: [
        "Create a button that changes its text when clicked",
        "Build a simple todo list with add/remove functionality",
        "Create a form that validates input before submission",
      ],
    },
    {
      id: "js-es6",
      title: "ES6+ Modern JavaScript",
      content: `
# ES6+ Modern JavaScript Features

Learn modern JavaScript features introduced in ES6 and beyond.

## Template Literals and Destructuring

Modern syntax for strings and object manipulation.
      `,
      codeExample: `
// Template literals
const name = 'John';
const age = 30;
const message = \`Hello, my name is \${name} and I'm \${age} years old.\`;

// Destructuring objects
const person = { name: 'Alice', age: 25, city: 'Boston' };
const { name: personName, age: personAge } = person;

// Destructuring arrays
const colors = ['red', 'green', 'blue'];
const [primary, secondary, tertiary] = colors;

// Spread operator
const numbers = [1, 2, 3];
const moreNumbers = [...numbers, 4, 5, 6];
const newPerson = { ...person, country: 'USA' };

// Rest parameters
function sum(...args) {
  return args.reduce((total, num) => total + num, 0);
}

// Default parameters
function greet(name = 'World') {
  return \`Hello, \${name}!\`;
}
      `,
      exercises: [
        "Use template literals to create a formatted string",
        "Destructure an object with nested properties",
        "Create a function using rest parameters",
      ],
    },
    {
      id: "js-modules",
      title: "Modules and Classes",
      content: `
# JavaScript Modules and Classes

Learn how to organize code with modules and create reusable classes.

## ES6 Classes

Object-oriented programming in JavaScript.
      `,
      codeExample: `
// ES6 Class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    return \`Hi, I'm \${this.name} and I'm \${this.age} years old.\`;
  }

  static species() {
    return 'Homo sapiens';
  }
}

// Inheritance
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }

  study() {
    return \`\${this.name} is studying.\`;
  }
}

// Module exports (ES6)
export class Calculator {
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }
}

// Module imports
// import { Calculator } from './calculator.js';
// import Person, { Student } from './person.js';

// Usage
const john = new Person('John', 30);
const alice = new Student('Alice', 20, 'A');
console.log(john.introduce());
console.log(alice.study());
      `,
      exercises: [
        "Create a Vehicle class with Car and Motorcycle subclasses",
        "Build a module system for a simple library",
        "Implement static methods and properties",
      ],
    },
    {
      id: "js-error-handling",
      title: "Error Handling and Debugging",
      content: `
# Error Handling and Debugging

Learn how to handle errors gracefully and debug JavaScript code.

## Try-Catch and Error Types

Proper error handling techniques.
      `,
      codeExample: `
// Basic try-catch
try {
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  console.error('An error occurred:', error.message);
} finally {
  console.log('This always runs');
}

// Custom errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateAge(age) {
  if (age < 0 || age > 150) {
    throw new ValidationError('Age must be between 0 and 150');
  }
  return true;
}

// Async error handling
async function fetchUserData(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // Re-throw if needed
  }
}

// Promise error handling
fetchUserData(123)
  .then(user => console.log(user))
  .catch(error => console.error('Error:', error));
      `,
      exercises: [
        "Create custom error classes for different scenarios",
        "Implement error boundaries for async operations",
        "Build a logging system for error tracking",
      ],
    },
    {
      id: "js-advanced",
      title: "Advanced JavaScript Concepts",
      content: `
# Advanced JavaScript Concepts

Master advanced topics like prototypes, this binding, and performance optimization.

## Prototypes and Inheritance

Understanding JavaScript's prototype-based inheritance.
      `,
      codeExample: `
// Prototype methods
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return \`\${this.name} makes a sound\`;
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// Prototype inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return \`\${this.name} barks!\`;
};

// This binding
const obj = {
  name: 'Object',
  regularFunction: function() {
    console.log('Regular:', this.name);
  },
  arrowFunction: () => {
    console.log('Arrow:', this.name); // 'this' refers to global scope
  }
};

// Call, apply, bind
function introduce(greeting, punctuation) {
  return \`\${greeting}, I'm \${this.name}\${punctuation}\`;
}

const person = { name: 'John' };
console.log(introduce.call(person, 'Hello', '!'));
console.log(introduce.apply(person, ['Hi', '.']));
const boundIntroduce = introduce.bind(person);
console.log(boundIntroduce('Hey', '?'));
      `,
      exercises: [
        "Implement a prototype-based inheritance system",
        "Create methods that properly handle this binding",
        "Build a mixin system using Object.assign",
      ],
    },
  ],
  interviewQuestions: [
    {
      id: "js-q1",
      question: "What is the difference between let, const, and var?",
      answer:
        "var has function scope and is hoisted, let and const have block scope. const cannot be reassigned after declaration, while let can be. let and const are not hoisted in the same way as var.",
      difficulty: "beginner",
      category: "Variables",
      codeExample: `
// var - function scoped, hoisted
function example() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 - accessible outside block
}

// let - block scoped
function example2() {
  if (true) {
    let y = 1;
  }
  // console.log(y); // ReferenceError
}

// const - block scoped, cannot be reassigned
const z = 1;
// z = 2; // TypeError
      `,
    },
    {
      id: "js-q2",
      question: "Explain closures in JavaScript.",
      answer:
        "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created.",
      difficulty: "intermediate",
      category: "Functions",
      codeExample: `
function outerFunction(x) {
  return function innerFunction(y) {
    return x + y; // inner function has access to x
  };
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8

// Practical example
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
      `,
    },
    {
      id: "js-q3",
      question: "What is the difference between == and === in JavaScript?",
      answer:
        "== performs type coercion before comparison, while === performs strict comparison without type conversion. === is generally preferred for more predictable behavior.",
      difficulty: "beginner",
      category: "Operators",
      codeExample: `
// == with type coercion
console.log(5 == "5");    // true
console.log(true == 1);   // true
console.log(null == undefined); // true

// === strict comparison
console.log(5 === "5");   // false
console.log(true === 1);  // false
console.log(null === undefined); // false
      `,
    },
    {
      id: "js-q4",
      question: "Explain the concept of hoisting in JavaScript.",
      answer:
        "Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during compilation. Variables declared with var are hoisted but initialized with undefined, while let and const are hoisted but not initialized.",
      difficulty: "intermediate",
      category: "Scope",
      codeExample: `
// Function hoisting
console.log(hoistedFunction()); // "Hello!"

function hoistedFunction() {
  return "Hello!";
}

// Variable hoisting with var
console.log(x); // undefined (not ReferenceError)
var x = 5;

// let and const are hoisted but not initialized
// console.log(y); // ReferenceError
let y = 10;
      `,
    },
    {
      id: "js-q5",
      question: "What is the event loop in JavaScript?",
      answer:
        "The event loop is the mechanism that handles asynchronous operations in JavaScript. It continuously checks the call stack and task queue, moving tasks from the queue to the stack when the stack is empty.",
      difficulty: "advanced",
      category: "Asynchronous",
      codeExample: `
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// Output: 1, 4, 3, 2
// Promises have higher priority than setTimeout
      `,
    },
  ],
};

// Python Complete Tutorial
export const pythonTutorial: CompleteTutorial = {
  language: "python",
  title: "Complete Python Tutorial",
  description:
    "Master Python from basics to advanced concepts with hands-on examples",
  chapters: [
    {
      id: "py-basics",
      title: "Python Fundamentals",
      content: `
# Python Fundamentals

Python is a versatile, high-level programming language known for its simplicity and readability.

## Variables and Data Types

Python has several built-in data types:
- **Numbers**: 42, 3.14
- **Strings**: "Hello World"
- **Booleans**: True, False
- **Lists**: [1, 2, 3]
- **Dictionaries**: {"name": "John", "age": 30}
- **Tuples**: (1, 2, 3)
- **Sets**: {1, 2, 3}

## Variable Assignment

Python uses dynamic typing - no need to declare variable types.
      `,
      codeExample: `
# Variable assignments
name = "John"
age = 30
height = 5.9
is_student = True

# Data types
numbers = [1, 2, 3, 4, 5]
person = {
    "name": "Alice",
    "age": 25,
    "city": "Boston"
}
coordinates = (10, 20)
unique_numbers = {1, 2, 3, 4, 5}

# Type checking
print(type(name))      # <class 'str'>
print(type(age))       # <class 'int'>
print(type(height))    # <class 'float'>
print(type(is_student)) # <class 'bool'>
      `,
      exercises: [
        "Create variables for your personal information",
        "Create a list of your favorite books",
        "Create a dictionary representing a student with grades",
      ],
    },
    {
      id: "py-functions",
      title: "Functions and Modules",
      content: `
# Functions and Modules

Functions in Python are defined using the \`def\` keyword and are first-class objects.

## Function Definition and Arguments

Python supports various types of function arguments.
      `,
      codeExample: `
# Basic function
def greet(name):
    return f"Hello, {name}!"

# Function with default arguments
def greet_with_title(name, title="Mr."):
    return f"Hello, {title} {name}!"

# Function with variable arguments
def sum_all(*args):
    return sum(args)

# Function with keyword arguments
def create_profile(**kwargs):
    return kwargs

# Lambda functions
square = lambda x: x ** 2
add = lambda x, y: x + y

# Examples
print(greet("Alice"))
print(greet_with_title("Bob", "Dr."))
print(sum_all(1, 2, 3, 4, 5))
print(create_profile(name="John", age=30, city="NYC"))
print(square(5))
print(add(3, 7))
      `,
      exercises: [
        "Create a function that calculates the factorial of a number",
        "Write a function that takes a list and returns the average",
        "Create a lambda function that checks if a number is even",
      ],
    },
    {
      id: "py-oop",
      title: "Object-Oriented Programming",
      content: `
# Object-Oriented Programming in Python

Python supports full object-oriented programming with classes, inheritance, and polymorphism.

## Classes and Objects

Define classes to create custom data types and objects.
      `,
      codeExample: `
# Basic class definition
class Person:
    # Class variable
    species = "Homo sapiens"

    def __init__(self, name, age):
        # Instance variables
        self.name = name
        self.age = age

    def introduce(self):
        return f"Hi, I'm {self.name} and I'm {self.age} years old."

    def have_birthday(self):
        self.age += 1
        return f"Happy birthday! {self.name} is now {self.age}."

# Inheritance
class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)
        self.student_id = student_id
        self.grades = []

    def add_grade(self, grade):
        self.grades.append(grade)

    def get_average(self):
        if self.grades:
            return sum(self.grades) / len(self.grades)
        return 0

# Usage
person = Person("John", 30)
student = Student("Alice", 20, "S12345")

print(person.introduce())
print(student.introduce())
student.add_grade(85)
student.add_grade(92)
print(f"Average grade: {student.get_average()}")
      `,
      exercises: [
        "Create a Vehicle class with Car and Motorcycle subclasses",
        "Implement a BankAccount class with deposit and withdraw methods",
        "Build a library system with Book and Member classes",
      ],
    },
    {
      id: "py-data-structures",
      title: "Advanced Data Structures",
      content: `
# Advanced Data Structures

Master Python's built-in data structures and learn when to use each one.

## Lists, Tuples, Sets, and Dictionaries

Understanding the differences and use cases for each data structure.
      `,
      codeExample: `
# Lists - mutable, ordered
fruits = ['apple', 'banana', 'orange']
fruits.append('grape')
fruits.extend(['kiwi', 'mango'])
fruits.insert(1, 'strawberry')
print(f"Fruits: {fruits}")

# List comprehensions
squares = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(f"Squares: {squares}")
print(f"Even squares: {even_squares}")

# Tuples - immutable, ordered
coordinates = (10, 20)
person_info = ("John", 30, "Engineer")
name, age, job = person_info  # Tuple unpacking

# Sets - mutable, unordered, unique elements
unique_numbers = {1, 2, 3, 4, 5, 5, 5}  # Duplicates removed
set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}
print(f"Union: {set_a | set_b}")
print(f"Intersection: {set_a & set_b}")
print(f"Difference: {set_a - set_b}")

# Dictionaries - mutable, key-value pairs
student = {
    "name": "Alice",
    "age": 20,
    "grades": [85, 92, 78],
    "is_enrolled": True
}

# Dictionary comprehension
squared_dict = {x: x**2 for x in range(5)}
print(f"Squared dict: {squared_dict}")

# Advanced dictionary operations
student.update({"major": "Computer Science", "year": 2})
grades = student.get("grades", [])
print(f"Student info: {student}")
      `,
      exercises: [
        "Create a program that finds common elements between multiple lists",
        "Build a word frequency counter using dictionaries",
        "Implement a simple cache using a dictionary",
      ],
    },
    {
      id: "py-file-handling",
      title: "File Handling and I/O",
      content: `
# File Handling and Input/Output

Learn how to read from and write to files, handle different file formats.

## Reading and Writing Files

Python provides built-in functions for file operations.
      `,
      codeExample: `
# Writing to a file
with open('example.txt', 'w') as file:
    file.write("Hello, World!\\n")
    file.write("This is a test file.\\n")

# Reading from a file
with open('example.txt', 'r') as file:
    content = file.read()
    print("File content:", content)

# Reading line by line
with open('example.txt', 'r') as file:
    for line_number, line in enumerate(file, 1):
        print(f"Line {line_number}: {line.strip()}")

# Working with CSV files
import csv

# Writing CSV
students = [
    ['Name', 'Age', 'Grade'],
    ['Alice', 20, 'A'],
    ['Bob', 19, 'B'],
    ['Charlie', 21, 'A-']
]

with open('students.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(students)

# Reading CSV
with open('students.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# Working with JSON
import json

data = {
    "name": "John",
    "age": 30,
    "hobbies": ["reading", "swimming", "coding"]
}

# Write JSON
with open('data.json', 'w') as file:
    json.dump(data, file, indent=2)

# Read JSON
with open('data.json', 'r') as file:
    loaded_data = json.load(file)
    print("Loaded data:", loaded_data)
      `,
      exercises: [
        "Create a program that reads a text file and counts words",
        "Build a CSV processor that calculates student averages",
        "Implement a simple log file analyzer",
      ],
    },
    {
      id: "py-error-handling",
      title: "Error Handling and Exceptions",
      content: `
# Error Handling and Exceptions

Learn how to handle errors gracefully and create custom exceptions.

## Try-Except-Finally

Proper exception handling in Python.
      `,
      codeExample: `
# Basic exception handling
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("Invalid input! Please enter a valid number.")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
finally:
    print("This block always executes.")

# Custom exceptions
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        super().__init__(f"Insufficient funds: balance {balance}, attempted {amount}")

class BankAccount:
    def __init__(self, initial_balance=0):
        self.balance = initial_balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise InsufficientFundsError(self.balance, amount)
        self.balance -= amount
        return self.balance

# Using custom exceptions
account = BankAccount(100)
try:
    account.withdraw(150)
except InsufficientFundsError as e:
    print(f"Transaction failed: {e}")
      `,
      exercises: [
        "Create a robust file reader with proper error handling",
        "Build a calculator that handles all possible errors",
        "Implement a custom exception hierarchy for a banking system",
      ],
    },
    {
      id: "py-libraries",
      title: "Popular Python Libraries",
      content: `
# Popular Python Libraries

Explore essential Python libraries for different domains.

## Standard Library and Third-Party Packages

Learn about commonly used libraries and their applications.
      `,
      codeExample: `
# datetime - Working with dates and times
from datetime import datetime, timedelta, date

now = datetime.now()
print(f"Current time: {now}")

# Date arithmetic
tomorrow = now + timedelta(days=1)
last_week = now - timedelta(weeks=1)

# Formatting dates
formatted_date = now.strftime("%Y-%m-%d %H:%M:%S")
print(f"Formatted: {formatted_date}")

# os and pathlib - File system operations
import os
from pathlib import Path

# Current directory
current_dir = os.getcwd()
print(f"Current directory: {current_dir}")

# Path operations with pathlib
path = Path("data/files/example.txt")
print(f"Parent: {path.parent}")
print(f"Name: {path.name}")
print(f"Suffix: {path.suffix}")

# random - Random number generation
import random

# Random integers
random_int = random.randint(1, 100)
random_choice = random.choice(['apple', 'banana', 'orange'])
random_sample = random.sample(range(1, 11), 3)

print(f"Random int: {random_int}")
print(f"Random choice: {random_choice}")
print(f"Random sample: {random_sample}")

# collections - Specialized data structures
from collections import Counter, defaultdict, namedtuple

# Counter
text = "hello world"
letter_count = Counter(text)
print(f"Letter frequency: {letter_count}")

# defaultdict
dd = defaultdict(list)
dd['fruits'].append('apple')
dd['vegetables'].append('carrot')

# namedtuple
Point = namedtuple('Point', ['x', 'y'])
p = Point(10, 20)
print(f"Point: {p.x}, {p.y}")
      `,
      exercises: [
        "Create a date calculator that finds business days between dates",
        "Build a file organizer using os and pathlib",
        "Implement a lottery number generator using random",
      ],
    },
  ],
  interviewQuestions: [
    {
      id: "py-q1",
      question: "What is the difference between a list and a tuple in Python?",
      answer:
        "Lists are mutable (can be changed after creation) and use square brackets [], while tuples are immutable (cannot be changed) and use parentheses (). Lists have methods like append(), remove(), while tuples do not.",
      difficulty: "beginner",
      category: "Data Structures",
      codeExample: `
# List - mutable
my_list = [1, 2, 3]
my_list.append(4)  # Works
my_list[0] = 10    # Works
print(my_list)     # [10, 2, 3, 4]

# Tuple - immutable
my_tuple = (1, 2, 3)
# my_tuple.append(4)  # AttributeError
# my_tuple[0] = 10    # TypeError
print(my_tuple)     # (1, 2, 3)
      `,
    },
    {
      id: "py-q2",
      question: "Explain list comprehensions in Python.",
      answer:
        "List comprehensions provide a concise way to create lists. They consist of brackets containing an expression followed by a for clause, then zero or more for or if clauses.",
      difficulty: "intermediate",
      category: "Data Structures",
      codeExample: `
# Basic list comprehension
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)  # [0, 4, 16, 36, 64]

# Nested comprehension
matrix = [[i*j for j in range(3)] for i in range(3)]
print(matrix)  # [[0, 0, 0], [0, 1, 2], [0, 2, 4]]
      `,
    },
  ],
};

// Java Complete Tutorial
export const javaTutorial: CompleteTutorial = {
  language: "java",
  title: "Complete Java Tutorial",
  description:
    "Master Java programming from fundamentals to advanced OOP concepts",
  chapters: [
    {
      id: "java-basics",
      title: "Java Fundamentals",
      content: `
# Java Fundamentals

Java is a robust, object-oriented programming language designed for enterprise applications.

## Variables and Data Types

Java is statically typed - you must declare variable types:
- **Primitive types**: int, double, boolean, char
- **Reference types**: String, Arrays, Objects
- **Wrapper classes**: Integer, Double, Boolean

## Class Structure

Every Java program starts with a class and main method.
      `,
      codeExample: `
public class HelloWorld {
    public static void main(String[] args) {
        // Variable declarations
        int age = 25;
        double salary = 50000.50;
        boolean isEmployed = true;
        String name = "John Doe";

        // Arrays
        int[] numbers = {1, 2, 3, 4, 5};
        String[] names = new String[3];
        names[0] = "Alice";
        names[1] = "Bob";
        names[2] = "Charlie";

        // Output
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Salary: $" + salary);
        System.out.println("Employed: " + isEmployed);

        // Loop through array
        for (int number : numbers) {
            System.out.println("Number: " + number);
        }
    }
}
      `,
      exercises: [
        "Create a Java class with variables for student information",
        "Write a program that calculates the area of a rectangle",
        "Create an array of your favorite movies and print them",
      ],
    },
  ],
  interviewQuestions: [
    {
      id: "java-q1",
      question: "What is the difference between JDK, JRE, and JVM?",
      answer:
        "JVM (Java Virtual Machine) executes Java bytecode. JRE (Java Runtime Environment) includes JVM plus libraries needed to run Java applications. JDK (Java Development Kit) includes JRE plus development tools like compiler (javac).",
      difficulty: "beginner",
      category: "Core Concepts",
    },
    {
      id: "java-q2",
      question: "Explain the concept of inheritance in Java.",
      answer:
        'Inheritance allows a class to inherit properties and methods from another class. The child class (subclass) extends the parent class (superclass) using the "extends" keyword. Java supports single inheritance only.',
      difficulty: "intermediate",
      category: "OOP",
      codeExample: `
// Parent class
class Animal {
    protected String name;

    public void eat() {
        System.out.println(name + " is eating");
    }
}

// Child class
class Dog extends Animal {
    public Dog(String name) {
        this.name = name;
    }

    public void bark() {
        System.out.println(name + " is barking");
    }
}

// Usage
Dog dog = new Dog("Buddy");
dog.eat();  // Inherited method
dog.bark(); // Own method
      `,
    },
  ],
};

// React Complete Tutorial
export const reactTutorial: CompleteTutorial = {
  language: "react",
  title: "Complete React Tutorial",
  description: "Master React.js for building modern user interfaces",
  chapters: [
    {
      id: "react-basics",
      title: "React Fundamentals",
      content: `
# React Fundamentals

React is a JavaScript library for building user interfaces, particularly web applications.

## Components and JSX

React applications are built using components - reusable pieces of UI.
JSX allows you to write HTML-like syntax in JavaScript.

## State and Props

- **Props**: Data passed from parent to child components
- **State**: Internal data that can change over time
      `,
      codeExample: `
import React, { useState } from 'react';

// Functional Component with Props
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Component with State
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <div>
      <Greeting name="Alice" age={25} />
      <Counter />
    </div>
  );
}

export default App;
      `,
      exercises: [
        "Create a component that displays user profile information",
        "Build a todo list component with add/remove functionality",
        "Create a form component with controlled inputs",
      ],
    },
    {
      id: "react-hooks",
      title: "React Hooks Deep Dive",
      content: `
# React Hooks Deep Dive

Master React Hooks for modern functional component development.

## useState, useEffect, and Custom Hooks

Learn the most important hooks and how to create your own.
      `,
      codeExample: `
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Custom hook for API calls
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Component using multiple hooks
function UserProfile({ userId }) {
  const { data: user, loading, error } = useApi(\`/api/users/\${userId}\`);
  const [favorites, setFavorites] = useLocalStorage('favorites', []);

  const addToFavorites = useCallback((item) => {
    setFavorites(prev => [...prev, item]);
  }, [setFavorites]);

  const favoriteCount = useMemo(() => favorites.length, [favorites]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Favorites: {favoriteCount}</p>
      <button onClick={() => addToFavorites(user)}>
        Add to Favorites
      </button>
    </div>
  );
}
      `,
      exercises: [
        "Create a custom hook for form validation",
        "Build a useDebounce hook for search functionality",
        "Implement a useToggle hook for boolean state",
      ],
    },
    {
      id: "react-context",
      title: "Context API and State Management",
      content: `
# Context API and State Management

Learn to manage global state without external libraries.

## React Context and useReducer

Advanced state management patterns in React.
      `,
      codeExample: `
import React, { createContext, useContext, useReducer } from 'react';

// Define action types
const ActionTypes = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO'
};

// Reducer function
function todoReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          completed: false
        }]
      };
    case ActionTypes.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case ActionTypes.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    default:
      return state;
  }
}

// Create context
const TodoContext = createContext();

// Provider component
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: []
  });

  const addTodo = (text) => {
    dispatch({ type: ActionTypes.ADD_TODO, payload: text });
  };

  const toggleTodo = (id) => {
    dispatch({ type: ActionTypes.TOGGLE_TODO, payload: id });
  };

  const deleteTodo = (id) => {
    dispatch({ type: ActionTypes.DELETE_TODO, payload: id });
  };

  return (
    <TodoContext.Provider value={{
      ...state,
      addTodo,
      toggleTodo,
      deleteTodo
    }}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook to use context
export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
}
      `,
      exercises: [
        "Create a theme context for dark/light mode",
        "Build a shopping cart context with complex state",
        "Implement user authentication context",
      ],
    },
    {
      id: "react-routing",
      title: "React Router and Navigation",
      content: `
# React Router and Navigation

Learn to build single-page applications with client-side routing.

## React Router v6 and Navigation Patterns

Modern routing techniques for React applications.
      `,
      codeExample: `
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  Navigate
} from 'react-router-dom';

// Layout component
function Layout({ children }) {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}

// Protected route component
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth(); // Custom hook

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Product detail component with params
function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back in history
  };

  return (
    <div>
      <h1>Product {id}</h1>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}

// Main App with routing
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
      `,
      exercises: [
        "Create a multi-level navigation system",
        "Implement route guards for authentication",
        "Build a breadcrumb navigation component",
      ],
    },
  ],
  interviewQuestions: [
    {
      id: "react-q1",
      question: "What is the Virtual DOM in React?",
      answer:
        "The Virtual DOM is a JavaScript representation of the real DOM. React uses it to optimize updates by comparing the virtual DOM with the previous version (diffing) and only updating the parts that changed (reconciliation).",
      difficulty: "intermediate",
      category: "Core Concepts",
    },
    {
      id: "react-q2",
      question: "What are React Hooks?",
      answer:
        "Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, useContext, and useReducer. They were introduced in React 16.8.",
      difficulty: "intermediate",
      category: "Hooks",
      codeExample: `
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data when component mounts or userId changes
    fetchUser(userId)
      .then(userData => {
        setUser(userData);
        setLoading(false);
      });
  }, [userId]); // Dependency array

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
      `,
    },
  ],
};

// Quick tutorials for remaining languages
const quickTutorials = {
  cpp: {
    language: "cpp",
    title: "Complete C++ Tutorial",
    description: "Master C++ programming from basics to advanced concepts",
    chapters: [
      {
        id: "cpp-basics",
        title: "C++ Fundamentals",
        content:
          "C++ is a powerful, general-purpose programming language that supports both procedural and object-oriented programming.",
        codeExample: `
#include <iostream>
#include <vector>
#include <string>

int main() {
    // Variables
    int age = 25;
    std::string name = "John";

    // Vector (dynamic array)
    std::vector<int> numbers = {1, 2, 3, 4, 5};

    // Output
    std::cout << "Name: " << name << std::endl;
    std::cout << "Age: " << age << std::endl;

    return 0;
}
        `,
        exercises: [
          "Create a class with constructor and methods",
          "Implement basic pointer operations",
        ],
      },
    ],
    interviewQuestions: [
      {
        id: "cpp-q1",
        question: "What is the difference between malloc() and new in C++?",
        answer:
          "malloc() is a C function that allocates raw memory, while new is a C++ operator that allocates memory and calls constructors. new is type-safe and should be preferred in C++.",
        difficulty: "intermediate",
        category: "Memory Management",
      },
    ],
  },
  go: {
    language: "go",
    title: "Complete Go Tutorial",
    description: "Master Go programming for modern software development",
    chapters: [
      {
        id: "go-basics",
        title: "Go Fundamentals",
        content:
          "Go is a statically typed, compiled programming language designed for simplicity and efficiency.",
        codeExample: `
package main

import (
    "fmt"
    "time"
)

func main() {
    // Variables
    var name string = "John"
    age := 30 // Short declaration

    // Slice
    numbers := []int{1, 2, 3, 4, 5}

    // Map
    person := map[string]interface{}{
        "name": name,
        "age":  age,
    }

    fmt.Printf("Person: %+v\\n", person)
    fmt.Printf("Numbers: %v\\n", numbers)
}
        `,
        exercises: [
          "Create a struct with methods",
          "Implement goroutines for concurrency",
        ],
      },
    ],
    interviewQuestions: [
      {
        id: "go-q1",
        question: "What are goroutines in Go?",
        answer:
          "Goroutines are lightweight threads managed by the Go runtime. They enable concurrent execution and are much more efficient than OS threads.",
        difficulty: "intermediate",
        category: "Concurrency",
      },
    ],
  },
  rust: {
    language: "rust",
    title: "Complete Rust Tutorial",
    description: "Master Rust programming for systems development",
    chapters: [
      {
        id: "rust-basics",
        title: "Rust Fundamentals",
        content:
          "Rust is a systems programming language focused on safety, speed, and concurrency.",
        codeExample: `
fn main() {
    // Variables
    let name = "John";
    let mut age = 30; // mutable

    // Vector
    let numbers = vec![1, 2, 3, 4, 5];

    // Struct
    struct Person {
        name: String,
        age: u32,
    }

    let person = Person {
        name: String::from("Alice"),
        age: 25,
    };

    println!("Person: {} is {} years old", person.name, person.age);
}
        `,
        exercises: [
          "Implement ownership and borrowing",
          "Create error handling with Result",
        ],
      },
    ],
    interviewQuestions: [
      {
        id: "rust-q1",
        question: "What is ownership in Rust?",
        answer:
          "Ownership is Rust's unique approach to memory management. Each value has a single owner, and when the owner goes out of scope, the value is dropped, preventing memory leaks.",
        difficulty: "advanced",
        category: "Memory Management",
      },
    ],
  },
};

// Export all tutorials - Now with 30 chapters each and 50+ interview questions
export const completeTutorials = {
  javascript: mega30Tutorials.javascript,
  python: mega30Tutorials.python,
  java: mega30Tutorials.java,
  react: mega30Tutorials.react,
  nodejs: mega30Tutorials.nodejs,
  typescript: mega30Tutorials.typescript,
  csharp: mega30Tutorials.csharp,
  cpp: mega30Tutorials.cpp,
  go: mega30Tutorials.go,
  rust: mega30Tutorials.rust,
};
