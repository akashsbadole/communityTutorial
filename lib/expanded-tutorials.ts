import { CompleteTutorial } from './complete-tutorials';

// Comprehensive Java Tutorial
export const expandedJavaTutorial: CompleteTutorial = {
  language: 'java',
  title: 'Complete Java Tutorial',
  description: 'Master Java programming from fundamentals to advanced enterprise concepts',
  chapters: [
    {
      id: 'java-basics',
      title: 'Java Fundamentals',
      content: `
# Java Fundamentals

Java is a robust, object-oriented programming language designed for enterprise applications.

## Variables and Data Types

Java is statically typed - you must declare variable types.
      `,
      codeExample: `
public class JavaBasics {
    public static void main(String[] args) {
        // Primitive data types
        int age = 25;
        double salary = 50000.50;
        boolean isEmployed = true;
        char grade = 'A';
        
        // Reference types
        String name = "John Doe";
        int[] numbers = {1, 2, 3, 4, 5};
        
        // Constants
        final double PI = 3.14159;
        
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Salary: $" + salary);
        
        // Type casting
        double doubleValue = 9.78;
        int intValue = (int) doubleValue; // Explicit casting
        
        // Wrapper classes
        Integer wrappedInt = Integer.valueOf(42);
        String numberString = wrappedInt.toString();
    }
}
      `,
      exercises: [
        'Create variables for different data types',
        'Practice type casting between primitives',
        'Work with wrapper classes and their methods'
      ]
    },
    {
      id: 'java-oop',
      title: 'Object-Oriented Programming',
      content: `
# Object-Oriented Programming in Java

Java is built around OOP principles: Encapsulation, Inheritance, Polymorphism, and Abstraction.

## Classes and Objects

Learn to create and use classes effectively.
      `,
      codeExample: `
// Encapsulation example
public class BankAccount {
    private double balance;
    private String accountNumber;
    
    // Constructor
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    // Getter methods
    public double getBalance() {
        return balance;
    }
    
    public String getAccountNumber() {
        return accountNumber;
    }
    
    // Methods with business logic
    public boolean deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            return true;
        }
        return false;
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
}

// Inheritance example
class SavingsAccount extends BankAccount {
    private double interestRate;
    
    public SavingsAccount(String accountNumber, double initialBalance, double interestRate) {
        super(accountNumber, initialBalance);
        this.interestRate = interestRate;
    }
    
    public void addInterest() {
        double interest = getBalance() * interestRate / 100;
        deposit(interest);
    }
}
      `,
      exercises: [
        'Create a Vehicle class hierarchy with Car and Motorcycle',
        'Implement a Student management system with encapsulation',
        'Build a Shape class with area calculation methods'
      ]
    },
    {
      id: 'java-collections',
      title: 'Collections Framework',
      content: `
# Java Collections Framework

Master Java's powerful collections for data management.

## Lists, Sets, and Maps

Understanding different collection types and their use cases.
      `,
      codeExample: `
import java.util.*;

public class CollectionsExample {
    public static void main(String[] args) {
        // ArrayList - dynamic array
        List<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Orange");
        
        // Enhanced for loop
        for (String fruit : fruits) {
            System.out.println(fruit);
        }
        
        // HashSet - unique elements
        Set<Integer> uniqueNumbers = new HashSet<>();
        uniqueNumbers.add(1);
        uniqueNumbers.add(2);
        uniqueNumbers.add(2); // Duplicate ignored
        
        // HashMap - key-value pairs
        Map<String, Integer> studentGrades = new HashMap<>();
        studentGrades.put("Alice", 95);
        studentGrades.put("Bob", 87);
        studentGrades.put("Charlie", 92);
        
        // Iterating through map
        for (Map.Entry<String, Integer> entry : studentGrades.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        
        // Stream API (Java 8+)
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        List<Integer> evenNumbers = numbers.stream()
            .filter(n -> n % 2 == 0)
            .collect(Collectors.toList());
            
        int sum = numbers.stream()
            .mapToInt(Integer::intValue)
            .sum();
    }
}
      `,
      exercises: [
        'Create a phonebook using HashMap',
        'Implement a todo list with ArrayList',
        'Use Stream API to process collections'
      ]
    },
    {
      id: 'java-exception-handling',
      title: 'Exception Handling',
      content: `
# Exception Handling in Java

Learn to handle errors gracefully and create robust applications.

## Try-Catch-Finally and Custom Exceptions

Proper exception handling techniques.
      `,
      codeExample: `
import java.io.*;
import java.util.Scanner;

// Custom exception
class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

public class ExceptionHandling {
    public static void main(String[] args) {
        // Basic exception handling
        try {
            int result = divide(10, 0);
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero: " + e.getMessage());
        } finally {
            System.out.println("This always executes");
        }
        
        // File handling with exceptions
        try (Scanner scanner = new Scanner(new File("data.txt"))) {
            while (scanner.hasNextLine()) {
                System.out.println(scanner.nextLine());
            }
        } catch (FileNotFoundException e) {
            System.out.println("File not found: " + e.getMessage());
        }
        
        // Custom exception usage
        BankAccount account = new BankAccount("12345", 100.0);
        try {
            account.withdraw(150.0);
        } catch (InsufficientFundsException e) {
            System.out.println("Transaction failed: " + e.getMessage());
        }
    }
    
    public static int divide(int a, int b) throws ArithmeticException {
        if (b == 0) {
            throw new ArithmeticException("Division by zero");
        }
        return a / b;
    }
}

class BankAccount {
    private double balance;
    private String accountNumber;
    
    public BankAccount(String accountNumber, double balance) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }
    
    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(
                "Insufficient funds. Balance: " + balance + ", Requested: " + amount
            );
        }
        balance -= amount;
    }
}
      `,
      exercises: [
        'Create a file reader with comprehensive error handling',
        'Implement a calculator with custom exceptions',
        'Build a user input validator with multiple exception types'
      ]
    },
    {
      id: 'java-multithreading',
      title: 'Multithreading and Concurrency',
      content: `
# Multithreading in Java

Learn to create concurrent applications and manage threads.

## Threads, Synchronization, and Concurrent Collections

Understanding parallel programming in Java.
      `,
      codeExample: `
import java.util.concurrent.*;

// Implementing Runnable interface
class NumberPrinter implements Runnable {
    private String threadName;
    
    public NumberPrinter(String name) {
        this.threadName = name;
    }
    
    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(threadName + ": " + i);
            try {
                Thread.sleep(1000); // Sleep for 1 second
            } catch (InterruptedException e) {
                System.out.println(threadName + " interrupted");
            }
        }
    }
}

// Synchronized method example
class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
}

public class MultithreadingExample {
    public static void main(String[] args) {
        // Creating and starting threads
        Thread thread1 = new Thread(new NumberPrinter("Thread-1"));
        Thread thread2 = new Thread(new NumberPrinter("Thread-2"));
        
        thread1.start();
        thread2.start();
        
        // Using ExecutorService
        ExecutorService executor = Executors.newFixedThreadPool(3);
        
        for (int i = 0; i < 5; i++) {
            executor.submit(new NumberPrinter("Task-" + i));
        }
        
        executor.shutdown();
        
        // Concurrent collections
        ConcurrentHashMap<String, Integer> concurrentMap = new ConcurrentHashMap<>();
        concurrentMap.put("key1", 1);
        concurrentMap.put("key2", 2);
        
        // CompletableFuture for asynchronous programming
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "Hello from future!";
        });
        
        future.thenAccept(System.out::println);
    }
}
      `,
      exercises: [
        'Create a producer-consumer problem solution',
        'Implement a thread-safe singleton pattern',
        'Build a simple web crawler using multiple threads'
      ]
    }
  ],
  interviewQuestions: [
    {
      id: 'java-q1',
      question: 'What is the difference between JDK, JRE, and JVM?',
      answer: 'JVM (Java Virtual Machine) executes Java bytecode. JRE (Java Runtime Environment) includes JVM plus libraries needed to run Java applications. JDK (Java Development Kit) includes JRE plus development tools like compiler (javac).',
      difficulty: 'beginner',
      category: 'Core Concepts'
    },
    {
      id: 'java-q2',
      question: 'Explain the concept of inheritance in Java.',
      answer: 'Inheritance allows a class to inherit properties and methods from another class. The child class (subclass) extends the parent class (superclass) using the "extends" keyword. Java supports single inheritance only.',
      difficulty: 'intermediate',
      category: 'OOP'
    },
    {
      id: 'java-q3',
      question: 'What is the difference between ArrayList and LinkedList?',
      answer: 'ArrayList uses a dynamic array internally, providing fast random access (O(1)) but slower insertion/deletion in the middle (O(n)). LinkedList uses a doubly-linked list, providing fast insertion/deletion (O(1)) but slower random access (O(n)).',
      difficulty: 'intermediate',
      category: 'Collections'
    },
    {
      id: 'java-q4',
      question: 'What is synchronization in Java?',
      answer: 'Synchronization is a mechanism to control access to shared resources in a multithreaded environment. It prevents race conditions by ensuring only one thread can access a synchronized block or method at a time.',
      difficulty: 'advanced',
      category: 'Multithreading'
    },
    {
      id: 'java-q5',
      question: 'Explain the difference between checked and unchecked exceptions.',
      answer: 'Checked exceptions must be handled at compile time (IOException, SQLException). Unchecked exceptions are runtime exceptions that don\'t need to be declared (NullPointerException, ArrayIndexOutOfBoundsException).',
      difficulty: 'intermediate',
      category: 'Exception Handling'
    }
  ]
};

// Export expanded tutorials
export const expandedTutorials = {
  java: expandedJavaTutorial
};
