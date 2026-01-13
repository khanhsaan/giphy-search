# Day 3 – TypeScript Deep Dive & HTTP Clients (Axios vs Fetch)

**Date:** January 13, 2026  
**Goal:** Master TypeScript advanced patterns and understand why Axios is preferred over fetch()

---

## 🎯 Today's Objectives

1. Understand why companies prefer Axios over fetch()
2. Learn advanced TypeScript patterns
3. Master type-safe API calls
4. Understand generics and utility types
5. Prepare for TypeScript interview questions

---

## 📋 Tasks

### 1. Axios vs Fetch() - Why Companies Prefer Axios (45 minutes)

#### Why Did They Require Axios?

**Short Answer:** Axios provides better developer experience, automatic features, and more robust error handling out of the box compared to fetch().

#### Key Differences

| Feature | fetch() | Axios |
|---------|---------|-------|
| **Browser Support** | Modern browsers only | Works everywhere (includes polyfill) |
| **JSON Parsing** | Manual `.json()` call | Automatic |
| **Request/Response Interceptors** | ❌ Not built-in | ✅ Built-in |
| **Request Cancellation** | AbortController (verbose) | CancelToken (simpler) |
| **Timeout Support** | ❌ Not built-in | ✅ Built-in |
| **Progress Tracking** | ❌ Manual | ✅ Built-in (upload/download) |
| **Error Handling** | Only network errors | HTTP errors + network errors |
| **Request/Response Transformation** | Manual | Automatic |
| **XSRF Protection** | Manual | ✅ Built-in |
| **Base URL** | Manual concatenation | ✅ Built-in |
| **TypeScript Support** | Basic | Excellent with generics |

---

#### Detailed Comparison with Code Examples

**1. JSON Handling**

```typescript
// ❌ fetch() - Manual JSON parsing
const response = await fetch('/api/users');
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json(); // Extra step

// ✅ Axios - Automatic JSON parsing
const response = await axios.get('/api/users');
const data = response.data; // Already parsed!
```

**2. Error Handling**

```typescript
// ❌ fetch() - Only network errors throw
// HTTP errors (404, 500) don't throw automatically!
try {
  const response = await fetch('/api/users');
  if (!response.ok) { // You must manually check this
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  // Only catches network errors by default
  console.error('Error:', error);
}

// ✅ Axios - HTTP errors throw automatically
try {
  const response = await axios.get('/api/users');
  const data = response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handles both HTTP errors AND network errors
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
  }
}
```

**3. Request Configuration**

```typescript
// ❌ fetch() - Verbose configuration
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ name: 'John' })
});
const data = await response.json();

// ✅ Axios - Cleaner configuration
const response = await axios.post('/api/users', 
  { name: 'John' }, // Auto-stringified
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const data = response.data;
```

**4. Interceptors (Authentication, Logging, etc.)**

```typescript
// ❌ fetch() - No built-in interceptor support
// You'd have to wrap fetch in your own function
const customFetch = async (url: string, options: RequestInit = {}) => {
  // Add auth token manually to every request
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${getToken()}`
  };
  
  const response = await fetch(url, options);
  
  // Log manually
  console.log(`${options.method || 'GET'} ${url}:`, response.status);
  
  return response;
};

