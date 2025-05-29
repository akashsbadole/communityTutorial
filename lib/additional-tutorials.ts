import { CompleteTutorial } from "./complete-tutorials";

// Node.js Complete Tutorial
export const nodejsTutorial: CompleteTutorial = {
  language: "nodejs",
  title: "Complete Node.js Tutorial",
  description: "Master server-side JavaScript with Node.js",
  chapters: [
    {
      id: "node-basics",
      title: "Node.js Fundamentals",
      content: `
# Node.js Fundamentals

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine for server-side development.

## Core Modules

Node.js provides built-in modules for common tasks:
- **fs**: File system operations
- **http**: HTTP server and client
- **path**: File path utilities
- **os**: Operating system utilities

## NPM (Node Package Manager)

NPM is the package manager for Node.js, allowing you to install and manage dependencies.
      `,
      codeExample: `
// Import core modules
const fs = require('fs');
const http = require('http');
const path = require('path');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from Node.js!</h1>');
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

// File operations
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});

// Write to file
fs.writeFile('output.txt', 'Hello Node.js!', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully');
});
      `,
      exercises: [
        "Create a simple web server that serves different routes",
        "Build a file reader that processes CSV data",
        "Create a REST API with basic CRUD operations",
      ],
    },
  ],
  interviewQuestions: [
    {
      id: "node-q1",
      question: "What is the Event Loop in Node.js?",
      answer:
        "The Event Loop is the core of Node.js asynchronous architecture. It continuously checks for and executes callbacks from the event queue, allowing Node.js to handle many concurrent operations without blocking.",
      difficulty: "intermediate",
      category: "Core Concepts",
    },
    {
      id: "node-q2",
      question:
        "What is the difference between require() and import in Node.js?",
      answer:
        "require() is CommonJS syntax for importing modules (synchronous), while import is ES6 module syntax (asynchronous). Node.js traditionally uses require(), but newer versions support ES6 imports with proper configuration.",
      difficulty: "intermediate",
      category: "Modules",
      codeExample: `
// CommonJS (require)
const express = require('express');
const { readFile } = require('fs');

// ES6 Modules (import)
import express from 'express';
import { readFile } from 'fs';

// Dynamic import
const module = await import('./myModule.js');
      `,
    },
    {
      id: "node-express",
      title: "Express.js and Web APIs",
      content: `
# Express.js and Web APIs

Learn to build robust web applications and APIs with Express.js.

## RESTful APIs and Middleware

Creating scalable server-side applications.
      `,
      codeExample: `
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Custom middleware
const logger = (req, res, next) => {
  console.log(\`\${new Date().toISOString()} - \${req.method} \${req.path}\`);
  next();
};

app.use(logger);

// In-memory data store
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Routes
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
      `,
      exercises: [
        "Create a complete CRUD API for a blog system",
        "Implement authentication middleware with JWT",
        "Build a file upload endpoint with validation",
      ],
    },
    {
      id: "node-database",
      title: "Database Integration",
      content: `
# Database Integration with Node.js

Learn to work with databases using popular ORMs and drivers.

## MongoDB with Mongoose

Database operations and data modeling.
      `,
      codeExample: `
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp');

// Define schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Create model
const User = mongoose.model('User', userSchema);

// CRUD operations
async function createUser(userData) {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Failed to create user: ' + error.message);
  }
}

async function findUsers(query = {}) {
  try {
    return await User.find(query);
  } catch (error) {
    throw new Error('Failed to find users: ' + error.message);
  }
}

async function updateUser(id, updateData) {
  try {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw new Error('Failed to update user: ' + error.message);
  }
}

// Usage examples
async function examples() {
  const newUser = await createUser({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  });

  const users = await findUsers({ age: { $gte: 18 } });
  console.log('Adult users:', users);
}
      `,
      exercises: [
        "Create a complete user management system with MongoDB",
        "Build an e-commerce product catalog",
        "Implement data validation and error handling",
      ],
    },
    {
      id: "node-testing",
      title: "Testing Node.js Applications",
      content: `
# Testing Node.js Applications

Learn to write comprehensive tests for your Node.js applications.

## Jest and Supertest

Unit testing and API testing.
      `,
      codeExample: `
// User service to test
class UserService {
  constructor(database) {
    this.db = database;
  }

  async createUser(userData) {
    if (!userData.email || !userData.name) {
      throw new Error('Email and name are required');
    }

    const existingUser = await this.db.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    return await this.db.createUser(userData);
  }
}

// Unit tests with Jest
describe('UserService', () => {
  let userService;
  let mockDatabase;

  beforeEach(() => {
    mockDatabase = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn()
    };
    userService = new UserService(mockDatabase);
  });

  test('should create user with valid data', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    const createdUser = { id: 1, ...userData };

    mockDatabase.findUserByEmail.mockResolvedValue(null);
    mockDatabase.createUser.mockResolvedValue(createdUser);

    const result = await userService.createUser(userData);

    expect(result).toEqual(createdUser);
  });

  test('should throw error if email is missing', async () => {
    const userData = { name: 'John' };

    await expect(userService.createUser(userData))
      .rejects.toThrow('Email and name are required');
  });
});

// API integration tests with Supertest
const request = require('supertest');
const app = require('./app');

describe('User API', () => {
  test('should create new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body).toMatchObject(userData);
  });
});
      `,
      exercises: [
        "Write comprehensive unit tests for a service class",
        "Create integration tests for a REST API",
        "Implement test coverage reporting",
      ],
    },
  ],
  interviewQuestions: [
    {
      id: "node-q1",
      question: "What is the Event Loop in Node.js?",
      answer:
        "The Event Loop is the core of Node.js asynchronous architecture. It continuously checks for and executes callbacks from the event queue, allowing Node.js to handle many concurrent operations without blocking.",
      difficulty: "intermediate",
      category: "Core Concepts",
    },
    {
      id: "node-q2",
      question:
        "What is the difference between require() and import in Node.js?",
      answer:
        "require() is CommonJS syntax for importing modules (synchronous), while import is ES6 module syntax (asynchronous). Node.js traditionally uses require(), but newer versions support ES6 imports with proper configuration.",
      difficulty: "intermediate",
      category: "Modules",
    },
    {
      id: "node-q3",
      question: "What is middleware in Express.js?",
      answer:
        "Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle. They can execute code, modify req/res objects, end the request-response cycle, or call the next middleware.",
      difficulty: "intermediate",
      category: "Express.js",
    },
    {
      id: "node-q4",
      question: "How do you handle errors in Node.js?",
      answer:
        'Node.js uses error-first callbacks, try-catch blocks for synchronous code, and .catch() for promises. For unhandled errors, use process.on("uncaughtException") and process.on("unhandledRejection") event listeners.',
      difficulty: "intermediate",
      category: "Error Handling",
    },
    {
      id: "node-q5",
      question:
        "What is the difference between process.nextTick() and setImmediate()?",
      answer:
        "process.nextTick() executes callbacks before the next iteration of the event loop, while setImmediate() executes callbacks in the next iteration. nextTick has higher priority and can potentially starve the event loop if used excessively.",
      difficulty: "advanced",
      category: "Event Loop",
    },
  ],
};

