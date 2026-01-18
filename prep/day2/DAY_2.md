# Day 2 – React Patterns & Production Best Practices

**Date:** January 12, 2026  
**Goal:** Master React patterns used in professional/production environments

---

## 🎯 Today's Objectives

1. Review modern React patterns (Hooks, Custom Hooks, Context)
2. Understand production best practices (performance, code organization)
3. Learn React + TypeScript patterns
4. Prepare to discuss React architecture decisions
5. Review your giphy-search code with a critical eye

---

## 📋 Tasks

### 1. Modern React Patterns (60 minutes)

#### A. React Hooks Mastery

**Core Hooks to Know Cold:**
- [ ] **useState** - State management in functional components
- [ ] **useEffect** - Side effects, data fetching, subscriptions
- [ ] **useContext** - Consume context without Context.Consumer
- [ ] **useReducer** - Complex state logic (alternative to useState)
- [ ] **useCallback** - Memoize callbacks to prevent re-renders
- [ ] **useMemo** - Memoize expensive calculations
- [ ] **useRef** - Access DOM elements or persist values
- [ ] **Custom Hooks** - Extract reusable logic

**Common Patterns to Discuss:**

```typescript
// 1. Custom Hook Pattern (Data Fetching)
function useAPI<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 2. useCallback for Performance
const MemoizedComponent = () => {
  const [count, setCount] = useState(0);
  
  // ❌ Bad: Creates new function on every render
  const handleClick = () => setCount(count + 1);
  
  // ✅ Good: Memoized function
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // Empty deps because we use functional update
  
  return <ExpensiveChild onClick={handleClick} />;
};

// 3. useMemo for Expensive Calculations
const DataList = ({ items, filter }) => {
  // ✅ Only recalculate when items or filter change
  const filteredItems = useMemo(() => {
    return items.filter(item => item.includes(filter));
  }, [items, filter]);
  
  return <List data={filteredItems} />;
};

// 4. useReducer for Complex State
type State = { count: number; history: number[] };
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { 
        count: state.count + 1, 
        history: [...state.history, state.count + 1] 
      };
    case 'decrement':
      return { 
        count: state.count - 1, 
        history: [...state.history, state.count - 1] 
      };
    case 'reset':
      return { count: 0, history: [] };
    default:
      return state;
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0, history: [] });
  // ...
};
```

#### B. Context API Pattern

```typescript
// 1. Create Context with TypeScript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string) => {
    const userData = await authAPI.login(email, password);
    setUser(userData);
  };
  
  const logout = () => setUser(null);
  
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Custom Hook for Context (Best Practice)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Usage in components
const Profile = () => {
  const { user, logout } = useAuth();
  return <div>{user?.name}</div>;
};
```

#### C. Component Composition Patterns

```typescript
// 1. Compound Components Pattern
const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.List = ({ children }) => <div role="tablist">{children}</div>;
Tabs.Tab = ({ index, children }) => {
  const { activeTab, setActiveTab } = useTabsContext();
  return <button onClick={() => setActiveTab(index)}>{children}</button>;
};
Tabs.Panel = ({ index, children }) => {
  const { activeTab } = useTabsContext();
  return activeTab === index ? <div>{children}</div> : null;
};

// Usage
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
    <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>Content 1</Tabs.Panel>
  <Tabs.Panel index={1}>Content 2</Tabs.Panel>
</Tabs>

// 2. Render Props Pattern
interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => React.ReactNode;
}

const MouseTracker: React.FC<MouseTrackerProps> = ({ render }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  
  return <>{render(position)}</>;
};

// Usage
<MouseTracker render={({ x, y }) => <div>Mouse at {x}, {y}</div>} />

// 3. Higher-Order Component (HOC) Pattern
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}

const ProtectedPage = withAuth(DashboardPage);
```

---

### 2. Production Best Practices (45 minutes)

#### A. Performance Optimization

**Key Techniques:**

