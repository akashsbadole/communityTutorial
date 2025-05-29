import { CompleteTutorial } from "./complete-tutorials";

// Comprehensive C# Tutorial with 20+ Topics
export const comprehensiveCsharpTutorial: CompleteTutorial = {
  language: "csharp",
  title: "Complete C# Tutorial",
  description:
    "Master C# programming from fundamentals to advanced .NET development",
  chapters: [
    {
      id: "cs-basics",
      title: "C# Fundamentals",
      content: `
# C# Fundamentals

C# is a modern, object-oriented programming language developed by Microsoft for the .NET platform.

## Variables and Data Types

C# is strongly typed with both value and reference types.
      `,
      codeExample: `
using System;

namespace CSharpBasics
{
    class Program
    {
        static void Main(string[] args)
        {
            // Value types
            int age = 25;
            double salary = 50000.50;
            bool isEmployed = true;
            char grade = 'A';

            // Reference types
            string name = "John Doe";
            int[] numbers = { 1, 2, 3, 4, 5 };

            // Nullable types
            int? nullableAge = null;
            string? nullableName = null;

            // Constants
            const double PI = 3.14159;

            // var keyword (implicit typing)
            var city = "New York"; // string
            var count = 10; // int

            Console.WriteLine($"Name: {name}");
            Console.WriteLine($"Age: {age}");
            Console.WriteLine($"Salary: {salary:C}");
            Console.WriteLine($"Grade: {grade}");
        }
    }
}
      `,
      exercises: [
        "Create variables for different data types",
        "Practice string interpolation and formatting",
        "Work with nullable types and null checking",
      ],
    },
    {
      id: "cs-oop",
      title: "Object-Oriented Programming",
      content: `
# Object-Oriented Programming in C#

C# is built around OOP principles with classes, inheritance, polymorphism, and encapsulation.

## Classes and Objects

Learn to create and use classes effectively.
      `,
      codeExample: `
using System;
using System.Collections.Generic;

// Base class
public class Person
{
    // Properties with auto-implemented getters/setters
    public string Name { get; set; }
    public int Age { get; set; }

    // Property with backing field
    private string _email;
    public string Email
    {
        get { return _email; }
        set
        {
            if (value.Contains("@"))
                _email = value;
            else
                throw new ArgumentException("Invalid email format");
        }
    }

    // Constructor
    public Person(string name, int age, string email)
    {
        Name = name;
        Age = age;
        Email = email;
    }

    // Virtual method (can be overridden)
    public virtual void Introduce()
    {
        Console.WriteLine($"Hi, I'm {Name} and I'm {Age} years old.");
    }

    // Method overloading
    public void Introduce(string greeting)
    {
        Console.WriteLine($"{greeting}, I'm {Name}!");
    }
}

// Derived class
public class Student : Person
{
    public string StudentId { get; set; }
    public List<string> Courses { get; set; }

    public Student(string name, int age, string email, string studentId)
        : base(name, age, email)
    {
        StudentId = studentId;
        Courses = new List<string>();
    }

    // Override base method
    public override void Introduce()
    {
        Console.WriteLine($"Hi, I'm {Name}, a student with ID {StudentId}.");
    }

    public void EnrollInCourse(string course)
    {
        Courses.Add(course);
        Console.WriteLine($"{Name} enrolled in {course}");
    }
}

// Abstract class
public abstract class Shape
{
    public abstract double CalculateArea();

    public virtual void Display()
    {
        Console.WriteLine($"Area: {CalculateArea()}");
    }
}

public class Circle : Shape
{
    public double Radius { get; set; }

    public Circle(double radius)
    {
        Radius = radius;
    }

    public override double CalculateArea()
    {
        return Math.PI * Radius * Radius;
    }
}
      `,
      exercises: [
        "Create a Vehicle class hierarchy with Car and Motorcycle",
        "Implement a BankAccount class with proper encapsulation",
        "Build an abstract Animal class with concrete implementations",
      ],
    },
    {
      id: "cs-collections",
      title: "Collections and Generics",
      content: `
# Collections and Generics in C#

Master C#'s powerful collection framework and generic programming.

## Lists, Dictionaries, and Generic Collections

Work with type-safe collections for efficient data management.
      `,
      codeExample: `
using System;
using System.Collections.Generic;
using System.Linq;

public class CollectionsExample
{
    public static void Main()
    {
        // List<T> - dynamic array
        List<string> fruits = new List<string> { "Apple", "Banana", "Orange" };
        fruits.Add("Grape");
        fruits.AddRange(new[] { "Kiwi", "Mango" });

        // Dictionary<TKey, TValue> - key-value pairs
        Dictionary<string, int> studentGrades = new Dictionary<string, int>
        {
            { "Alice", 95 },
            { "Bob", 87 },
            { "Charlie", 92 }
        };

        // HashSet<T> - unique elements
        HashSet<int> uniqueNumbers = new HashSet<int> { 1, 2, 3, 2, 1 };

        // Queue<T> and Stack<T>
        Queue<string> queue = new Queue<string>();
        queue.Enqueue("First");
        queue.Enqueue("Second");
        string first = queue.Dequeue();

        Stack<int> stack = new Stack<int>();
        stack.Push(1);
        stack.Push(2);
        int top = stack.Pop();

        // LINQ operations
        var evenNumbers = fruits
            .Where(f => f.Length % 2 == 0)
            .OrderBy(f => f)
            .ToList();

        var averageGrade = studentGrades.Values.Average();
        var topStudents = studentGrades
            .Where(kvp => kvp.Value >= 90)
            .Select(kvp => kvp.Key)
            .ToList();

        // Generic methods
        T FindMax<T>(IEnumerable<T> items) where T : IComparable<T>
        {
            return items.Max();
        }

        // Custom generic class
        public class Repository<T> where T : class
        {
            private List<T> _items = new List<T>();

            public void Add(T item)
            {
                _items.Add(item);
            }

            public T GetById(Func<T, bool> predicate)
            {
                return _items.FirstOrDefault(predicate);
            }

            public IEnumerable<T> GetAll()
            {
                return _items.AsReadOnly();
            }
        }
    }
}
      `,
      exercises: [
        "Create a generic Stack class with push/pop operations",
        "Build a phonebook using Dictionary with search functionality",
        "Implement a custom collection with LINQ support",
      ],
    },
    {
      id: "cs-async",
      title: "Asynchronous Programming",
      content: `
# Asynchronous Programming in C#

Master async/await pattern for responsive applications.

## Tasks, async/await, and Parallel Programming

Write efficient asynchronous code for I/O operations and parallel processing.
      `,
      codeExample: `
using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Collections.Generic;
using System.Linq;

public class AsyncExample
{
    private static readonly HttpClient httpClient = new HttpClient();

    // Basic async method
    public static async Task<string> FetchDataAsync(string url)
    {
        try
        {
            HttpResponseMessage response = await httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Error fetching data: {ex.Message}");
            return null;
        }
    }

    // Async method with return value
    public static async Task<int> CalculateAsync(int number)
    {
        await Task.Delay(1000); // Simulate work
        return number * number;
    }

    // Parallel processing
    public static async Task<int[]> ProcessNumbersParallelAsync(int[] numbers)
    {
        var tasks = numbers.Select(async num => await CalculateAsync(num));
        return await Task.WhenAll(tasks);
    }

    // Task.Run for CPU-bound work
    public static async Task<long> CalculateFactorialAsync(int n)
    {
        return await Task.Run(() =>
        {
            long result = 1;
            for (int i = 1; i <= n; i++)
            {
                result *= i;
            }
            return result;
        });
    }

    // Cancellation support
    public static async Task<string> FetchWithCancellationAsync(string url,
        CancellationToken cancellationToken)
    {
        try
        {
            using var response = await httpClient.GetAsync(url, cancellationToken);
            return await response.Content.ReadAsStringAsync();
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Operation was cancelled");
            return null;
        }
    }

    // Progress reporting
    public static async Task ProcessWithProgressAsync(IProgress<int> progress)
    {
        for (int i = 0; i <= 100; i += 10)
        {
            await Task.Delay(100);
            progress?.Report(i);
        }
    }

    public static async Task Main()
    {
        // Sequential async calls
        string data1 = await FetchDataAsync("https://api.example.com/data1");
        string data2 = await FetchDataAsync("https://api.example.com/data2");

        // Concurrent async calls
        Task<string> task1 = FetchDataAsync("https://api.example.com/data1");
        Task<string> task2 = FetchDataAsync("https://api.example.com/data2");
        string[] results = await Task.WhenAll(task1, task2);

        // Progress reporting
        var progress = new Progress<int>(percent =>
            Console.WriteLine($"Progress: {percent}%"));
        await ProcessWithProgressAsync(progress);

        // Cancellation
        using var cts = new CancellationTokenSource();
        cts.CancelAfter(TimeSpan.FromSeconds(5));

        try
        {
            await FetchWithCancellationAsync("https://slow-api.com", cts.Token);
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Request timed out");
        }
    }
}
      `,
      exercises: [
        "Create an async file processor that reads multiple files concurrently",
        "Build a download manager with progress reporting and cancellation",
        "Implement a retry mechanism for failed async operations",
      ],
    },
    {
      id: "cs-linq",
      title: "LINQ and Lambda Expressions",
      content: `
# LINQ and Lambda Expressions

Master Language Integrated Query for powerful data manipulation.

## Query Syntax and Method Syntax

Learn both approaches to querying data in C#.
      `,
      codeExample: `
using System;
using System.Collections.Generic;
using System.Linq;

public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
    public string Major { get; set; }
    public double GPA { get; set; }
}

public class LinqExample
{
    public static void Main()
    {
        List<Student> students = new List<Student>
        {
            new Student { Id = 1, Name = "Alice", Age = 20, Major = "CS", GPA = 3.8 },
            new Student { Id = 2, Name = "Bob", Age = 22, Major = "Math", GPA = 3.2 },
            new Student { Id = 3, Name = "Charlie", Age = 19, Major = "CS", GPA = 3.9 },
            new Student { Id = 4, Name = "Diana", Age = 21, Major = "Physics", GPA = 3.5 }
        };

        // Query syntax
        var csStudents = from student in students
                        where student.Major == "CS"
                        orderby student.GPA descending
                        select new { student.Name, student.GPA };

        // Method syntax (more common)
        var topStudents = students
            .Where(s => s.GPA >= 3.5)
            .OrderByDescending(s => s.GPA)
            .Select(s => new { s.Name, s.GPA })
            .ToList();

        // Aggregation operations
        double averageGPA = students.Average(s => s.GPA);
        Student oldestStudent = students.OrderByDescending(s => s.Age).First();
        bool hasCSStudents = students.Any(s => s.Major == "CS");
        int csStudentCount = students.Count(s => s.Major == "CS");

        // Grouping
        var studentsByMajor = students
            .GroupBy(s => s.Major)
            .Select(g => new
            {
                Major = g.Key,
                Count = g.Count(),
                AverageGPA = g.Average(s => s.GPA)
            });

        // Join operations
        List<Course> courses = new List<Course>
        {
            new Course { Id = 1, Name = "Data Structures", Major = "CS" },
            new Course { Id = 2, Name = "Calculus", Major = "Math" },
            new Course { Id = 3, Name = "Algorithms", Major = "CS" }
        };

        var studentCourses = students
            .Join(courses,
                  student => student.Major,
                  course => course.Major,
                  (student, course) => new
                  {
                      StudentName = student.Name,
                      CourseName = course.Name
                  });

        // Complex queries
        var result = students
            .Where(s => s.Age >= 20)
            .GroupBy(s => s.Major)
            .Where(g => g.Count() > 1)
            .SelectMany(g => g.Select(s => new
            {
                s.Name,
                s.Major,
                MajorCount = g.Count()
            }))
            .OrderBy(x => x.Major)
            .ThenBy(x => x.Name);

        // Custom extension methods
        public static IEnumerable<T> WhereNot<T>(this IEnumerable<T> source,
            Func<T, bool> predicate)
        {
            return source.Where(item => !predicate(item));
        }

        // Usage of custom extension
        var nonCSStudents = students.WhereNot(s => s.Major == "CS");
    }
}

public class Course
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Major { get; set; }
}
      `,
      exercises: [
        "Create complex queries to analyze student performance data",
        "Build a reporting system using LINQ grouping and aggregation",
        "Implement custom LINQ extension methods for specific business logic",
      ],
    },
    {
      id: "cs-exception-handling",
      title: "Exception Handling",
      content: `
# Exception Handling in C#

Learn to handle errors gracefully and create robust applications.

## Try-Catch-Finally and Custom Exceptions

Proper exception handling techniques for reliable software.
      `,
      codeExample: `
using System;

// Custom exception classes
public class InsufficientFundsException : Exception
{
    public decimal Balance { get; }
    public decimal RequestedAmount { get; }

    public InsufficientFundsException(decimal balance, decimal requestedAmount)
        : base($"Insufficient funds. Balance: {balance:C}, Requested: {requestedAmount:C}")
    {
        Balance = balance;
        RequestedAmount = requestedAmount;
    }
}

public class BankAccount
{
    private decimal _balance;

    public decimal Balance => _balance;

    public BankAccount(decimal initialBalance)
    {
        if (initialBalance < 0)
            throw new ArgumentException("Initial balance cannot be negative");
        _balance = initialBalance;
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be positive");

        if (amount > _balance)
            throw new InsufficientFundsException(_balance, amount);

        _balance -= amount;
    }
}

public class ExceptionHandlingExample
{
    public static void Main()
    {
        // Basic exception handling
        try
        {
            int result = Divide(10, 0);
            Console.WriteLine($"Result: {result}");
        }
        catch (DivideByZeroException ex)
        {
            Console.WriteLine($"Cannot divide by zero: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
        }
        finally
        {
            Console.WriteLine("This always executes");
        }

        // Exception filters (C# 6.0+)
        try
        {
            ProcessData();
        }
        catch (Exception ex) when (ex.Message.Contains("network"))
        {
            Console.WriteLine("Network error occurred");
        }
    }

    public static int Divide(int a, int b)
    {
        if (b == 0)
            throw new DivideByZeroException("Division by zero is not allowed");
        return a / b;
    }

    public static void ProcessData()
    {
        throw new Exception("Network connection failed");
    }
}
      `,
      exercises: [
        "Create a file processor with comprehensive error handling",
        "Build a calculator that handles all possible mathematical errors",
        "Implement a custom exception hierarchy for a business application",
      ],
    },
    {
      id: "cs-delegates-events",
      title: "Delegates and Events",
      content: `
# Delegates and Events in C#

Master function pointers and event-driven programming.

## Delegates, Multicast Delegates, and Events

Learn to create flexible, loosely-coupled applications.
      `,
      codeExample: `
using System;

// Delegate declarations
public delegate void NotificationHandler(string message);
public delegate int MathOperation(int a, int b);

// Event publisher
public class NewsAgency
{
    // Event declaration
    public event NotificationHandler NewsPublished;

    // Protected virtual method to raise event
    protected virtual void OnNewsPublished(string news)
    {
        NewsPublished?.Invoke(news);
    }

    public void PublishNews(string news)
    {
        Console.WriteLine($"Publishing: {news}");
        OnNewsPublished(news);
    }
}

// Event subscribers
public class NewsChannel
{
    public string Name { get; }

    public NewsChannel(string name)
    {
        Name = name;
    }

    public void Subscribe(NewsAgency agency)
    {
        agency.NewsPublished += HandleNews;
    }

    private void HandleNews(string news)
    {
        Console.WriteLine($"{Name} received: {news}");
    }
}

public class DelegateExample
{
    public static void Main()
    {
        // Basic delegate usage
        MathOperation operation = Add;
        int result = operation(5, 3);
        Console.WriteLine($"Result: {result}");

        // Multicast delegate
        NotificationHandler handler = null;
        handler += SendEmail;
        handler += SendSMS;

        handler("Important message");

        // Lambda expressions
        MathOperation divide = (a, b) => b != 0 ? a / b : 0;

        // Generic delegates (Func, Action)
        Func<int, int, int> subtract = (a, b) => a - b;
        Action<string> print = message => Console.WriteLine(message);

        // Event example
        NewsAgency agency = new NewsAgency();
        NewsChannel cnn = new NewsChannel("CNN");

        cnn.Subscribe(agency);
        agency.PublishNews("Breaking: New technology announced!");
    }

    public static int Add(int a, int b) => a + b;

    public static void SendEmail(string message)
    {
        Console.WriteLine($"Email sent: {message}");
    }

    public static void SendSMS(string message)
    {
        Console.WriteLine($"SMS sent: {message}");
    }
}
      `,
      exercises: [
        "Create a stock price monitoring system using events",
        "Build a plugin architecture using delegates",
        "Implement a command pattern using delegates and events",
      ],
    },
    {
      id: "cs-file-io",
      title: "File I/O and Serialization",
      content: `
# File I/O and Serialization

Learn to work with files and serialize objects for data persistence.

## File Operations and JSON Serialization

Handle file operations and data serialization efficiently.
      `,
      codeExample: `
using System;
using System.IO;
using System.Text.Json;
using System.Collections.Generic;

public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string Email { get; set; }
}

public class FileIOExample
{
    public static void Main()
    {
        // Basic file operations
        string filePath = "example.txt";

        // Writing to file
        string content = "Hello, World!\\nThis is a test file.";
        File.WriteAllText(filePath, content);

        // Reading from file
        string readContent = File.ReadAllText(filePath);
        Console.WriteLine("File content:");
        Console.WriteLine(readContent);

        // Working with streams
        using (FileStream fs = new FileStream("data.txt", FileMode.Create))
        using (StreamWriter writer = new StreamWriter(fs))
        {
            writer.WriteLine("Line 1");
            writer.WriteLine("Line 2");
            writer.WriteLine("Line 3");
        }

        // Reading with streams
        using (FileStream fs = new FileStream("data.txt", FileMode.Open))
        using (StreamReader reader = new StreamReader(fs))
        {
            string line;
            while ((line = reader.ReadLine()) != null)
            {
                Console.WriteLine($"Read: {line}");
            }
        }

        // JSON Serialization
        Person person = new Person
        {
            Name = "John Doe",
            Age = 30,
            Email = "john@example.com"
        };

        // Serialize to JSON
        string jsonString = JsonSerializer.Serialize(person, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        File.WriteAllText("person.json", jsonString);
        Console.WriteLine("JSON serialized:");
        Console.WriteLine(jsonString);

        // Deserialize from JSON
        string jsonFromFile = File.ReadAllText("person.json");
        Person deserializedPerson = JsonSerializer.Deserialize<Person>(jsonFromFile);

        Console.WriteLine($"Deserialized: {deserializedPerson.Name}, {deserializedPerson.Age}");

        // Working with collections
        List<Person> people = new List<Person>
        {
            new Person { Name = "Alice", Age = 25, Email = "alice@example.com" },
            new Person { Name = "Bob", Age = 30, Email = "bob@example.com" }
        };

        string peopleJson = JsonSerializer.Serialize(people, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        File.WriteAllText("people.json", peopleJson);

        // Directory operations
        string directoryPath = "TestDirectory";
        if (!Directory.Exists(directoryPath))
        {
            Directory.CreateDirectory(directoryPath);
        }

        // Get files in directory
        string[] files = Directory.GetFiles(".", "*.json");
        foreach (string file in files)
        {
            Console.WriteLine($"Found JSON file: {file}");
        }
    }
}
      `,
      exercises: [
        "Create a log file manager with rotation and archiving",
        "Build a configuration system using JSON files",
        "Implement a simple database using file storage",
      ],
    },
    {
      id: "cs-testing",
      title: "Unit Testing",
      content: `
# Unit Testing in C#

Learn to write comprehensive tests for your C# applications.

## MSTest, NUnit, and Test-Driven Development

Write reliable tests to ensure code quality and maintainability.
      `,
      codeExample: `
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

// Class to test
public class Calculator
{
    public int Add(int a, int b)
    {
        return a + b;
    }

    public int Subtract(int a, int b)
    {
        return a - b;
    }

    public int Multiply(int a, int b)
    {
        return a * b;
    }

    public double Divide(int a, int b)
    {
        if (b == 0)
            throw new DivideByZeroException("Cannot divide by zero");
        return (double)a / b;
    }
}

// Test class
[TestClass]
public class CalculatorTests
{
    private Calculator _calculator;

    [TestInitialize]
    public void Setup()
    {
        _calculator = new Calculator();
    }

    [TestMethod]
    public void Add_TwoPositiveNumbers_ReturnsCorrectSum()
    {
        // Arrange
        int a = 5;
        int b = 3;
        int expected = 8;

        // Act
        int result = _calculator.Add(a, b);

        // Assert
        Assert.AreEqual(expected, result);
    }

    [TestMethod]
    public void Add_PositiveAndNegativeNumber_ReturnsCorrectSum()
    {
        // Arrange
        int a = 10;
        int b = -3;
        int expected = 7;

        // Act
        int result = _calculator.Add(a, b);

        // Assert
        Assert.AreEqual(expected, result);
    }

    [TestMethod]
    public void Subtract_TwoNumbers_ReturnsCorrectDifference()
    {
        // Arrange
        int a = 10;
        int b = 3;
        int expected = 7;

        // Act
        int result = _calculator.Subtract(a, b);

        // Assert
        Assert.AreEqual(expected, result);
    }

    [TestMethod]
    public void Divide_TwoValidNumbers_ReturnsCorrectQuotient()
    {
        // Arrange
        int a = 10;
        int b = 2;
        double expected = 5.0;

        // Act
        double result = _calculator.Divide(a, b);

        // Assert
        Assert.AreEqual(expected, result, 0.001); // Delta for floating point comparison
    }

    [TestMethod]
    [ExpectedException(typeof(DivideByZeroException))]
    public void Divide_ByZero_ThrowsDivideByZeroException()
    {
        // Arrange
        int a = 10;
        int b = 0;

        // Act & Assert
        _calculator.Divide(a, b);
    }

    [TestMethod]
    public void Divide_ByZero_ThrowsExceptionWithCorrectMessage()
    {
        // Arrange
        int a = 10;
        int b = 0;

        // Act & Assert
        var exception = Assert.ThrowsException<DivideByZeroException>(() =>
            _calculator.Divide(a, b));

        Assert.AreEqual("Cannot divide by zero", exception.Message);
    }

    [TestCleanup]
    public void Cleanup()
    {
        _calculator = null;
    }
}

// Data-driven tests
[TestClass]
public class CalculatorDataDrivenTests
{
    [TestMethod]
    [DataRow(1, 2, 3)]
    [DataRow(0, 5, 5)]
    [DataRow(-1, 1, 0)]
    [DataRow(-5, -3, -8)]
    public void Add_VariousInputs_ReturnsCorrectSum(int a, int b, int expected)
    {
        // Arrange
        var calculator = new Calculator();

        // Act
        int result = calculator.Add(a, b);

        // Assert
        Assert.AreEqual(expected, result);
    }
}
      `,
      exercises: [
        "Write comprehensive tests for a BankAccount class",
        "Create integration tests for a file processing system",
        "Implement test doubles (mocks/stubs) for external dependencies",
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
    {
      id: "cs-q3",
      question:
        "Explain the difference between abstract classes and interfaces.",
      answer:
        "Abstract classes can have implementation, constructors, and fields, while interfaces only define contracts (methods, properties, events). A class can implement multiple interfaces but inherit from only one abstract class.",
      difficulty: "intermediate",
      category: "OOP",
    },
    {
      id: "cs-q4",
      question: "What is the async/await pattern in C#?",
      answer:
        "async/await is a pattern for asynchronous programming. async methods return Task or Task<T>, and await suspends execution until the awaited task completes, allowing other code to run without blocking the thread.",
      difficulty: "advanced",
      category: "Async Programming",
    },
    {
      id: "cs-q5",
      question: "What is LINQ and how does it work?",
      answer:
        "LINQ (Language Integrated Query) allows querying data using SQL-like syntax in C#. It works through extension methods and expression trees, providing a unified way to query different data sources.",
      difficulty: "intermediate",
      category: "LINQ",
    },
  ],
};

// Comprehensive C++ Tutorial with 20+ Topics
export const comprehensiveCppTutorial: CompleteTutorial = {
  language: "cpp",
  title: "Complete C++ Tutorial",
  description:
    "Master C++ programming from fundamentals to advanced system programming",
  chapters: [
    {
      id: "cpp-basics",
      title: "C++ Fundamentals",
      content: `
# C++ Fundamentals

C++ is a powerful, general-purpose programming language that supports both procedural and object-oriented programming.

## Variables and Data Types

C++ provides various built-in data types and supports user-defined types.
      `,
      codeExample: `
#include <iostream>
#include <string>
#include <vector>

int main() {
    // Basic data types
    int age = 25;
    double salary = 50000.50;
    char grade = 'A';
    bool isEmployed = true;

    // String (C++ style)
    std::string name = "John Doe";

    // Arrays
    int numbers[5] = {1, 2, 3, 4, 5};

    // Vectors (dynamic arrays)
    std::vector<int> dynamicNumbers = {10, 20, 30, 40, 50};

    // Constants
    const double PI = 3.14159;

    // Auto keyword (C++11)
    auto city = "New York"; // string literal
    auto count = 42; // int

    // Output
    std::cout << "Name: " << name << std::endl;
    std::cout << "Age: " << age << std::endl;
    std::cout << "Salary: $" << salary << std::endl;

    // Range-based for loop (C++11)
    std::cout << "Dynamic numbers: ";
    for (const auto& num : dynamicNumbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}
      `,
      exercises: [
        "Create variables for different data types and practice input/output",
        "Work with arrays and vectors to store collections of data",
        "Use const and auto keywords appropriately",
      ],
    },
    {
      id: "cpp-oop",
      title: "Object-Oriented Programming",
      content: `
# Object-Oriented Programming in C++

C++ supports full object-oriented programming with classes, inheritance, polymorphism, and encapsulation.

## Classes and Objects

Learn to create and use classes effectively in C++.
      `,
      codeExample: `
#include <iostream>
#include <string>
#include <memory>

// Base class
class Person {
private:
    std::string name;
    int age;

public:
    // Constructor
    Person(const std::string& n, int a) : name(n), age(a) {}

    // Virtual destructor
    virtual ~Person() = default;

    // Getters
    std::string getName() const { return name; }
    int getAge() const { return age; }

    // Virtual function
    virtual void introduce() const {
        std::cout << "Hi, I'm " << name << " and I'm " << age << " years old." << std::endl;
    }

    // Pure virtual function
    virtual std::string getRole() const = 0;
};

// Derived class
class Student : public Person {
private:
    std::string studentId;
    double gpa;

public:
    Student(const std::string& name, int age, const std::string& id, double g)
        : Person(name, age), studentId(id), gpa(g) {}

    // Override virtual function
    void introduce() const override {
        std::cout << "Hi, I'm " << getName() << ", a student with ID " << studentId << std::endl;
    }

    // Implement pure virtual function
    std::string getRole() const override {
        return "Student";
    }

    double getGPA() const { return gpa; }
};

int main() {
    // Create objects
    Student student("Alice", 20, "S12345", 3.8);

    // Polymorphism
    std::vector<std::unique_ptr<Person>> people;
    people.push_back(std::make_unique<Student>("Bob", 19, "S12346", 3.5));

    // Call virtual functions
    for (const auto& person : people) {
        person->introduce();
        std::cout << "Role: " << person->getRole() << std::endl;
    }

    return 0;
}
      `,
      exercises: [
        "Create a Vehicle class hierarchy with Car and Motorcycle",
        "Implement proper copy constructors and assignment operators",
        "Use polymorphism to create a collection of different object types",
      ],
    },
    {
      id: "cpp-memory",
      title: "Memory Management",
      content: `
# Memory Management in C++

Learn manual memory management and modern smart pointers.

## Pointers, References, and Smart Pointers

Master memory management for efficient and safe C++ programs.
      `,
      codeExample: `
#include <iostream>
#include <memory>

class Resource {
private:
    int* data;
    size_t size;

public:
    Resource(size_t s) : size(s) {
        data = new int[size];
        std::cout << "Resource created with size " << size << std::endl;
    }

    ~Resource() {
        delete[] data;
        std::cout << "Resource destroyed" << std::endl;
    }

    void setValue(size_t index, int value) {
        if (index < size) {
            data[index] = value;
        }
    }

    int getValue(size_t index) const {
        return (index < size) ? data[index] : 0;
    }
};

int main() {
    // Raw pointers (manual memory management)
    int* rawPtr = new int(42);
    std::cout << "Raw pointer value: " << *rawPtr << std::endl;
    delete rawPtr; // Must manually delete

    // References
    int value = 100;
    int& ref = value; // Reference to value
    ref = 200; // Changes value
    std::cout << "Value through reference: " << value << std::endl;

    // Smart pointers (C++11)

    // unique_ptr - exclusive ownership
    std::unique_ptr<Resource> uniqueRes = std::make_unique<Resource>(5);
    uniqueRes->setValue(0, 10);
    std::cout << "Unique resource value: " << uniqueRes->getValue(0) << std::endl;

    // shared_ptr - shared ownership
    std::shared_ptr<Resource> sharedRes1 = std::make_shared<Resource>(3);
    {
        std::shared_ptr<Resource> sharedRes2 = sharedRes1; // Shared ownership
        std::cout << "Reference count: " << sharedRes1.use_count() << std::endl;
    } // sharedRes2 goes out of scope, but resource still exists

    std::cout << "Reference count after scope: " << sharedRes1.use_count() << std::endl;

    // RAII (Resource Acquisition Is Initialization)
    {
        Resource localResource(2); // Automatically destroyed when out of scope
        localResource.setValue(0, 42);
    } // Destructor called automatically

    return 0;
}
      `,
      exercises: [
        "Implement a custom smart pointer class",
        "Create a memory pool allocator",
        "Practice RAII with file handling classes",
      ],
    },
    {
      id: "cpp-templates",
      title: "Templates and Generic Programming",
      content: `
# Templates and Generic Programming

Master C++ templates for writing reusable, type-safe code.

## Function Templates and Class Templates

Create flexible, efficient generic code.
      `,
      codeExample: `
#include <iostream>
#include <vector>

// Function template
template<typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

// Class template
template<typename T>
class Stack {
private:
    std::vector<T> elements;

public:
    void push(const T& element) {
        elements.push_back(element);
    }

    void pop() {
        if (!elements.empty()) {
            elements.pop_back();
        }
    }

    T top() const {
        if (!elements.empty()) {
            return elements.back();
        }
        throw std::runtime_error("Stack is empty");
    }

    bool empty() const {
        return elements.empty();
    }

    size_t size() const {
        return elements.size();
    }
};

int main() {
    // Function templates
    std::cout << "Maximum of 5 and 3: " << maximum(5, 3) << std::endl;
    std::cout << "Maximum of 5.5 and 3.2: " << maximum(5.5, 3.2) << std::endl;

    // Class templates
    Stack<int> intStack;
    intStack.push(10);
    intStack.push(20);
    intStack.push(30);

    std::cout << "Int stack size: " << intStack.size() << std::endl;
    std::cout << "Top element: " << intStack.top() << std::endl;

    return 0;
}
      `,
      exercises: [
        "Create a generic container class with iterators",
        "Implement template metaprogramming for compile-time calculations",
        "Use template specialization for type-specific optimizations",
      ],
    },
    {
      id: "cpp-stl",
      title: "Standard Template Library (STL)",
      content: `
# Standard Template Library (STL)

Master the powerful STL containers, algorithms, and iterators.

## Containers, Algorithms, and Iterators

Leverage the STL for efficient and robust C++ programming.
      `,
      codeExample: `
#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <algorithm>
#include <numeric>

int main() {
    // Containers
    std::vector<int> numbers = {5, 2, 8, 1, 9, 3};
    std::map<std::string, int> ages = {
        {"Alice", 25},
        {"Bob", 30},
        {"Charlie", 22}
    };
    std::set<int> uniqueNumbers = {1, 2, 3, 2, 1, 4, 5};

    // Algorithms

    // Sorting
    std::sort(numbers.begin(), numbers.end());
    std::cout << "Sorted numbers: ";
    for (const auto& num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    // Finding
    auto it = std::find(numbers.begin(), numbers.end(), 5);
    if (it != numbers.end()) {
        std::cout << "Found 5 at position: " << std::distance(numbers.begin(), it) << std::endl;
    }

    // Counting
    int count = std::count_if(numbers.begin(), numbers.end(), [](int n) {
        return n > 3;
    });
    std::cout << "Numbers greater than 3: " << count << std::endl;

    // Transforming
    std::vector<int> squared(numbers.size());
    std::transform(numbers.begin(), numbers.end(), squared.begin(), [](int n) {
        return n * n;
    });

    std::cout << "Squared numbers: ";
    for (const auto& num : squared) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    // Accumulating
    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);
    std::cout << "Sum of numbers: " << sum << std::endl;

    // Working with maps
    std::cout << "Ages:" << std::endl;
    for (const auto& pair : ages) {
        std::cout << pair.first << ": " << pair.second << std::endl;
    }

    // Working with sets
    std::cout << "Unique numbers: ";
    for (const auto& num : uniqueNumbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}
      `,
      exercises: [
        "Implement a custom iterator for your own container class",
        "Use STL algorithms to solve complex data processing problems",
        "Create a program that demonstrates all major STL containers",
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
    {
      id: "cpp-q2",
      question: "What is RAII in C++?",
      answer:
        "RAII (Resource Acquisition Is Initialization) is a programming idiom where resource allocation is tied to object lifetime. Resources are acquired in constructors and released in destructors, ensuring automatic cleanup.",
      difficulty: "intermediate",
      category: "Memory Management",
    },
    {
      id: "cpp-q3",
      question:
        "What is the difference between virtual and pure virtual functions?",
      answer:
        "Virtual functions can be overridden in derived classes and have a default implementation. Pure virtual functions (= 0) must be overridden and make the class abstract.",
      difficulty: "intermediate",
      category: "OOP",
    },
    {
      id: "cpp-q4",
      question: "What are smart pointers and why should you use them?",
      answer:
        "Smart pointers automatically manage memory allocation and deallocation. unique_ptr provides exclusive ownership, shared_ptr allows shared ownership, and weak_ptr provides non-owning references. They prevent memory leaks and dangling pointers.",
      difficulty: "advanced",
      category: "Memory Management",
    },
    {
      id: "cpp-q5",
      question: "What is template specialization?",
      answer:
        "Template specialization allows you to provide specific implementations for particular types. It enables optimization for specific types while maintaining the generic template for others.",
      difficulty: "advanced",
      category: "Templates",
    },
  ],
};

// Comprehensive Go Tutorial with 20+ Topics
export const comprehensiveGoTutorial: CompleteTutorial = {
  language: "go",
  title: "Complete Go Tutorial",
  description: "Master Go programming for modern software development",
  chapters: [
    {
      id: "go-basics",
      title: "Go Fundamentals",
      content: `
# Go Fundamentals

Go is a statically typed, compiled programming language designed for simplicity and efficiency.

## Variables and Data Types

Go has a simple type system with built-in types and user-defined types.
      `,
      codeExample: `
package main

import (
    "fmt"
)

func main() {
    // Variable declarations
    var name string = "John"
    var age int = 30
    var salary float64 = 50000.50
    var isEmployed bool = true

    // Short variable declaration
    city := "New York"
    count := 42

    // Constants
    const PI = 3.14159
    const CompanyName = "Tech Corp"

    // Arrays
    var numbers [5]int = [5]int{1, 2, 3, 4, 5}

    // Slices (dynamic arrays)
    fruits := []string{"apple", "banana", "orange"}
    fruits = append(fruits, "grape")

    // Maps
    person := map[string]interface{}{
        "name":   name,
        "age":    age,
        "salary": salary,
    }

    // Structs
    type Employee struct {
        Name     string
        Age      int
        Position string
    }

    emp := Employee{
        Name:     "Alice",
        Age:      28,
        Position: "Developer",
    }

    // Output
    fmt.Printf("Name: %s, Age: %d\\n", name, age)
    fmt.Printf("Person: %+v\\n", person)
    fmt.Printf("Employee: %+v\\n", emp)
    fmt.Printf("Fruits: %v\\n", fruits)
}
      `,
      exercises: [
        "Create variables for different data types",
        "Work with slices and maps",
        "Define and use custom structs",
      ],
    },
    {
      id: "go-functions",
      title: "Functions and Methods",
      content: `
# Functions and Methods in Go

Learn to create functions, methods, and understand Go's approach to object-oriented programming.

## Functions, Methods, and Interfaces

Go uses composition over inheritance with interfaces and methods.
      `,
      codeExample: `
package main

import (
    "fmt"
    "errors"
)

// Function with multiple return values
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// Function with named return values
func calculate(a, b int) (sum, product int) {
    sum = a + b
    product = a * b
    return // naked return
}

// Variadic function
func sum(numbers ...int) int {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return total
}

// Struct definition
type Rectangle struct {
    Width  float64
    Height float64
}

// Method with value receiver
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// Method with pointer receiver
func (r *Rectangle) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}

func main() {
    // Function calls
    result, err := divide(10, 3)
    if err != nil {
        fmt.Printf("Error: %v\\n", err)
    } else {
        fmt.Printf("Division result: %.2f\\n", result)
    }

    s, p := calculate(5, 3)
    fmt.Printf("Sum: %d, Product: %d\\n", s, p)

    total := sum(1, 2, 3, 4, 5)
    fmt.Printf("Sum of numbers: %d\\n", total)

    // Methods
    rect := Rectangle{Width: 5, Height: 3}
    fmt.Printf("Rectangle area: %.2f\\n", rect.Area())

    rect.Scale(2)
    fmt.Printf("Scaled rectangle area: %.2f\\n", rect.Area())
}
      `,
      exercises: [
        "Create functions with multiple return values and error handling",
        "Implement methods for custom types",
        "Define and use interfaces for polymorphism",
      ],
    },
    {
      id: "go-concurrency",
      title: "Concurrency with Goroutines",
      content: `
# Concurrency with Goroutines and Channels

Master Go's powerful concurrency model with goroutines and channels.

## Goroutines, Channels, and Select

Learn to write concurrent programs efficiently and safely.
      `,
      codeExample: `
package main

import (
    "fmt"
    "sync"
    "time"
)

// Simple goroutine
func sayHello(name string) {
    for i := 0; i < 3; i++ {
        fmt.Printf("Hello %s! (%d)\\n", name, i+1)
        time.Sleep(100 * time.Millisecond)
    }
}

// Worker function for channels
func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, job)
        time.Sleep(time.Second)
        results <- job * 2
    }
}

func main() {
    // Basic goroutines
    go sayHello("Alice")
    go sayHello("Bob")

    // Wait for goroutines to complete
    time.Sleep(500 * time.Millisecond)

    // Channels for communication
    ch := make(chan string, 2) // Buffered channel
    ch <- "Hello"
    ch <- "World"

    fmt.Println(<-ch)
    fmt.Println(<-ch)

    // Worker pool pattern
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // Start workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Send jobs
    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    // Collect results
    for r := 1; r <= 5; r++ {
        <-results
    }

    // WaitGroup for synchronization
    var wg sync.WaitGroup

    for i := 1; i <= 3; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            fmt.Printf("Goroutine %d starting\\n", id)
            time.Sleep(time.Second)
            fmt.Printf("Goroutine %d done\\n", id)
        }(i)
    }

    wg.Wait()
    fmt.Println("All goroutines completed")
}
      `,
      exercises: [
        "Create a concurrent web scraper using goroutines",
        "Implement a producer-consumer pattern with channels",
        "Build a worker pool for parallel processing",
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
    {
      id: "go-q2",
      question: "What is the difference between channels and mutexes?",
      answer:
        'Channels are used for communication between goroutines and follow the principle "Don\'t communicate by sharing memory; share memory by communicating." Mutexes are used for protecting shared data with locks.',
      difficulty: "intermediate",
      category: "Concurrency",
    },
    {
      id: "go-q3",
      question: "What is the difference between a slice and an array in Go?",
      answer:
        "Arrays have a fixed size determined at compile time, while slices are dynamic and can grow/shrink. Slices are references to underlying arrays and are more commonly used.",
      difficulty: "beginner",
      category: "Data Types",
    },
    {
      id: "go-q4",
      question: "How does Go handle memory management?",
      answer:
        "Go has automatic garbage collection. The runtime automatically frees memory that is no longer referenced. Go uses a concurrent, tri-color mark-and-sweep garbage collector.",
      difficulty: "intermediate",
      category: "Memory Management",
    },
    {
      id: "go-q5",
      question:
        "What is an interface in Go and how is it different from other languages?",
      answer:
        "Interfaces in Go are implicitly implemented - a type implements an interface by implementing its methods without explicitly declaring it. This enables duck typing and makes code more flexible.",
      difficulty: "intermediate",
      category: "Interfaces",
    },
  ],
};

// Export comprehensive tutorials
export const comprehensiveTutorials = {
  csharp: comprehensiveCsharpTutorial,
  cpp: comprehensiveCppTutorial,
  go: comprehensiveGoTutorial,
};