// TypeScript Complete Tutorial
export const typescriptTutorial: CompleteTutorial = {
  language: "typescript",
  title: "Complete TypeScript Tutorial",
  description: "Master TypeScript for type-safe JavaScript development",
  chapters: [
    {
      id: "ts-basics",
      title: "TypeScript Fundamentals",
      content: `
# TypeScript Fundamentals

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

## Type Annotations

TypeScript adds static type checking to JavaScript:
- **Basic types**: string, number, boolean
- **Arrays**: string[], number[]
- **Objects**: { name: string, age: number }
- **Functions**: (x: number) => string

## Interfaces and Types

Define custom types for better code organization and type safety.
      `,
      codeExample: `
// Basic type annotations
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["Alice", "Bob", "Charlie"];

// Functions with types
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const add = (x: number, y: number): number => x + y;

// Interfaces
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
}

// Using interfaces
const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};

// Generic types
function identity<T>(arg: T): T {
  return arg;
}

const stringResult = identity<string>("hello");
const numberResult = identity<number>(42);
      `,
      exercises: [
        "Create an interface for a Product with price, name, and category",
        "Write a generic function that works with arrays of any type",
        "Define a type for API response with success/error states",
      ],
    },
    {
      id: "ts-advanced-types",
      title: "Advanced Types",
      content: `
# Advanced Types in TypeScript

Master complex type operations and advanced TypeScript features.

## Union and Intersection Types

Combine types for flexible and powerful type definitions.
      `,
      codeExample: `
// Union types
type Status = 'loading' | 'success' | 'error';
type ID = string | number;

function handleStatus(status: Status) {
  switch (status) {
    case 'loading':
      console.log('Loading...');
      break;
    case 'success':
      console.log('Success!');
      break;
    case 'error':
      console.log('Error occurred');
      break;
  }
}

// Intersection types
interface User {
  name: string;
  email: string;
}

interface Admin {
  permissions: string[];
  role: 'admin';
}

type AdminUser = User & Admin;

const adminUser: AdminUser = {
  name: 'John',
  email: 'john@example.com',
  permissions: ['read', 'write', 'delete'],
  role: 'admin'
};

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type StringOrNumber<T> = T extends string ? string : number;

// Mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Utility types
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>;
type TodoInfo = Omit<Todo, 'completed'>;
type OptionalTodo = Partial<Todo>;
type RequiredTodo = Required<Todo>;
      `,
      exercises: [
        "Create a union type for different payment methods",
        "Build an intersection type combining multiple interfaces",
        "Use utility types to create variations of an interface",
      ],
    },
    {
      id: "ts-generics",
      title: "Generics",
      content: `
# Generics in TypeScript

Create reusable components that work with multiple types.

## Generic Functions and Classes

Write flexible, type-safe code that works with any type.
      `,
      codeExample: `
// Generic functions
function identity<T>(arg: T): T {
  return arg;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Generic interfaces
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  findAll(): Promise<T[]>;
}

// Generic classes
class DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  get(index: number): T | undefined {
    return this.data[index];
  }

  getAll(): T[] {
    return [...this.data];
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.data.filter(predicate);
  }
}

// Generic constraints
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Multiple type parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// Generic with default types
interface APIResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

// Usage examples
const userStore = new DataStore<User>();
const numberStore = new DataStore<number>();

const userRepo: Repository<User> = {
  async findById(id: string) {
    // Implementation
    return null;
  },
  async save(user: User) {
    // Implementation
    return user;
  },
  async delete(id: string) {
    // Implementation
  },
  async findAll() {
    // Implementation
    return [];
  }
};
      `,
      exercises: [
        "Create a generic Stack class with push/pop operations",
        "Build a generic API client with type-safe methods",
        "Implement a generic event emitter system",
      ],
    },
    {
      id: "ts-decorators",
      title: "Decorators",
      content: `
# Decorators in TypeScript

Use decorators to add metadata and modify classes, methods, and properties.

## Class and Method Decorators

Enhance your classes with powerful decorator patterns.
      `,
      codeExample: `
// Enable decorators in tsconfig.json:
// "experimentalDecorators": true

// Class decorator
function Component(target: any) {
  target.prototype.isComponent = true;
  target.prototype.render = function() {
    console.log('Rendering component...');
  };
}

// Method decorator
function Log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(\`Calling \${propertyName} with args: \`, args);
    const result = method.apply(this, args);
    console.log(\`Method \${propertyName} returned: \`, result);
    return result;
  };
}

// Property decorator
function Required(target: any, propertyName: string) {
  let value: any;

  const getter = () => {
    return value;
  };

  const setter = (newVal: any) => {
    if (newVal === null || newVal === undefined) {
      throw new Error(\`Property \${propertyName} is required\`);
    }
    value = newVal;
  };

  Object.defineProperty(target, propertyName, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}

// Parameter decorator
function Validate(target: any, propertyName: string, parameterIndex: number) {
  console.log(\`Validating parameter \${parameterIndex} of method \${propertyName}\`);
}

// Usage
@Component
class MyComponent {
  @Required
  public name: string;

  @Log
  public greet(@Validate message: string): string {
    return \`Hello, \${message}!\`;
  }

  @Log
  public calculate(a: number, b: number): number {
    return a + b;
  }
}

// Decorator factory
function MinLength(length: number) {
  return function (target: any, propertyName: string) {
    let value: string;

    const getter = () => value;
    const setter = (newVal: string) => {
      if (newVal.length < length) {
        throw new Error(\`\${propertyName} must be at least \${length} characters\`);
      }
      value = newVal;
    };

    Object.defineProperty(target, propertyName, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

class User {
  @MinLength(3)
  public username: string;

  @MinLength(8)
  public password: string;
}
      `,
      exercises: [
        "Create a @Throttle decorator for method rate limiting",
        "Build a @Cache decorator for method result caching",
        "Implement a @Authorize decorator for access control",
      ],
    },
    {
      id: "ts-modules",
      title: "Modules and Namespaces",
      content: `
# Modules and Namespaces

Organize your TypeScript code with modules and namespaces.

## ES6 Modules and Declaration Merging

Structure large applications with proper module organization.
      `,
      codeExample: `
// math.ts - Module exports
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

export default class Calculator {
  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }
}

// types.ts - Type exports
export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserRole = 'admin' | 'user' | 'guest';

export enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}

// main.ts - Module imports
import Calculator, { add, subtract, PI } from './math';
import { User, UserRole, Status } from './types';
import * as MathUtils from './math';

const calc = new Calculator();
const result = add(5, 3);
const area = PI * calc.multiply(5, 5);

// Namespace example
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  export class EmailValidator implements StringValidator {
    isAcceptable(s: string): boolean {
      return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(s);
    }
  }

  export class PhoneValidator implements StringValidator {
    isAcceptable(s: string): boolean {
      return /^\\d{10}$/.test(s);
    }
  }
}

// Using namespace
const emailValidator = new Validation.EmailValidator();
const isValidEmail = emailValidator.isAcceptable('test@example.com');

// Declaration merging
interface Window {
  myCustomProperty: string;
}

// Ambient modules
declare module 'lodash' {
  export function chunk<T>(array: T[], size: number): T[][];
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): T;
}

// Module augmentation
declare module './types' {
  interface User {
    lastLogin?: Date;
  }
}

// Re-exports
export { User, UserRole } from './types';
export { default as Calculator } from './math';
      `,
      exercises: [
        "Create a modular validation library with multiple validators",
        "Build a plugin system using namespaces and modules",
        "Implement module augmentation for third-party libraries",
      ],
    },
    {
      id: "ts-async",
      title: "Async Programming",
      content: `
# Asynchronous Programming in TypeScript

Master async/await, Promises, and type-safe asynchronous operations.

## Promises, Async/Await, and Error Handling

Write robust asynchronous code with proper typing.
      `,
      codeExample: `
// Promise types
function fetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({
          id,
          name: 'John Doe',
          email: 'john@example.com'
        });
      } else {
        reject(new Error('Invalid user ID'));
      }
    }, 1000);
  });
}

// Async/await with proper typing
async function getUserData(id: number): Promise<User | null> {
  try {
    const user = await fetchUser(id);
    console.log('User fetched:', user);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Generic async functions
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return response.json() as Promise<T>;
}

// Promise utilities
async function fetchMultipleUsers(ids: number[]): Promise<User[]> {
  const promises = ids.map(id => fetchUser(id));

  try {
    const users = await Promise.all(promises);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

async function fetchFirstAvailableUser(ids: number[]): Promise<User | null> {
  const promises = ids.map(id => fetchUser(id));

  try {
    const user = await Promise.race(promises);
    return user;
  } catch (error) {
    console.error('All requests failed:', error);
    return null;
  }
}

// Async iterators
async function* generateNumbers(): AsyncGenerator<number, void, unknown> {
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i;
  }
}

async function processNumbers() {
  for await (const num of generateNumbers()) {
    console.log('Generated number:', num);
  }
}

// Error handling with custom types
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function safeApiCall<T>(
  apiCall: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await apiCall();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Usage
async function example() {
  const result = await safeApiCall(() => fetchUser(1));

  if (result.success) {
    console.log('User:', result.data);
  } else {
    console.error('Error:', result.error.message);
  }
}

// Timeout wrapper
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ]);
}
      `,
      exercises: [
        "Create a retry mechanism for failed async operations",
        "Build a queue system for managing concurrent async tasks",
        "Implement a caching layer for async API calls",
      ],
    },
  ],
  interviewQuestions: [
    {
      id: "ts-q1",
      question: "What are the benefits of using TypeScript over JavaScript?",
      answer:
        "TypeScript provides static type checking, better IDE support with autocomplete and refactoring, early error detection, improved code documentation, and better maintainability for large codebases.",
      difficulty: "beginner",
      category: "Core Concepts",
    },
    {
      id: "ts-q2",
      question:
        "What is the difference between interface and type in TypeScript?",
      answer:
        "Interfaces can be extended and merged, while types are more flexible and can represent unions, intersections, and computed types. Interfaces are better for object shapes, types are better for complex type operations.",
      difficulty: "intermediate",
      category: "Types",
      codeExample: `
// Interface
interface User {
  name: string;
  age: number;
}

interface User {
  email: string; // Declaration merging
}

// Type
type UserType = {
  name: string;
  age: number;
};

type Status = "active" | "inactive"; // Union type
type UserWithStatus = UserType & { status: Status }; // Intersection
      `,
    },
  ],
};

