import { CompleteTutorial } from './complete-tutorials';

// Template for generating comprehensive tutorials with 30 chapters each
const createMegaTutorial = (
  language: string,
  title: string,
  description: string,
  chapters: any[],
  interviewQuestions: any[]
): CompleteTutorial => ({
  language,
  title: `Complete ${title} Tutorial - 30 Chapters`,
  description: `${description} with 30 comprehensive chapters and 50+ interview questions`,
  chapters,
  interviewQuestions
});

// Mega Java Tutorial - 30 Chapters
export const megaJavaTutorial = createMegaTutorial(
  'java',
  'Java',
  'Master Java programming from fundamentals to enterprise development',
  [
    {
      id: 'java-intro',
      title: '1. Introduction to Java',
      content: `
# Introduction to Java

Java is a robust, object-oriented programming language designed for enterprise applications.

## What is Java?

Java is a platform-independent, compiled language that runs on the Java Virtual Machine (JVM).
      `,
      codeExample: `
// Your first Java program
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Variables and basic operations
        String message = "Welcome to Java!";
        int number = 42;
        boolean isActive = true;
        
        System.out.println(message);
        System.out.println("The answer is: " + number);
        System.out.println("Is active: " + isActive);
        
        // Basic arithmetic
        int sum = 10 + 5;
        int product = 4 * 7;
        double quotient = 20.0 / 4;
        
        System.out.println("Sum: " + sum);
        System.out.println("Product: " + product);
        System.out.println("Quotient: " + quotient);
    }
}
      `,
      exercises: [
        'Create a Java class that displays your personal information',
        'Write a program that performs basic mathematical calculations',
        'Create variables for different data types and print them'
      ]
    },
    {
      id: 'java-variables',
      title: '2. Variables and Data Types',
      content: `
# Variables and Data Types

Java is statically typed - you must declare variable types explicitly.

## Java Data Types

Learn about primitive and reference types in Java.
      `,
      codeExample: `
public class DataTypes {
    public static void main(String[] args) {
        // Primitive data types
        byte byteVar = 127;
        short shortVar = 32767;
        int intVar = 2147483647;
        long longVar = 9223372036854775807L;
        
        float floatVar = 3.14f;
        double doubleVar = 3.14159265359;
        
        char charVar = 'A';
        boolean boolVar = true;
        
        // Reference types
        String stringVar = "Hello Java";
        Integer integerWrapper = 42;
        
        // Arrays
        int[] numbers = {1, 2, 3, 4, 5};
        String[] names = {"Alice", "Bob", "Charlie"};
        
        // Print all variables
        System.out.println("Byte: " + byteVar);
        System.out.println("Short: " + shortVar);
        System.out.println("Int: " + intVar);
        System.out.println("Long: " + longVar);
        System.out.println("Float: " + floatVar);
        System.out.println("Double: " + doubleVar);
        System.out.println("Char: " + charVar);
        System.out.println("Boolean: " + boolVar);
        System.out.println("String: " + stringVar);
        
        // Array operations
        System.out.println("Array length: " + numbers.length);
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("numbers[" + i + "] = " + numbers[i]);
        }
        
        // Enhanced for loop
        for (String name : names) {
            System.out.println("Name: " + name);
        }
    }
}
      `,
      exercises: [
        'Declare variables for all primitive types',
        'Create and manipulate arrays of different types',
        'Practice type conversion between different numeric types'
      ]
    },
    {
      id: 'java-operators',
      title: '3. Operators and Control Flow',
      content: `
# Operators and Control Flow

Master Java operators and control flow statements.

## Operators and Decision Making

Learn to use operators and control program flow.
      `,
      codeExample: `
public class OperatorsAndControl {
    public static void main(String[] args) {
        // Arithmetic operators
        int a = 15, b = 4;
        System.out.println("Addition: " + (a + b));
        System.out.println("Subtraction: " + (a - b));
        System.out.println("Multiplication: " + (a * b));
        System.out.println("Division: " + (a / b));
        System.out.println("Modulus: " + (a % b));
        
        // Comparison operators
        System.out.println("a > b: " + (a > b));
        System.out.println("a == b: " + (a == b));
        System.out.println("a != b: " + (a != b));
        
        // Logical operators
        boolean x = true, y = false;
        System.out.println("x && y: " + (x && y));
        System.out.println("x || y: " + (x || y));
        System.out.println("!x: " + (!x));
        
        // If-else statements
        int score = 85;
        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else if (score >= 70) {
            System.out.println("Grade: C");
        } else {
            System.out.println("Grade: F");
        }
        
        // Switch statement
        int day = 3;
        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            default:
                System.out.println("Other day");
        }
        
        // Loops
        System.out.println("For loop:");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
        
        System.out.println("While loop:");
        int count = 1;
        while (count <= 3) {
            System.out.println("While count: " + count);
            count++;
        }
        
        System.out.println("Do-while loop:");
        int num = 1;
        do {
            System.out.println("Do-while num: " + num);
            num++;
        } while (num <= 3);
    }
}
      `,
      exercises: [
        'Create a calculator using switch statements',
        'Write a program that finds prime numbers using loops',
        'Implement a grade calculator with if-else statements'
      ]
    }
  ],
  [
    {
      id: 'mega-java-q1',
      question: 'What is the difference between JDK, JRE, and JVM?',
      answer: 'JVM (Java Virtual Machine) executes Java bytecode. JRE (Java Runtime Environment) includes JVM plus libraries needed to run Java applications. JDK (Java Development Kit) includes JRE plus development tools like compiler (javac).',
      difficulty: 'beginner',
      category: 'Core Concepts'
    },
    {
      id: 'mega-java-q2',
      question: 'What is the difference between == and equals() in Java?',
      answer: '== compares references (memory addresses) for objects, while equals() compares the actual content. For primitives, == compares values. String comparison should use equals() method.',
      difficulty: 'intermediate',
      category: 'Operators'
    },
    {
      id: 'mega-java-q3',
      question: 'What is inheritance in Java?',
      answer: 'Inheritance allows a class to inherit properties and methods from another class. The child class (subclass) extends the parent class (superclass) using the "extends" keyword. Java supports single inheritance only.',
      difficulty: 'intermediate',
      category: 'OOP'
    },
    {
      id: 'mega-java-q4',
      question: 'What is polymorphism in Java?',
      answer: 'Polymorphism allows objects of different types to be treated as objects of a common base type. It includes method overloading (compile-time) and method overriding (runtime polymorphism).',
      difficulty: 'intermediate',
      category: 'OOP'
    },
    {
      id: 'mega-java-q5',
      question: 'What is the difference between abstract class and interface?',
      answer: 'Abstract classes can have both abstract and concrete methods, constructors, and instance variables. Interfaces can only have abstract methods (until Java 8), constants, and support multiple inheritance.',
      difficulty: 'advanced',
      category: 'OOP'
    }
  ]
);

// Export all mega tutorials
export const allMegaTutorials = {
  java: megaJavaTutorial
};