1. **React.memo** - Prevent unnecessary re-renders
```typescript
// Only re-renders if props change
const ExpensiveComponent = React.memo<Props>(({ data, onUpdate }) => {
  return <div>{/* Complex rendering */}</div>;
});

// Custom comparison function
const areEqual = (prevProps: Props, nextProps: Props) => {
  return prevProps.id === nextProps.id;
};
const OptimizedComponent = React.memo(MyComponent, areEqual);
```

2. **Code Splitting** - Load components on demand
```typescript
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <HeavyChart data={data} />
  </Suspense>
);

// Route-based code splitting
const routes = [
  { path: '/', component: lazy(() => import('./pages/Home')) },
  { path: '/dashboard', component: lazy(() => import('./pages/Dashboard')) },
];
```

3. **Virtualization** - For long lists
```typescript
import { FixedSizeList } from 'react-window';

const VirtualizedList = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>{items[index].name}</div>
    )}
  </FixedSizeList>
);
```

4. **Debouncing & Throttling**
```typescript
import { useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

const SearchInput = () => {
  const [query, setQuery] = useState('');
  
  // Debounce API call
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      apiSearch(value);
    }, 300),
    []
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return <input value={query} onChange={handleChange} />;
};
```

#### B. Code Organization

**Recommended Folder Structure:**
```
src/
├── components/          # Reusable UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.css
│   │   └── index.ts
│   └── Card/
├── pages/              # Route/Page components
│   ├── Home/
│   └── Dashboard/
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useAPI.ts
│   └── useLocalStorage.ts
├── context/            # Context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── services/           # API calls, external services
│   ├── api.ts
│   └── auth.service.ts
├── utils/              # Helper functions
│   ├── formatters.ts
│   └── validators.ts
├── types/              # TypeScript types/interfaces
│   ├── user.types.ts
│   └── api.types.ts
├── constants/          # Constants, config
│   └── config.ts
└── App.tsx
```

#### C. Error Handling

```typescript
// 1. Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>

// 2. useErrorHandler Hook
const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (error) {
      // Log to service (Sentry, LogRocket, etc.)
      console.error('Error:', error);
    }
  }, [error]);
  
  return setError;
};
```

#### D. Accessibility (a11y)

```typescript
// Best practices
const AccessibleButton = () => (
  <button
    aria-label="Close dialog"
    aria-pressed={isActive}
    role="button"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  >
    <CloseIcon aria-hidden="true" />
  </button>
);

// Form accessibility
const AccessibleForm = () => (
  <form aria-labelledby="form-title">
    <h2 id="form-title">Contact Form</h2>
    <label htmlFor="email">Email</label>
    <input
      id="email"
      type="email"
      aria-required="true"
      aria-describedby="email-error"
    />
    <span id="email-error" role="alert">
      {emailError}
    </span>
  </form>
);
```

---

### 3. React + TypeScript Best Practices (30 minutes)

#### TypeScript Patterns for React

```typescript
// 1. Component Props Typing
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size = 'md', 
  disabled = false,
  onClick,
  children 
}) => {
  return <button className={`btn-${variant} btn-${size}`}>{children}</button>;
};

// 2. Extending HTML Attributes
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...inputProps }) => (
  <div>
    <label>{label}</label>
    <input {...inputProps} />
    {error && <span className="error">{error}</span>}
  </div>
);

// 3. Generic Components
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getValue: (option: T) => string | number;
}

function Select<T>({ options, value, onChange, getLabel, getValue }: SelectProps<T>) {
  return (
    <select 
      value={getValue(value)} 
      onChange={(e) => {
        const selectedOption = options.find(
          opt => getValue(opt).toString() === e.target.value
        );
        if (selectedOption) onChange(selectedOption);
      }}
    >
      {options.map(option => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

// 4. Event Handler Types
const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  console.log(e.target.value);
};

const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
  e.preventDefault();
};

const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  console.log(e.currentTarget);
};

// 5. Refs with TypeScript
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);
```

---

### 4. Review Your giphy-search Code (30 minutes)

#### Analyze Your Own Code:

**Review Checklist:**
- [ ] Open `src/components/GiphySearch.tsx`
- [ ] Open `src/hooks/useAnimatedPlaceHolder.ts`
- [ ] Open `src/App.tsx`

**Questions to Ask Yourself:**

1. **Component Structure:**
   - Are components properly separated (presentation vs logic)?
   - Could any logic be extracted into custom hooks?
   - Are components reusable?

2. **TypeScript Usage:**
   - Are all props properly typed?
   - Are there any `any` types that should be more specific?
   - Are API response types defined?

3. **Performance:**
   - Are there any unnecessary re-renders?
   - Should any callbacks be wrapped in `useCallback`?
   - Should any calculations use `useMemo`?
   - Are images optimized/lazy loaded?

4. **Error Handling:**
   - How are API errors handled?
   - Is there user feedback for loading/error states?
   - Are edge cases covered?

5. **Accessibility:**
   - Are images using alt text?
   - Is keyboard navigation supported?
   - Are ARIA attributes used where needed?

**Improvements to Consider:**

```typescript
// Example: Improve your GiphySearch component

// Before (if applicable)
const GiphySearch = () => {
  const [gifs, setGifs] = useState([]);
  const [query, setQuery] = useState('');
  
  const handleSearch = () => {
    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(data => setGifs(data));
  };
  
  return <div>...</div>;
};

// After (Better pattern)
interface Gif {
  id: string;
  url: string;
  title: string;
}

const GiphySearch: React.FC = () => {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/search?q=${searchQuery}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setGifs(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setGifs([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);
  
  return (
    <div>
      <input 
        value={query} 
        onChange={handleChange}
        aria-label="Search GIFs"
        placeholder="Search..."
      />
      
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      
      <div className="gif-grid">
        {gifs.map(gif => (
          <GifCard key={gif.id} gif={gif} />
        ))}
      </div>
    </div>
  );
};
```

---

### 5. Interview Prep: React Questions (30 minutes)

#### Common React Interview Questions:

**Q1: "What's the difference between useCallback and useMemo?"**

**Your Answer:**
"Both are optimization hooks that memoize values, but they serve different purposes:

- **useMemo** memoizes the *result* of a computation. Use it for expensive calculations.
  ```typescript
  const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```

- **useCallback** memoizes the *function itself*. Use it to prevent child component re-renders.
  ```typescript
  const handleClick = useCallback(() => doSomething(a, b), [a, b]);
  ```

In my giphy-search project, I could use `useCallback` for the search handler to prevent re-creating it on every render, which would cause child components to re-render unnecessarily."

---

**Q2: "How do you handle performance issues in React?"**

**Your Answer:**
"I use several strategies:

1. **React DevTools Profiler** - Identify which components are re-rendering unnecessarily
2. **React.memo** - Prevent re-renders of components with unchanged props
3. **useCallback/useMemo** - Memoize functions and expensive calculations
4. **Code splitting** - Use React.lazy() and Suspense for route-based splitting
5. **Virtualization** - For long lists, use libraries like react-window
6. **Debouncing** - For search inputs or frequent API calls
7. **Image optimization** - Lazy loading, proper formats (WebP), responsive images

In production, I'd also monitor with tools like Lighthouse and Web Vitals to track Core Web Vitals (LCP, FID, CLS)."

---

**Q3: "Explain Context API vs Redux. When would you use each?"**

**Your Answer:**
"Context API and Redux both manage global state, but have different use cases:

**Context API:**
- Built into React, no extra dependencies
- Great for: theme, auth state, user preferences
- Best for infrequent updates
- Simpler to set up
- Can cause re-render issues if not structured properly

**Redux:**
- More boilerplate but more powerful
- Great for: complex state logic, time-travel debugging, large apps
- Better performance for frequent updates
- Middleware support (Redux Thunk, Saga)
- DevTools for debugging

**My approach:** Start with Context API for simple global state. If I need:
- Complex state updates across multiple components
- Time-travel debugging
- Middleware for async actions
- Better performance at scale

Then I'd migrate to Redux or consider alternatives like Zustand or Jotai.