// C# Complete Tutorial
export const csharpTutorial: CompleteTutorial = {
  language: "csharp",
  title: "Complete C# Tutorial",
  description: "Master C# programming for .NET development",
  chapters: [
    {
      id: "cs-basics",
      title: "C# Fundamentals",
      content: `
# C# Fundamentals

C# is a modern, object-oriented programming language developed by Microsoft for the .NET platform.

## Variables and Data Types

C# is strongly typed with both value and reference types:
- **Value types**: int, double, bool, char, struct
- **Reference types**: string, class, interface, array
- **Nullable types**: int?, string?

## Classes and Objects

C# is object-oriented with classes as blueprints for objects.
      `,
      codeExample: `
using System;

// Class definition
public class Person
{
    // Properties
    public string Name { get; set; }
    public int Age { get; set; }

    // Constructor
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }

    // Method
    public void Introduce()
    {
        Console.WriteLine($"Hi, I'm {Name} and I'm {Age} years old.");
    }
}

// Main program
class Program
{
    static void Main(string[] args)
    {
        // Variable declarations
        int number = 42;
        string text = "Hello World";
        bool isTrue = true;

        // Arrays
        int[] numbers = { 1, 2, 3, 4, 5 };
        string[] names = new string[3] { "Alice", "Bob", "Charlie" };

        // Object creation
        Person person = new Person("John", 30);
        person.Introduce();

        // LINQ example
        var evenNumbers = numbers.Where(n => n % 2 == 0).ToArray();
        Console.WriteLine($"Even numbers: {string.Join(", ", evenNumbers)}");
    }
}
      `,
      exercises: [
        "Create a Student class with properties and methods",
        "Build a simple calculator class with basic operations",
        "Create a list of objects and filter them using LINQ",
      ],
    },
  ],
  interviewQuestions: [
    {
      id: "cs-q1",
      question:
        "What is the difference between value types and reference types in C#?",
      answer:
        "Value types store data directly and are allocated on the stack (int, bool, struct). Reference types store a reference to data allocated on the heap (class, string, array). Value types are copied by value, reference types by reference.",
      difficulty: "intermediate",
      category: "Memory Management",
    },
    {
      id: "cs-q2",
      question: "What is garbage collection in C#?",
      answer:
        "Garbage collection is automatic memory management in .NET. The GC automatically frees memory used by objects that are no longer referenced, preventing memory leaks and reducing manual memory management.",
      difficulty: "intermediate",
      category: "Memory Management",
    },
  ],
};

// Export additional tutorials
export const additionalTutorials = {
  nodejs: nodejsTutorial,
  typescript: typescriptTutorial,
  csharp: csharpTutorial,
};