// ✅ Axios - Built-in interceptors (set once, works everywhere)
// Request interceptor
axios.interceptors.request.use(
  (config) => {
    // Automatically add auth token to all requests
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    console.log(`Response:`, response.status);
    return response;
  },
  (error) => {
    // Handle token expiration globally
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**5. Timeout Support**

```typescript
// ❌ fetch() - No built-in timeout, must use AbortController
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('/api/users', {
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  const data = await response.json();
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request timed out');
  }
}

// ✅ Axios - Built-in timeout
try {
  const response = await axios.get('/api/users', {
    timeout: 5000 // 5 seconds
  });
  const data = response.data;
} catch (error) {
  if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
    console.log('Request timed out');
  }
}
```

**6. Progress Tracking (File Uploads)**

```typescript
// ❌ fetch() - No built-in progress tracking
const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
// No way to track progress easily

// ✅ Axios - Built-in progress tracking
const response = await axios.post('/api/upload', formData, {
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / (progressEvent.total || 1)
    );
    console.log(`Upload Progress: ${percentCompleted}%`);
  }
});
```

**7. Request Cancellation**

```typescript
// ❌ fetch() - Verbose with AbortController
const controller = new AbortController();

fetch('/api/users', { signal: controller.signal })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Request cancelled');
    }
  });

// Cancel the request
controller.abort();

// ✅ Axios - Simpler with CancelToken
const source = axios.CancelToken.source();

axios.get('/api/users', {
  cancelToken: source.token
}).catch(error => {
  if (axios.isCancel(error)) {
    console.log('Request cancelled', error.message);
  }
});

// Cancel the request
source.cancel('Operation cancelled by user');
```

**8. Base URL and Default Configuration**

```typescript
// ❌ fetch() - Manual URL construction
const API_BASE_URL = 'https://api.example.com';

const getUsers = () => fetch(`${API_BASE_URL}/users`);
const getUser = (id: string) => fetch(`${API_BASE_URL}/users/${id}`);
const getPosts = () => fetch(`${API_BASE_URL}/posts`);
// Repetitive and error-prone

// ✅ Axios - Instance with base URL
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const getUsers = () => api.get('/users');
const getUser = (id: string) => api.get(`/users/${id}`);
const getPosts = () => api.get('/posts');
// Clean and maintainable
```

---

#### Type-Safe Axios Setup (Production Pattern)

```typescript
// api/client.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define your API response structure
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error(`Error ${status}:`, data.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response received');
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Type-safe API methods
export const api = {
  // GET request
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get<ApiResponse<T>>(url, config).then(res => res.data.data);
  },
  
  // POST request
  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post<ApiResponse<T>>(url, data, config).then(res => res.data.data);
  },
  
  // PUT request
  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put<ApiResponse<T>>(url, data, config).then(res => res.data.data);
  },
  
  // PATCH request
  patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch<ApiResponse<T>>(url, data, config).then(res => res.data.data);
  },
  
  // DELETE request
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete<ApiResponse<T>>(url, config).then(res => res.data.data);
  }
};

export default apiClient;
```

**Usage in your app:**

```typescript
// types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

// services/user.service.ts
import { api } from '../api/client';
import { User, CreateUserDto } from '../types/user.types';

export const userService = {
  // Get all users
  getUsers: () => api.get<User[]>('/users'),
  
  // Get single user
  getUser: (id: string) => api.get<User>(`/users/${id}`),
  
  // Create user
  createUser: (data: CreateUserDto) => api.post<User, CreateUserDto>('/users', data),
  
  // Update user
  updateUser: (id: string, data: Partial<User>) => 
    api.put<User, Partial<User>>(`/users/${id}`, data),
  
  // Delete user
  deleteUser: (id: string) => api.delete<void>(`/users/${id}`)
};

// Usage in component
const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data); // Type-safe! data is User[]
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  return (
    <div>
      {loading && <Spinner />}
      {error && <Error message={error} />}
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
};
```

---

#### Custom Hook with Axios

```typescript
// hooks/useAPI.ts
import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface UseAPIResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAPI<T>(
  url: string,
  config?: AxiosRequestConfig
): UseAPIResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get<T>(url, config);
        setData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url, refetchIndex]);
  
  const refetch = () => setRefetchIndex(prev => prev + 1);
  
  return { data, loading, error, refetch };
}

// Usage
const UserProfile = ({ userId }: { userId: string }) => {
  const { data: user, loading, error, refetch } = useAPI<User>(`/api/users/${userId}`);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  if (!user) return null;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
};
```

---

#### Why Companies Prefer Axios

**Summary for Interview:**

> "Companies prefer Axios over fetch() because:
> 
> 1. **Better Developer Experience** - Automatic JSON parsing, cleaner syntax
> 2. **Built-in Features** - Interceptors, timeouts, progress tracking, request cancellation
> 3. **Robust Error Handling** - HTTP errors throw automatically, better error info
> 4. **Consistency** - Works the same across all browsers (includes polyfill)
> 5. **Configuration** - Base URL, default headers, instance creation
> 6. **TypeScript Support** - Excellent generic typing for type-safe APIs
> 7. **Maintenance** - Less boilerplate code, easier to maintain
> 
> In a production application, especially in a team environment, these features save significant development time and reduce bugs. The interceptor pattern alone is worth it for handling auth tokens and global error handling."

---

### 2. TypeScript Advanced Patterns (60 minutes)

#### A. Generics

**What are Generics?**
Generics allow you to write reusable, type-safe code that works with multiple types.

```typescript
// 1. Basic Generic Function
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42); // num is number
const str = identity<string>("hello"); // str is string
const bool = identity(true); // Type inference: bool is boolean

// 2. Generic Array Function
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = getFirstElement([1, 2, 3]); // number | undefined
const firstName = getFirstElement(["a", "b"]); // string | undefined

// 3. Generic with Constraints
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello"); // ✅ string has length
logLength([1, 2, 3]); // ✅ array has length
logLength({ length: 10 }); // ✅ object has length
// logLength(123); // ❌ Error: number doesn't have length

// 4. Generic Interfaces
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: string;
  name: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: "1", name: "John" },
  status: 200,
  message: "Success"
};

const usersResponse: ApiResponse<User[]> = {
  data: [{ id: "1", name: "John" }],
  status: 200,
  message: "Success"
};

// 5. Generic Classes
class DataStore<T> {
  private data: T[] = [];
  
  add(item: T): void {
    this.data.push(item);
  }
  
  get(index: number): T | undefined {
    return this.data[index];
  }
  
  getAll(): T[] {
    return this.data;
  }
}

const numberStore = new DataStore<number>();
numberStore.add(1);
numberStore.add(2);
console.log(numberStore.getAll()); // [1, 2]

const userStore = new DataStore<User>();
userStore.add({ id: "1", name: "John" });

// 6. Multiple Type Parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const result = merge(
  { name: "John" },
  { age: 30 }
);
// result type: { name: string } & { age: number }
console.log(result.name, result.age);

// 7. Generic Constraints with keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "John", age: 30 };
const name = getProperty(user, "name"); // string
const age = getProperty(user, "age"); // number
// getProperty(user, "invalid"); // ❌ Error: "invalid" not in User
```

#### B. Utility Types

TypeScript provides built-in utility types for common transformations:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  address?: string;
}

// 1. Partial<T> - Makes all properties optional
type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; age?: number; address?: string; }

