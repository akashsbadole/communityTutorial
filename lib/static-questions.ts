// Static interview questions for all programming languages
// 30 questions per language with random selection

export interface StaticQuestion {
  id: string;
  question_title: string;
  question_text: string;
  answer_text: string;
  code_example?: string;
  explanation?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  time_to_answer: number;
  tags: string[];
}

export const staticQuestions: Record<string, StaticQuestion[]> = {
  javascript: [
    {
      id: "js_001",
      question_title: "What are the different data types in JavaScript?",
      question_text:
        "Explain the primitive and non-primitive data types available in JavaScript.",
      answer_text:
        "JavaScript has 7 primitive types: undefined, null, boolean, number, string, symbol, and bigint. Non-primitive types include objects, arrays, and functions.",
      code_example: `// Primitive types
let str = "Hello";
let num = 42;
let bool = true;
let undef = undefined;
let nul = null;

// Non-primitive types
let obj = { name: "John" };
let arr = [1, 2, 3];
let func = function() {};`,
      explanation:
        "Primitive types are immutable and stored by value, while non-primitive types are mutable and stored by reference.",
      difficulty: "beginner",
      category: "Basics",
      time_to_answer: 180,
      tags: ["data-types", "primitives", "objects"],
    },
    {
      id: "js_002",
      question_title: "What is hoisting in JavaScript?",
      question_text:
        "Explain the concept of hoisting and how it affects variable and function declarations.",
      answer_text:
        "Hoisting is JavaScript's behavior of moving declarations to the top of their scope during compilation. Variables declared with var are hoisted and initialized with undefined, while let and const are hoisted but not initialized.",
      code_example: `console.log(x); // undefined (not error)
var x = 5;

console.log(y); // ReferenceError
let y = 10;

// Function hoisting
sayHello(); // Works!
function sayHello() {
  console.log("Hello!");
}`,
      explanation:
        "Function declarations are fully hoisted, while function expressions and arrow functions are not.",
      difficulty: "intermediate",
      category: "Concepts",
      time_to_answer: 240,
      tags: ["hoisting", "scope", "variables"],
    },
    {
      id: "js_003",
      question_title: "What is the difference between == and === operators?",
      question_text:
        "Explain the difference between loose equality and strict equality operators.",
      answer_text:
        "== performs type coercion before comparison, while === compares both value and type without coercion.",
      code_example: `console.log(5 == "5");  // true (type coercion)
console.log(5 === "5"); // false (strict comparison)
console.log(null == undefined);  // true
console.log(null === undefined); // false`,
      explanation:
        "Always prefer === for predictable comparisons unless you specifically need type coercion.",
      difficulty: "beginner",
      category: "Operators",
      time_to_answer: 150,
      tags: ["operators", "comparison", "type-coercion"],
    },
    {
      id: "js_004",
      question_title: "What is a closure in JavaScript?",
      question_text: "Explain closures and provide a practical example.",
      answer_text:
        "A closure is a function that has access to variables in its outer scope even after the outer function has returned.",
      code_example: `function outerFunction(x) {
  return function innerFunction(y) {
    return x + y; // x is from outer scope
  };
}

const add5 = outerFunction(5);
console.log(add5(3)); // 8

// Practical example: Counter
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2`,
      explanation:
        "Closures are useful for data privacy, function factories, and maintaining state.",
      difficulty: "intermediate",
      category: "Functions",
      time_to_answer: 300,
      tags: ["closures", "scope", "functions"],
    },
    {
      id: "js_005",
      question_title: "What is the event loop in JavaScript?",
      question_text:
        "Explain how the event loop works and its role in asynchronous JavaScript.",
      answer_text:
        "The event loop is a mechanism that handles asynchronous operations by managing the call stack, callback queue, and microtask queue.",
      code_example: `console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// Output: 1, 4, 3, 2`,
      explanation:
        "Microtasks (Promises) have higher priority than macrotasks (setTimeout) in the event loop.",
      difficulty: "advanced",
      category: "Async Programming",
      time_to_answer: 360,
      tags: ["event-loop", "asynchronous", "promises"],
    },
    {
      id: "js_006",
      question_title: "What is the difference between let, const, and var?",
      question_text:
        "Explain the differences between let, const, and var declarations in JavaScript.",
      answer_text:
        "var is function-scoped and hoisted with undefined initialization. let and const are block-scoped and hoisted but not initialized (temporal dead zone). const cannot be reassigned.",
      code_example: `// var - function scoped
function example() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 (accessible)
}

// let - block scoped
function example2() {
  if (true) {
    let y = 1;
  }
  console.log(y); // ReferenceError
}

// const - block scoped, cannot reassign
const z = 1;
z = 2; // TypeError`,
      explanation:
        "Use const by default, let when you need to reassign, avoid var in modern JavaScript.",
      difficulty: "beginner",
      category: "Variables",
      time_to_answer: 180,
      tags: ["variables", "scope", "hoisting"],
    },
    {
      id: "js_007",
      question_title: "What is the this keyword in JavaScript?",
      question_text:
        "Explain how the this keyword works in different contexts.",
      answer_text:
        "The this keyword refers to the object that is executing the current function. Its value depends on how the function is called.",
      code_example: `// Global context
console.log(this); // window (browser) or global (Node.js)

// Object method
const obj = {
  name: 'John',
  greet() {
    console.log(this.name); // 'John'
  }
};

// Arrow functions
const obj2 = {
  name: 'Jane',
  greet: () => {
    console.log(this.name); // undefined (inherits from enclosing scope)
  }
};

// Call/Apply/Bind
function sayHello() {
  console.log(\`Hello, \${this.name}\`);
}
sayHello.call({ name: 'Alice' }); // 'Hello, Alice'`,
      explanation:
        "Arrow functions do not have their own this binding and inherit from the enclosing scope.",
      difficulty: "intermediate",
      category: "Functions",
      time_to_answer: 300,
      tags: ["this", "context", "arrow-functions"],
    },
    {
      id: "js_008",
      question_title: "What is prototypal inheritance?",
      question_text:
        "Explain prototypal inheritance in JavaScript and how it works.",
      answer_text:
        "Prototypal inheritance is a feature where objects can inherit properties and methods from other objects through the prototype chain.",
      code_example: `// Constructor function
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return \`Hello, I'm \${this.name}\`;
};

// Create instance
const john = new Person('John');
console.log(john.greet()); // 'Hello, I'm John'

// Object.create
const personProto = {
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
};

const jane = Object.create(personProto);
jane.name = 'Jane';
console.log(jane.greet()); // 'Hello, I'm Jane'

// ES6 Classes (syntactic sugar)
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return \`\${this.name} makes a sound\`;
  }
}`,
      explanation:
        "Every object has a prototype property that points to another object, creating a chain for property lookup.",
      difficulty: "intermediate",
      category: "OOP",
      time_to_answer: 360,
      tags: ["prototype", "inheritance", "oop"],
    },
    {
      id: "js_009",
      question_title: "What are JavaScript modules?",
      question_text:
        "Explain ES6 modules and different ways to import/export in JavaScript.",
      answer_text:
        "ES6 modules allow you to split code into separate files and share functionality using import and export statements.",
      code_example: `// math.js - Named exports
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export function multiply(a, b) {
  return a * b;
}

// utils.js - Default export
export default function formatDate(date) {
  return date.toLocaleDateString();
}

// main.js - Importing
import formatDate from './utils.js'; // Default import
import { PI, add } from './math.js'; // Named imports
import * as math from './math.js'; // Namespace import

console.log(PI); // 3.14159
console.log(add(2, 3)); // 5
console.log(math.multiply(4, 5)); // 20
console.log(formatDate(new Date()));`,
      explanation:
        "Modules help organize code, avoid global namespace pollution, and enable better dependency management.",
      difficulty: "intermediate",
      category: "Modules",
      time_to_answer: 240,
      tags: ["modules", "import", "export", "es6"],
    },
    {
      id: "js_010",
      question_title: "What is destructuring in JavaScript?",
      question_text: "Explain array and object destructuring with examples.",
      answer_text:
        "Destructuring is a syntax that allows you to extract values from arrays or properties from objects into distinct variables.",
      code_example: `// Array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// Object destructuring
const person = { name: 'John', age: 30, city: 'New York' };
const { name, age, city = 'Unknown' } = person;
console.log(name); // 'John'
console.log(age); // 30

// Nested destructuring
const user = {
  id: 1,
  profile: {
    name: 'Alice',
    settings: { theme: 'dark' }
  }
};
const { profile: { name: userName, settings: { theme } } } = user;
console.log(userName); // 'Alice'
console.log(theme); // 'dark'

// Function parameters
function greet({ name, age = 25 }) {
  return \`Hello \${name}, you are \${age} years old\`;
}
greet({ name: 'Bob' }); // 'Hello Bob, you are 25 years old'`,
      explanation:
        "Destructuring makes code more readable and allows for easy extraction of values with default values.",
      difficulty: "beginner",
      category: "Syntax",
      time_to_answer: 200,
      tags: ["destructuring", "arrays", "objects", "es6"],
    },
    // Add more JavaScript questions here...
  ],

  python: [
    {
      id: "py_001",
      question_title:
        "What is the difference between list and tuple in Python?",
      question_text:
        "Compare lists and tuples in Python, highlighting their key differences.",
      answer_text:
        "Lists are mutable (can be changed) and use square brackets [], while tuples are immutable (cannot be changed) and use parentheses (). Lists are slower than tuples for iteration.",
      code_example: `# List (mutable)
my_list = [1, 2, 3]
my_list[0] = 10  # This works
my_list.append(4)  # This works
print(my_list)  # [10, 2, 3, 4]

# Tuple (immutable)
my_tuple = (1, 2, 3)
# my_tuple[0] = 10  # This would raise TypeError
# my_tuple.append(4)  # This would raise AttributeError`,
      explanation:
        "Use lists when you need to modify the collection, use tuples for fixed collections or as dictionary keys.",
      difficulty: "beginner",
      category: "Data Structures",
      time_to_answer: 180,
      tags: ["list", "tuple", "mutable", "immutable"],
    },
    {
      id: "py_002",
      question_title: "What are Python decorators?",
      question_text:
        "Explain decorators in Python and how to create custom decorators.",
      answer_text:
        "Decorators are a way to modify or enhance functions or classes without permanently modifying their structure. They use the @ symbol and are essentially functions that take another function as an argument.",
      code_example: `def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function call")
        result = func(*args, **kwargs)
        print("After function call")
        return result
    return wrapper

@my_decorator
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))
# Output:
# Before function call
# After function call
# Hello, Alice!`,
      explanation:
        "Decorators are commonly used for logging, authentication, caching, and timing functions.",
      difficulty: "intermediate",
      category: "Advanced",
      time_to_answer: 300,
      tags: ["decorators", "functions", "wrapper"],
    },
    {
      id: "py_003",
      question_title: "What is the difference between *args and **kwargs?",
      question_text:
        "Explain the purpose and usage of *args and **kwargs in Python functions.",
      answer_text:
        "*args allows a function to accept any number of positional arguments, while **kwargs allows it to accept any number of keyword arguments.",
      code_example: `def example_function(*args, **kwargs):
    print("Positional arguments:", args)
    print("Keyword arguments:", kwargs)

example_function(1, 2, 3, name="John", age=30)
# Output:
# Positional arguments: (1, 2, 3)
# Keyword arguments: {'name': 'John', 'age': 30}

# Unpacking
numbers = [1, 2, 3]
person = {'name': 'Alice', 'age': 25}
example_function(*numbers, **person)`,
      explanation:
        "These are useful for creating flexible functions that can handle varying numbers of arguments.",
      difficulty: "intermediate",
      category: "Functions",
      time_to_answer: 240,
      tags: ["args", "kwargs", "functions", "parameters"],
    },
    {
      id: "py_004",
      question_title: "What is list comprehension in Python?",
      question_text:
        "Explain list comprehensions and provide examples of their usage.",
      answer_text:
        "List comprehension is a concise way to create lists based on existing lists or other iterables. It provides a more readable and efficient alternative to traditional for loops.",
      code_example: `# Traditional approach
squares = []
for x in range(10):
    squares.append(x**2)

# List comprehension
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# Nested comprehension
matrix = [[i*j for j in range(3)] for i in range(3)]
print(matrix)  # [[0, 0, 0], [0, 1, 2], [0, 2, 4]]`,
      explanation:
        "List comprehensions are generally faster and more Pythonic than equivalent for loops.",
      difficulty: "beginner",
      category: "Data Structures",
      time_to_answer: 200,
      tags: ["list-comprehension", "loops", "pythonic"],
    },
    {
      id: "py_005",
      question_title: "What is the Global Interpreter Lock (GIL)?",
      question_text:
        "Explain the GIL in Python and its impact on multithreading.",
      answer_text:
        "The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously. This means only one thread can execute Python code at a time.",
      code_example: `import threading
import time

def cpu_bound_task():
    count = 0
    for i in range(100000000):
        count += 1
    return count

# Single thread
start = time.time()
result = cpu_bound_task()
single_time = time.time() - start

# Multiple threads (won't be faster due to GIL)
start = time.time()
threads = []
for i in range(2):
    t = threading.Thread(target=cpu_bound_task)
    threads.append(t)
    t.start()

for t in threads:
    t.join()
multi_time = time.time() - start

print(f"Single: {single_time:.2f}s, Multi: {multi_time:.2f}s")`,
      explanation:
        "For CPU-bound tasks, use multiprocessing instead of threading. Threading is still useful for I/O-bound tasks.",
      difficulty: "advanced",
      category: "Concurrency",
      time_to_answer: 360,
      tags: ["gil", "threading", "concurrency", "performance"],
    },
    // Add 25 more Python questions here...
  ],

  java: [
    {
      id: "java_001",
      question_title:
        "What is the difference between abstract class and interface?",
      question_text:
        "Compare abstract classes and interfaces in Java, highlighting when to use each.",
      answer_text:
        "Abstract classes can have both abstract and concrete methods, constructors, and instance variables. Interfaces (before Java 8) could only have abstract methods. A class can implement multiple interfaces but extend only one abstract class.",
      code_example: `// Abstract class
abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    abstract void makeSound();

    void sleep() { // Concrete method
        System.out.println(name + " is sleeping");
    }
}

// Interface
interface Flyable {
    void fly(); // Abstract method

    default void glide() { // Default method (Java 8+)
        System.out.println("Gliding...");
    }
}

class Bird extends Animal implements Flyable {
    public Bird(String name) {
        super(name);
    }

    void makeSound() {
        System.out.println("Chirp!");
    }

    public void fly() {
        System.out.println(name + " is flying");
    }
}`,
      explanation:
        'Use abstract classes for "is-a" relationships with shared code, interfaces for "can-do" relationships and multiple inheritance.',
      difficulty: "intermediate",
      category: "OOP",
      time_to_answer: 300,
      tags: ["abstract-class", "interface", "inheritance", "oop"],
    },
    {
      id: "java_002",
      question_title: "What is garbage collection in Java?",
      question_text:
        "Explain how garbage collection works in Java and its different algorithms.",
      answer_text:
        "Garbage collection is automatic memory management in Java. It automatically frees up memory by removing objects that are no longer reachable or referenced.",
      code_example: `public class GCExample {
    public static void main(String[] args) {
        // Object creation
        String str = new String("Hello");
        List<String> list = new ArrayList<>();

        // Object becomes eligible for GC
        str = null;
        list = null;

        // Suggest garbage collection (not guaranteed)
        System.gc();

        // Force finalization (not recommended)
        System.runFinalization();
    }
}

class MyClass {
    @Override
    protected void finalize() throws Throwable {
        System.out.println("Object is being garbage collected");
        super.finalize();
    }
}`,
      explanation:
        "Java uses different GC algorithms like Serial, Parallel, G1, and ZGC. Each has different performance characteristics.",
      difficulty: "intermediate",
      category: "Memory Management",
      time_to_answer: 300,
      tags: ["garbage-collection", "memory", "jvm", "performance"],
    },
    // Add 28 more Java questions here...
  ],

  react: [
    {
      id: "react_001",
      question_title:
        "What is the difference between functional and class components?",
      question_text:
        "Compare functional components and class components in React.",
      answer_text:
        "Functional components are simpler and use hooks for state management. Class components use this.state and lifecycle methods. Functional components are preferred in modern React.",
      code_example: `// Functional Component with Hooks
import React, { useState, useEffect } from 'react';

function Welcome({ name }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

// Class Component
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    document.title = \`Count: \${this.state.count}\`;
  }

  componentDidUpdate() {
    document.title = \`Count: \${this.state.count}\`;
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.props.name}!</h1>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}`,
      explanation:
        "Functional components with hooks provide the same capabilities as class components with cleaner, more concise syntax.",
      difficulty: "beginner",
      category: "Components",
      time_to_answer: 240,
      tags: ["components", "functional", "class", "hooks"],
    },
    // Add 29 more React questions here...
  ],

  // Add questions for other languages: nodejs, typescript, csharp, cpp, go, rust
};

// Function to get random questions for a language
export function getRandomQuestions(
  language: string,
  count: number = 10
): StaticQuestion[] {
  const questions = staticQuestions[language] || [];
  if (questions.length === 0) {
    return [];
  }

  // Shuffle array and return requested count
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, questions.length));
}

// Function to get questions by difficulty
export function getQuestionsByDifficulty(
  language: string,
  difficulty: "beginner" | "intermediate" | "advanced" | "mixed",
  count: number = 10
): StaticQuestion[] {
  const questions = staticQuestions[language] || [];

  if (difficulty === "mixed") {
    return getRandomQuestions(language, count);
  }

  const filtered = questions.filter((q) => q.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, filtered.length));
}
