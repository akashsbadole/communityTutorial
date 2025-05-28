require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function populateInterviewQuestions() {
  try {
    console.log('📚 Populating Interview Questions for All Languages...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // JavaScript Questions (Based on sudheerj/javascript-interview-questions)
    console.log('📝 Adding JavaScript questions...');
    const javascriptQuestions = [
      {
        category: 'Basics',
        difficulty: 'beginner',
        title: 'What are the possible ways to create objects in JavaScript?',
        question: 'Explain different ways to create objects in JavaScript with examples.',
        answer: 'There are many ways to create objects in JavaScript: 1) Object constructor, 2) Object.create method, 3) Function constructor, 4) Function constructor with prototype, 5) ES6 Class syntax, 6) Singleton pattern',
        code_example: `// Object constructor
var object = new Object();

// Object.create method
var object = Object.create(null);

// Function constructor
function Person(name) {
  this.name = name;
}
var object = new Person("John");

// ES6 Class
class Person {
  constructor(name) {
    this.name = name;
  }
}`,
        explanation: 'Each method has its own use cases. Object literals are most common for simple objects, while classes are preferred for complex object creation with inheritance.',
        tags: ['objects', 'constructor', 'class', 'prototype'],
        time_to_answer: 300
      },
      {
        category: 'Functions',
        difficulty: 'intermediate',
        title: 'What is a closure in JavaScript?',
        question: 'Explain closures in JavaScript with practical examples.',
        answer: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. It gives you access to an outer function\'s scope from an inner function.',
        code_example: `function outerFunction(x) {
  return function innerFunction(y) {
    return x + y;
  };
}

const add5 = outerFunction(5);
console.log(add5(3)); // 8`,
        explanation: 'Closures are useful for data privacy, function factories, and maintaining state in asynchronous operations.',
        tags: ['closure', 'scope', 'functions', 'lexical-scope'],
        time_to_answer: 240
      },
      {
        category: 'Async Programming',
        difficulty: 'advanced',
        title: 'What is the difference between Promise and async/await?',
        question: 'Compare Promises and async/await syntax in JavaScript.',
        answer: 'Promises are objects representing eventual completion of asynchronous operations. Async/await is syntactic sugar over Promises, making asynchronous code look more like synchronous code.',
        code_example: `// Promise
function fetchData() {
  return fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

// Async/Await
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}`,
        explanation: 'Async/await provides cleaner, more readable code and better error handling compared to Promise chains.',
        tags: ['promises', 'async-await', 'asynchronous', 'error-handling'],
        time_to_answer: 360
      }
    ];
    
    // Python Questions
    console.log('📝 Adding Python questions...');
    const pythonQuestions = [
      {
        category: 'Basics',
        difficulty: 'beginner',
        title: 'What is the difference between list and tuple in Python?',
        question: 'Explain the key differences between lists and tuples in Python.',
        answer: 'Lists are mutable (can be changed) while tuples are immutable (cannot be changed). Lists use square brackets [], tuples use parentheses (). Lists are slower than tuples.',
        code_example: `# List (mutable)
my_list = [1, 2, 3]
my_list[0] = 10  # This works
print(my_list)  # [10, 2, 3]

# Tuple (immutable)
my_tuple = (1, 2, 3)
# my_tuple[0] = 10  # This would raise an error`,
        explanation: 'Use lists when you need to modify the collection, use tuples for fixed collections or as dictionary keys.',
        tags: ['list', 'tuple', 'mutable', 'immutable', 'data-structures'],
        time_to_answer: 180
      },
      {
        category: 'OOP',
        difficulty: 'intermediate',
        title: 'What is method overriding in Python?',
        question: 'Explain method overriding with inheritance in Python.',
        answer: 'Method overriding allows a subclass to provide a specific implementation of a method that is already defined in its parent class.',
        code_example: `class Animal:
    def make_sound(self):
        return "Some generic sound"

class Dog(Animal):
    def make_sound(self):  # Override parent method
        return "Woof!"

class Cat(Animal):
    def make_sound(self):  # Override parent method
        return "Meow!"

dog = Dog()
print(dog.make_sound())  # "Woof!"`,
        explanation: 'Method overriding enables polymorphism, allowing different classes to implement the same interface differently.',
        tags: ['inheritance', 'polymorphism', 'method-overriding', 'oop'],
        time_to_answer: 240
      },
      {
        category: 'Advanced',
        difficulty: 'advanced',
        title: 'What are decorators in Python?',
        question: 'Explain Python decorators and how to create custom decorators.',
        answer: 'Decorators are a way to modify or enhance functions or classes without permanently modifying their structure. They use the @ symbol.',
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

print(greet("Alice"))`,
        explanation: 'Decorators are commonly used for logging, authentication, caching, and timing functions.',
        tags: ['decorators', 'functions', 'wrapper', 'metaprogramming'],
        time_to_answer: 300
      }
    ];
    
    // Java Questions
    console.log('📝 Adding Java questions...');
    const javaQuestions = [
      {
        category: 'OOP',
        difficulty: 'beginner',
        title: 'What is the difference between abstract class and interface in Java?',
        question: 'Compare abstract classes and interfaces in Java.',
        answer: 'Abstract classes can have both abstract and concrete methods, while interfaces (before Java 8) could only have abstract methods. A class can implement multiple interfaces but extend only one abstract class.',
        code_example: `// Abstract class
abstract class Animal {
    abstract void makeSound();
    void sleep() { // Concrete method
        System.out.println("Sleeping...");
    }
}

// Interface
interface Flyable {
    void fly(); // Abstract method
    default void glide() { // Default method (Java 8+)
        System.out.println("Gliding...");
    }
}`,
        explanation: 'Use abstract classes for "is-a" relationships and interfaces for "can-do" relationships.',
        tags: ['abstract-class', 'interface', 'inheritance', 'polymorphism'],
        time_to_answer: 240
      },
      {
        category: 'Memory Management',
        difficulty: 'intermediate',
        title: 'What is garbage collection in Java?',
        question: 'Explain how garbage collection works in Java.',
        answer: 'Garbage collection is automatic memory management in Java. It automatically frees up memory by removing objects that are no longer reachable or referenced.',
        code_example: `public class GCExample {
    public static void main(String[] args) {
        String str = new String("Hello"); // Object created
        str = null; // Object becomes eligible for GC
        
        // Suggest garbage collection (not guaranteed)
        System.gc();
    }
}`,
        explanation: 'Java uses different GC algorithms like Serial, Parallel, G1, and ZGC for different use cases.',
        tags: ['garbage-collection', 'memory-management', 'jvm', 'performance'],
        time_to_answer: 300
      }
    ];
    
    // React Questions
    console.log('📝 Adding React questions...');
    const reactQuestions = [
      {
        category: 'Components',
        difficulty: 'beginner',
        title: 'What is the difference between functional and class components?',
        question: 'Compare functional components and class components in React.',
        answer: 'Functional components are simpler and use hooks for state management. Class components use this.state and lifecycle methods. Functional components are preferred in modern React.',
        code_example: `// Functional Component
function Welcome(props) {
  const [count, setCount] = useState(0);
  return <h1>Hello, {props.name}! Count: {count}</h1>;
}

// Class Component
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  render() {
    return <h1>Hello, {this.props.name}! Count: {this.state.count}</h1>;
  }
}`,
        explanation: 'Functional components with hooks provide the same capabilities as class components with cleaner syntax.',
        tags: ['components', 'functional', 'class', 'hooks', 'state'],
        time_to_answer: 200
      },
      {
        category: 'Hooks',
        difficulty: 'intermediate',
        title: 'What is useEffect hook and when to use it?',
        question: 'Explain the useEffect hook and its use cases.',
        answer: 'useEffect is used for side effects in functional components. It replaces componentDidMount, componentDidUpdate, and componentWillUnmount lifecycle methods.',
        code_example: `import React, { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(timer);
  }, []); // Empty dependency array = componentDidMount

  return <div>Count: {count}</div>;
}`,
        explanation: 'useEffect can handle mounting, updating, and unmounting phases based on its dependency array.',
        tags: ['useEffect', 'hooks', 'side-effects', 'lifecycle'],
        time_to_answer: 240
      }
    ];
    
    // Add questions for each language
    const languageQuestions = {
      'lang_javascript': javascriptQuestions,
      'lang_python': pythonQuestions,
      'lang_java': javaQuestions,
      'lang_react': reactQuestions
    };
    
    // Insert questions for each language
    for (const [languageId, questions] of Object.entries(languageQuestions)) {
      console.log(`📝 Inserting questions for ${languageId}...`);
      
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionId = `q_${languageId}_${i + 1}`;
        
        await sql`
          INSERT INTO interview_questions (
            id, language_id, category, difficulty, question_title, 
            question_text, answer_text, code_example, explanation, 
            tags, time_to_answer, question_order
          ) VALUES (
            ${questionId}, ${languageId}, ${question.category}, ${question.difficulty},
            ${question.title}, ${question.question}, ${question.answer},
            ${question.code_example}, ${question.explanation}, ${question.tags},
            ${question.time_to_answer}, ${i + 1}
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
    }
    
    console.log('🎉 Interview questions populated successfully!');
    console.log('📊 Summary:');
    console.log('   ✅ JavaScript: 3 questions added');
    console.log('   ✅ Python: 3 questions added');
    console.log('   ✅ Java: 2 questions added');
    console.log('   ✅ React: 2 questions added');
    console.log('   📝 Total: 10 sample questions (will expand to 200+ per language)');
    
  } catch (error) {
    console.error('❌ Failed to populate interview questions:', error);
  }
}

populateInterviewQuestions();