const updateUser = (id: string, updates: Partial<User>) => {
  // Can pass any subset of User properties
};
updateUser("1", { name: "Jane" }); // ✅
updateUser("2", { age: 25, email: "jane@example.com" }); // ✅

// 2. Required<T> - Makes all properties required
type RequiredUser = Required<User>;
// { id: string; name: string; email: string; age: number; address: string; }

// 3. Readonly<T> - Makes all properties readonly
type ReadonlyUser = Readonly<User>;
const user: ReadonlyUser = { id: "1", name: "John", email: "john@example.com", age: 30 };
// user.name = "Jane"; // ❌ Error: Cannot assign to 'name' because it is read-only

// 4. Pick<T, K> - Pick specific properties
type UserPreview = Pick<User, "id" | "name">;
// { id: string; name: string; }

const preview: UserPreview = { id: "1", name: "John" };

// 5. Omit<T, K> - Omit specific properties
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string; age: number; address?: string; }

const newUser: UserWithoutId = {
  name: "John",
  email: "john@example.com",
  age: 30
};

// 6. Record<K, T> - Create object type with specific keys and values
type UserRoles = Record<string, "admin" | "user" | "guest">;
const roles: UserRoles = {
  "user1": "admin",
  "user2": "user",
  "user3": "guest"
};

type PageInfo = Record<"home" | "about" | "contact", { title: string; path: string }>;
const pages: PageInfo = {
  home: { title: "Home", path: "/" },
  about: { title: "About", path: "/about" },
  contact: { title: "Contact", path: "/contact" }
};

// 7. Exclude<T, U> - Exclude types from union
type Status = "pending" | "approved" | "rejected";
type ActiveStatus = Exclude<Status, "rejected">;
// "pending" | "approved"

// 8. Extract<T, U> - Extract types from union
type Actions = "create" | "read" | "update" | "delete";
type MutationActions = Extract<Actions, "create" | "update" | "delete">;
// "create" | "update" | "delete"

// 9. NonNullable<T> - Remove null and undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string

// 10. ReturnType<T> - Get function return type
function getUser() {
  return { id: "1", name: "John" };
}
type UserType = ReturnType<typeof getUser>;
// { id: string; name: string; }

// 11. Parameters<T> - Get function parameters as tuple
function createUser(name: string, age: number) {
  return { name, age };
}
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number]

// 12. Awaited<T> - Get type of Promise resolution
type PromiseUser = Promise<User>;
type ResolvedUser = Awaited<PromiseUser>;
// User