For Baseline projects with Cognito auth, Context API would likely be sufficient for auth state."

---

**Q4: "How do you ensure your React code is production-ready?"**

**Your Answer:**
"I follow several practices:

**1. Code Quality:**
- TypeScript for type safety
- ESLint + Prettier for consistency
- Comprehensive unit tests (React Testing Library)
- E2E tests for critical flows (Cypress/Playwright)

**2. Performance:**
- Code splitting at route level
- Lazy loading for heavy components
- Image optimization
- Bundle size monitoring
- Lighthouse CI in pipeline

**3. Error Handling:**
- Error boundaries for graceful failures
- Proper error logging (Sentry, LogRocket)
- User-friendly error messages
- Loading states for all async operations

**4. Accessibility:**
- Semantic HTML
- ARIA attributes where needed
- Keyboard navigation
- Screen reader testing
- Color contrast checks

**5. Security:**
- Sanitize user inputs
- HTTPS only
- Secure auth tokens (httpOnly cookies)
- Content Security Policy
- Regular dependency updates

**6. Monitoring:**
- Performance monitoring (Web Vitals)
- Error tracking
- User analytics
- A/B testing capability

In my giphy-search project, I used TypeScript, proper error handling, and could improve it with Error Boundaries and better performance optimization."

---

## 📝 Key Takeaways to Memorize

### React Hooks
- [ ] Understand when to use each hook
- [ ] Know the difference between useCallback and useMemo
- [ ] Can explain useEffect cleanup functions
- [ ] Understand custom hook patterns

### Performance
- [ ] React.memo vs useMemo vs useCallback
- [ ] Code splitting strategies
- [ ] When to optimize (premature optimization is bad)
- [ ] How to measure performance

### TypeScript + React
- [ ] Proper prop typing (interfaces vs types)
- [ ] Generic component patterns
- [ ] Event handler types
- [ ] Ref typing

### Production Patterns
- [ ] Error boundaries
- [ ] Code organization
- [ ] Accessibility basics
- [ ] Testing strategies

---

## ✅ End of Day Checklist

- [ ] Reviewed all React hook patterns
- [ ] Understand performance optimization techniques
- [ ] Can explain Context API vs other state management
- [ ] Reviewed TypeScript + React patterns
- [ ] Analyzed your giphy-search code critically
- [ ] Prepared answers for common React questions
- [ ] Identified improvements for your project
- [ ] Feel confident discussing React architecture

**Self-Assessment:**
- [ ] Can I explain the difference between useCallback and useMemo? 🪝
- [ ] Do I know when to optimize performance? ⚡
- [ ] Can I write type-safe React components? 📘
- [ ] Do I understand production best practices? 🏭

---

## 🎓 Practice Exercises

### Exercise 1: Refactor Your Code
Pick one component from your giphy-search project and refactor it with:
- Better TypeScript types
- Performance optimization
- Error handling
- Accessibility improvements

### Exercise 2: Build a Custom Hook
Create a `useDebounce` hook from scratch:
```typescript
function useDebounce<T>(value: T, delay: number): T {
  // Implement this
}
```

### Exercise 3: Code Review
Review your entire project and create a list of:
- 3 things done well
- 3 things to improve
- 1 pattern to implement

---

## 📚 Additional Resources

### Must-Read Articles:
- [ ] [React Docs - Hooks](https://react.dev/reference/react)
- [ ] [Kent C. Dodds - Application State Management](https://kentcdodds.com/blog/application-state-management-with-react)
- [ ] [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Videos to Watch:
- [ ] React Performance Optimization (search YouTube)
- [ ] Advanced React Patterns (Epic React by Kent C. Dodds)

### Tools to Explore:
- [ ] React DevTools Profiler
- [ ] TypeScript Playground
- [ ] Bundle Analyzer (webpack-bundle-analyzer)

---

**Tomorrow (Day 3):** TypeScript deep dive - Advanced types, generics, and type-safe patterns for enterprise applications.

**Time Investment Today:** ~3 hours  
**Priority:** HIGH – React is your primary skill for this role