async function fetchUser(): Promise<User> {
  return { id: "1", name: "John", email: "john@example.com", age: 30 };
}
type FetchedUser = Awaited<ReturnType<typeof fetchUser>>;
// User
```

#### C. Advanced Type Patterns

```typescript
// 1. Discriminated Unions (Tagged Unions)
type Success<T> = {
  type: 'success';
  data: T;
};

type Error = {
  type: 'error';
  message: string;
  code: number;
};

type Loading = {
  type: 'loading';
};

type ApiState<T> = Success<T> | Error | Loading;

function handleApiState<T>(state: ApiState<T>) {
  switch (state.type) {
    case 'success':
      console.log(state.data); // TypeScript knows data exists
      break;
    case 'error':
      console.log(state.message, state.code); // TypeScript knows these exist
      break;
    case 'loading':
      console.log('Loading...'); // TypeScript knows only type exists
      break;
  }
}

// 2. Mapped Types
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;
// { id: string | null; name: string | null; email: string | null; ... }

type Flags<T> = {
  [K in keyof T as `is${Capitalize<string & K>}Valid`]: boolean;
};

type UserFlags = Flags<Pick<User, "name" | "email">>;
// { isNameValid: boolean; isEmailValid: boolean; }

// 3. Conditional Types
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number

// 4. Template Literal Types
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = `/api/${string}`;

type APIRoute = `${HTTPMethod} ${Endpoint}`;
// "GET /api/..." | "POST /api/..." | "PUT /api/..." | "DELETE /api/..."

const route: APIRoute = "GET /api/users"; // ✅
// const invalid: APIRoute = "GET /users"; // ❌

// 5. infer keyword
type GetArrayType<T> = T extends Array<infer U> ? U : never;

type StringArray = GetArrayType<string[]>; // string
type NumberArray = GetArrayType<number[]>; // number

type GetPromiseType<T> = T extends Promise<infer U> ? U : never;

type UserPromise = GetPromiseType<Promise<User>>; // User

// 6. Type Guards
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  );
}

function processData(data: unknown) {
  if (isUser(data)) {
    console.log(data.name); // TypeScript knows data is User
  }
}

// 7. Assertion Functions
function assertIsUser(obj: unknown): asserts obj is User {
  if (!isUser(obj)) {
    throw new Error('Not a user');
  }
}

function processUser(data: unknown) {
  assertIsUser(data);
  console.log(data.name); // TypeScript knows data is User after assertion
}
```

---

### 3. Interview Questions: TypeScript & Axios (30 minutes)

#### Q1: "Why did we ask you to use Axios instead of fetch()?"

**Your Answer:**
"That's a great question. While fetch() is built into modern browsers, Axios provides several advantages for production applications:

**Key Benefits:**
1. **Automatic JSON handling** - No need to call `.json()` manually
2. **Better error handling** - HTTP errors (404, 500) throw automatically, unlike fetch() which only throws on network errors
3. **Interceptors** - Perfect for adding auth tokens globally or handling 401 responses in one place
4. **Built-in features** - Timeout support, request cancellation, progress tracking
5. **TypeScript support** - Excellent generic typing for type-safe API calls
6. **Base URL configuration** - Cleaner code with axios instances

In a team environment with multiple developers, these features ensure consistency and reduce boilerplate code. The interceptor pattern alone is incredibly valuable for handling authentication and logging.

For example, in my take-home project, I could set up Axios like this:

```typescript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000
});

api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});
```

This automatically adds auth to all requests, which would require wrapper functions with fetch()."

---

#### Q2: "Explain generics in TypeScript and why they're useful."

**Your Answer:**
"Generics allow you to write reusable, type-safe code that works with multiple types without sacrificing type safety.

**Simple Example:**
```typescript
// Without generics - need separate functions
function getFirstNumber(arr: number[]): number | undefined {
  return arr[0];
}
function getFirstString(arr: string[]): string | undefined {
  return arr[0];
}

// With generics - one function for all types
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = getFirst([1, 2, 3]); // TypeScript knows: number | undefined
const str = getFirst(['a', 'b']); // TypeScript knows: string | undefined
```

**Real-World Use Case in API Calls:**
```typescript
async function fetchAPI<T>(url: string): Promise<T> {
  const response = await axios.get<T>(url);
  return response.data;
}

interface User { id: string; name: string; }
const user = await fetchAPI<User>('/api/user/1'); 
// TypeScript knows user is User, not 'any'
```

**Benefits:**
- Type safety without code duplication
- Better IDE autocomplete
- Catch errors at compile time
- Self-documenting code

In production apps, generics are essential for building reusable API clients, state management, and utility functions."

---

#### Q3: "What are TypeScript utility types and when would you use them?"

**Your Answer:**
"Utility types are built-in TypeScript helpers that transform types. They're incredibly useful for common patterns:

**Most Common Ones:**

1. **Partial<T>** - For update operations
```typescript
function updateUser(id: string, updates: Partial<User>) {
  // Can pass any subset of User properties
}
updateUser('1', { name: 'Jane' }); // Only update name
```

2. **Pick<T, K>** - For creating DTOs or props
```typescript
type UserPreview = Pick<User, 'id' | 'name'>;
// Only id and name, perfect for list views
```

3. **Omit<T, K>** - For excluding sensitive fields
```typescript
type UserWithoutPassword = Omit<User, 'password'>;
// Safe to send to frontend
```

4. **Record<K, T>** - For dictionaries
```typescript
type UserMap = Record<string, User>;
const users: UserMap = {
  'user1': { id: '1', name: 'John' },
  'user2': { id: '2', name: 'Jane' }
};
```

5. **ReturnType<T>** - Get function return type
```typescript
function getConfig() {
  return { apiUrl: '...', timeout: 5000 };
}
type Config = ReturnType<typeof getConfig>;
```

**Real Project Example:**
In a Baseline project, I might use:
- `Partial<User>` for update endpoints
- `Pick<User, 'id' | 'email'>` for auth state
- `Omit<User, 'password'>` for API responses
- `Record<string, Role>` for user permissions

They reduce code duplication and make intent clearer."

---

## 📝 Key Takeaways to Memorize

### Axios vs fetch()
- [ ] Know at least 3 advantages of Axios
- [ ] Can explain interceptors
- [ ] Understand error handling differences
- [ ] Can set up type-safe Axios client

### TypeScript
- [ ] Understand generic syntax `<T>`
- [ ] Know 5+ utility types
- [ ] Can explain discriminated unions
- [ ] Understand type guards

### Production Patterns
- [ ] API client setup with interceptors
- [ ] Type-safe HTTP methods
- [ ] Error handling strategies
- [ ] Custom hooks with Axios

---

## ✅ End of Day Checklist

- [ ] Understand why companies prefer Axios over fetch()
- [ ] Can set up production-ready Axios client
- [ ] Know interceptor patterns
- [ ] Understand TypeScript generics
- [ ] Know common utility types (Partial, Pick, Omit, Record)
- [ ] Can create type-safe API services
- [ ] Prepared answers for Axios/TypeScript questions
- [ ] Reviewed advanced TypeScript patterns

**Self-Assessment:**
- [ ] Can I explain Axios advantages? 📡
- [ ] Can I write generic functions? 🔤
- [ ] Do I know utility types? 🛠️
- [ ] Can I set up type-safe APIs? 🔒

---

## 🎯 Practice Exercise

### Refactor Your Giphy Search with Axios

If you used fetch() in your giphy-search project, consider this refactor:

**Before (fetch):**
```typescript
const searchGifs = async (query: string) => {
  const response = await fetch(`/api/search?q=${query}`);
  if (!response.ok) {
    throw new Error('Search failed');
  }
  const data = await response.json();
  return data;
};
```

**After (Axios with types):**
```typescript
// types/gif.types.ts
interface Gif {
  id: string;
  url: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
    };
  };
}

interface SearchResponse {
  data: Gif[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

// services/giphy.service.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000
});

export const giphyService = {
  search: async (query: string): Promise<Gif[]> => {
    const response = await api.get<SearchResponse>('/search', {
      params: { q: query }
    });
    return response.data.data;
  },
  
  getTrending: async (): Promise<Gif[]> => {
    const response = await api.get<SearchResponse>('/trending');
    return response.data.data;
  }
};
```

---

## 📚 Additional Resources

### Axios
- [ ] [Axios Documentation](https://axios-http.com/)
- [ ] [Axios GitHub](https://github.com/axios/axios)

### TypeScript
- [ ] [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [ ] [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [ ] [Advanced TypeScript Patterns](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

---

**Tomorrow (Day 4):** Serverless architecture deep dive - Lambda optimization, API Gateway patterns, DynamoDB modeling.

**Time Investment Today:** ~2.5 hours  
**Priority:** HIGH – Understanding Axios is crucial for your take-home assessment
