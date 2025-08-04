import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InterviewQuestion {
  id: number;
  category: string;
  question: string;
  answer: string;
  codeExample?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

@Component({
  selector: 'app-interview-prep',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interview-prep.component.html',
  styleUrls: ['./interview-prep.component.scss']
})
export class InterviewPrepComponent implements OnInit {
  selectedCategory = signal<string>('all');
  selectedDifficulty = signal<string>('all');
  searchTerm = signal<string>('');
  expandedQuestion = signal<number | null>(null);

  // All interview questions
  allQuestions: InterviewQuestion[] = [
    // Fundamentals
    {
      id: 1,
      category: 'Fundamentals',
      question: 'What are Angular Signals and how do they differ from RxJS Observables?',
      answer: `Angular Signals are a new reactive primitive introduced in Angular 16+ that provides a simpler, more direct way to handle reactive state. Key differences:

**Signals:**
- Synchronous by nature
- Always have a current value
- Automatically track dependencies
- Fine-grained reactivity
- Built-in to Angular's change detection
- Simpler mental model

**RxJS Observables:**
- Asynchronous streams
- May not have a current value
- Require manual subscription management
- Coarse-grained reactivity
- External library
- More complex but more powerful for async operations`,
      codeExample: `// Signal example
const count = signal(0);
const doubleCount = computed(() => count() * 2);

// RxJS example
const count$ = new BehaviorSubject(0);
const doubleCount$ = count$.pipe(map(x => x * 2));`,
      difficulty: 'Beginner',
      tags: ['signals', 'rxjs', 'fundamentals', 'reactivity']
    },
    {
      id: 2,
      category: 'Fundamentals',
      question: 'When would you choose Signals over RxJS Observables?',
      answer: `Choose Signals when:
- Managing simple local component state
- Need synchronous reactive updates
- Want automatic change detection optimization
- Dealing with derived state calculations
- Building reactive forms with immediate validation
- Working with static data transformations

Choose RxJS when:
- Handling asynchronous operations (HTTP, WebSocket, timers)
- Complex stream transformations and compositions
- Need backpressure handling
- Working with event streams
- Require operators like debounce, throttle, retry
- Building reactive data pipelines`,
      codeExample: `// Use Signals for local state
const userForm = signal({ name: '', email: '' });
const isValid = computed(() => 
  userForm().name.length > 0 && userForm().email.includes('@')
);

// Use RxJS for async operations
const searchResults$ = searchInput$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.searchService.search(term))
);`,
      difficulty: 'Intermediate',
      tags: ['signals', 'rxjs', 'decision-making', 'architecture']
    },
    {
      id: 3,
      category: 'Migration',
      question: 'How do you migrate from RxJS BehaviorSubject to Angular Signals?',
      answer: `Migration steps:

1. **Replace BehaviorSubject with signal():**
   - Convert the initial value
   - Remove subscribe() calls
   - Update methods to use set() or update()

2. **Replace derived observables with computed():**
   - Convert pipe() chains to computed() functions
   - Remove manual subscription management

3. **Update template bindings:**
   - Remove async pipe
   - Call signal functions directly

4. **Handle side effects:**
   - Use effect() for side effects instead of subscribe()`,
      codeExample: `// Before (RxJS)
export class UserService {
  private user$ = new BehaviorSubject<User | null>(null);
  private isLoggedIn$ = this.user$.pipe(map(user => !!user));
  
  setUser(user: User) {
    this.user$.next(user);
  }
  
  getUser() {
    return this.user$.asObservable();
  }
}

// After (Signals)
export class UserService {
  private user = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.user());
  
  setUser(user: User) {
    this.user.set(user);
  }
  
  getUser() {
    return this.user.asReadonly();
  }
}`,
      difficulty: 'Intermediate',
      tags: ['migration', 'behaviorsubject', 'signals', 'refactoring']
    },
    {
      id: 4,
      category: 'State Management',
      question: 'How do Signals improve state management compared to traditional approaches?',
      answer: `Signals improve state management through:

**1. Automatic Dependency Tracking:**
- No manual subscription management
- Automatic cleanup of dependencies
- Fine-grained updates only to affected parts

**2. Synchronous Nature:**
- Immediate state updates
- No async pipe needed in templates
- Predictable execution order

**3. Performance Benefits:**
- OnPush change detection by default
- Minimal re-rendering
- Better tree-shaking
- Less memory overhead

**4. Developer Experience:**
- Simpler mental model
- Less boilerplate code
- Type safety out of the box
- Better debugging experience`,
      codeExample: `// Traditional approach
export class TodoService {
  private todos$ = new BehaviorSubject<Todo[]>([]);
  private filter$ = new BehaviorSubject<'all' | 'completed' | 'active'>('all');
  
  filteredTodos$ = combineLatest([this.todos$, this.filter$]).pipe(
    map(([todos, filter]) => {
      switch(filter) {
        case 'completed': return todos.filter(t => t.completed);
        case 'active': return todos.filter(t => !t.completed);
        default: return todos;
      }
    })
  );
}

// Signals approach
export class TodoService {
  private todos = signal<Todo[]>([]);
  private filter = signal<'all' | 'completed' | 'active'>('all');
  
  filteredTodos = computed(() => {
    const todos = this.todos();
    const filter = this.filter();
    switch(filter) {
      case 'completed': return todos.filter(t => t.completed);
      case 'active': return todos.filter(t => !t.completed);
      default: return todos;
    }
  });
}`,
      difficulty: 'Advanced',
      tags: ['state-management', 'performance', 'signals', 'architecture']
    },
    {
      id: 5,
      category: 'Performance',
      question: 'What are the performance benefits of using Signals over RxJS for state management?',
      answer: `**Memory Efficiency:**
- Signals have lower memory overhead
- No subscription objects to track
- Automatic cleanup eliminates memory leaks
- Better garbage collection

**Change Detection:**
- OnPush optimization by default
- Only affected components re-render
- Fine-grained reactivity
- Reduced change detection cycles

**Bundle Size:**
- Signals are built into Angular framework
- No additional RxJS operators needed for simple cases
- Better tree-shaking opportunities
- Smaller production bundles

**Runtime Performance:**
- Synchronous updates are faster
- No scheduler overhead
- Direct property access
- Optimized dependency tracking`,
      codeExample: `// Performance comparison from our project
interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  requestCount: number;
}

// Signals approach (faster)
const metrics = signal<PerformanceMetrics>({
  responseTime: 138,
  memoryUsage: 33,
  cpuUsage: 20,
  requestCount: 1628
});

// RxJS approach (slower for simple state)
const metrics$ = new BehaviorSubject<PerformanceMetrics>({
  responseTime: 193,
  memoryUsage: 53,
  cpuUsage: 36,
  requestCount: 1103
});`,
      difficulty: 'Intermediate',
      tags: ['performance', 'memory', 'change-detection', 'optimization']
    },
    {
      id: 6,
      category: 'Advanced',
      question: 'How do you handle complex async operations when using Signals?',
      answer: `For complex async operations with Signals, you have several strategies:

**1. Hybrid Approach:**
Use RxJS for async operations, convert to signals for state

**2. Resource API (Angular 17+):**
Use the new resource() function for async data fetching

**3. Custom Signal Wrappers:**
Create utility functions that wrap async operations

**4. Effect for Side Effects:**
Use effect() to react to signal changes and trigger async operations`,
      codeExample: `// Hybrid approach
export class DataService {
  private data = signal<Data[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);
  
  // Use RxJS for HTTP, signals for state
  async loadData() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const data = await this.http.get<Data[]>('/api/data').toPromise();
      this.data.set(data);
    } catch (error) {
      this.error.set(error.message);
    } finally {
      this.loading.set(false);
    }
  }
  
  // Resource API (Angular 17+)
  dataResource = resource({
    request: () => ({ refresh: this.refreshTrigger() }),
    loader: ({ request }) => this.http.get<Data[]>('/api/data')
  });
}

// Effect for reactive async operations
export class SearchComponent {
  searchTerm = signal('');
  results = signal<SearchResult[]>([]);
  
  constructor() {
    effect(() => {
      const term = this.searchTerm();
      if (term.length > 2) {
        this.performSearch(term);
      }
    });
  }
  
  private async performSearch(term: string) {
    const results = await this.searchService.search(term);
    this.results.set(results);
  }
}`,
      difficulty: 'Advanced',
      tags: ['async', 'hybrid', 'effect', 'resource-api']
    },
    {
      id: 7,
      category: 'Best Practices',
      question: 'What are the best practices for using Signals in Angular applications?',
      answer: `**1. Signal Naming Conventions:**
- Use descriptive names without $-suffix
- Computed signals should describe what they compute
- Boolean signals can use is/has/can prefixes

**2. State Organization:**
- Keep signals close to where they're used
- Use readonly() for external consumers
- Group related signals in services

**3. Performance Optimization:**
- Use computed() for derived state
- Avoid complex computations in templates
- Batch updates when possible

**4. Testing:**
- Signals are easier to test than observables
- Use TestBed.runInInjectionContext() for testing
- Mock signal dependencies properly

**5. Migration Strategy:**
- Start with leaf components
- Convert simple state first
- Keep async operations in RxJS initially`,
      codeExample: `// Good practices
export class UserProfileService {
  // Private writeable signals
  private _user = signal<User | null>(null);
  private _loading = signal(false);
  
  // Public readonly signals
  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  
  // Computed signals for derived state
  readonly isLoggedIn = computed(() => !!this._user());
  readonly displayName = computed(() => {
    const user = this._user();
    return user ? \`\${user.firstName} \${user.lastName}\` : 'Guest';
  });
  
  // Methods to update state
  setUser(user: User) {
    this._user.set(user);
  }
  
  updateUser(updates: Partial<User>) {
    this._user.update(current => ({ ...current, ...updates }));
  }
}

// Testing signals
describe('UserProfileService', () => {
  it('should compute display name correctly', () => {
    TestBed.runInInjectionContext(() => {
      const service = new UserProfileService();
      service.setUser({ firstName: 'John', lastName: 'Doe' });
      expect(service.displayName()).toBe('John Doe');
    });
  });
});`,
      difficulty: 'Intermediate',
      tags: ['best-practices', 'naming', 'testing', 'organization']
    },
    {
      id: 8,
      category: 'Forms',
      question: 'How do you implement reactive forms using Signals instead of RxJS?',
      answer: `Signals can greatly simplify reactive forms by providing immediate validation and state management:

**Benefits:**
- Immediate validation feedback
- Simplified form state management
- Better performance with fine-grained updates
- Easier to test and debug

**Implementation Strategy:**
- Use signals for form field values
- Computed signals for validation
- Effect for form submission side effects`,
      codeExample: `// Signal-based reactive form
export class SignalFormComponent {
  // Form field signals
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  
  // Validation computed signals
  emailValid = computed(() => {
    const email = this.email();
    return email.length > 0 && email.includes('@') && email.includes('.');
  });
  
  passwordValid = computed(() => {
    return this.password().length >= 8;
  });
  
  passwordsMatch = computed(() => {
    return this.password() === this.confirmPassword();
  });
  
  formValid = computed(() => {
    return this.emailValid() && this.passwordValid() && this.passwordsMatch();
  });
  
  // Form state
  submitting = signal(false);
  submitError = signal<string | null>(null);
  
  // Form submission
  async onSubmit() {
    if (!this.formValid()) return;
    
    this.submitting.set(true);
    this.submitError.set(null);
    
    try {
      await this.authService.register({
        email: this.email(),
        password: this.password()
      });
      // Handle success
    } catch (error) {
      this.submitError.set(error.message);
    } finally {
      this.submitting.set(false);
    }
  }
  
  // Real-time validation effects
  constructor() {
    effect(() => {
      if (this.email() && !this.emailValid()) {
        console.log('Invalid email format');
      }
    });
  }
}

// Template usage
/*
<form (ngSubmit)="onSubmit()">
  <input 
    type="email" 
    [value]="email()" 
    (input)="email.set($event.target.value)"
    [class.invalid]="email() && !emailValid()">
  
  <div *ngIf="email() && !emailValid()" class="error">
    Please enter a valid email address
  </div>
  
  <button 
    type="submit" 
    [disabled]="!formValid() || submitting()">
    {{ submitting() ? 'Submitting...' : 'Submit' }}
  </button>
</form>
*/`,
      difficulty: 'Intermediate',
      tags: ['forms', 'validation', 'reactive-forms', 'signals']
    },
    {
      id: 9,
      category: 'Architecture',
      question: 'How do you architect a large application using Signals for state management?',
      answer: `**Layered Architecture with Signals:**

**1. Service Layer:**
- Use signals for application state
- Provide readonly access to components
- Implement business logic in signal updates

**2. Component Layer:**
- Local signals for component state
- Computed signals for derived data
- Effects for side effects

**3. Global State:**
- Centralized store services
- Feature-specific state modules
- Cross-cutting concerns (auth, theme, etc.)

**4. Communication:**
- Signal inputs/outputs for parent-child
- Services for sibling communication
- Event bus for complex scenarios`,
      codeExample: `// Global state architecture
@Injectable({ providedIn: 'root' })
export class AppStateService {
  // Core app state
  private _user = signal<User | null>(null);
  private _theme = signal<'light' | 'dark'>('light');
  private _notifications = signal<Notification[]>([]);
  
  // Public readonly access
  readonly user = this._user.asReadonly();
  readonly theme = this._theme.asReadonly();
  readonly notifications = this._notifications.asReadonly();
  
  // Computed state
  readonly isAuthenticated = computed(() => !!this._user());
  readonly unreadCount = computed(() => 
    this._notifications().filter(n => !n.read).length
  );
}

// Feature-specific state
@Injectable()
export class TodoStateService {
  private _todos = signal<Todo[]>([]);
  private _filter = signal<TodoFilter>('all');
  
  readonly todos = this._todos.asReadonly();
  readonly filter = this._filter.asReadonly();
  
  readonly filteredTodos = computed(() => {
    const todos = this._todos();
    const filter = this._filter();
    return this.applyFilter(todos, filter);
  });
  
  readonly stats = computed(() => ({
    total: this._todos().length,
    completed: this._todos().filter(t => t.completed).length,
    active: this._todos().filter(t => !t.completed).length
  }));
}

// Component integration
@Component({
  selector: 'app-todo-list',
  template: \`
    <div>
      <h2>Todos ({{ todoService.stats().active }} active)</h2>
      <todo-item 
        *ngFor="let todo of todoService.filteredTodos()" 
        [todo]="todo">
      </todo-item>
    </div>
  \`
})
export class TodoListComponent {
  constructor(public todoService: TodoStateService) {}
}`,
      difficulty: 'Advanced',
      tags: ['architecture', 'state-management', 'services', 'scalability']
    },
    {
      id: 10,
      category: 'Debugging',
      question: 'How do you debug and trace Signal updates in complex applications?',
      answer: `**Debugging Strategies for Signals:**

**1. Development Tools:**
- Angular DevTools support for signals
- Console logging in computed signals
- Effect debugging with cleanup functions

**2. Custom Debugging Utilities:**
- Signal watchers for monitoring changes
- Debug wrappers for computed signals
- Logging middleware for signal updates

**3. Testing Strategies:**
- Unit test signal updates
- Integration test computed dependencies
- Mock signal dependencies`,
      codeExample: `// Debug utilities
function debugSignal<T>(name: string, signal: Signal<T>): Signal<T> {
  return computed(() => {
    const value = signal();
    console.log(\`[DEBUG] \${name}:\`, value);
    return value;
  });
}

function logSignalChanges<T>(name: string, signal: WritableSignal<T>) {
  effect(() => {
    const value = signal();
    console.log(\`[CHANGE] \${name} changed to:\`, value);
  });
  return signal;
}

// Usage
export class DebuggableService {
  private _count = logSignalChanges('count', signal(0));
  readonly count = this._count.asReadonly();
  
  readonly doubleCount = debugSignal('doubleCount', 
    computed(() => this._count() * 2)
  );
  
  increment() {
    this._count.update(c => c + 1);
  }
}

// Testing computed signals
describe('Signal Dependencies', () => {
  it('should update computed when dependency changes', () => {
    TestBed.runInInjectionContext(() => {
      const base = signal(10);
      const computed = computed(() => base() * 2);
      
      expect(computed()).toBe(20);
      
      base.set(15);
      expect(computed()).toBe(30);
    });
  });
});

// Effect debugging
effect((onCleanup) => {
  const value = someSignal();
  console.log('Effect triggered with:', value);
  
  onCleanup(() => {
    console.log('Effect cleanup for value:', value);
  });
});`,
      difficulty: 'Advanced',
      tags: ['debugging', 'testing', 'devtools', 'monitoring']
    }
  ];

  // Computed properties for filtering
  categories = computed(() => {
    const unique = [...new Set(this.allQuestions.map(q => q.category))];
    return ['all', ...unique];
  });

  difficulties = computed(() => {
    const unique = [...new Set(this.allQuestions.map(q => q.difficulty))];
    return ['all', ...unique];
  });

  filteredQuestions = computed(() => {
    let questions = this.allQuestions;
    
    // Filter by category
    const category = this.selectedCategory();
    if (category !== 'all') {
      questions = questions.filter(q => q.category === category);
    }
    
    // Filter by difficulty
    const difficulty = this.selectedDifficulty();
    if (difficulty !== 'all') {
      questions = questions.filter(q => q.difficulty === difficulty);
    }
    
    // Filter by search term
    const search = this.searchTerm().toLowerCase();
    if (search) {
      questions = questions.filter(q => 
        q.question.toLowerCase().includes(search) ||
        q.answer.toLowerCase().includes(search) ||
        q.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    return questions;
  });

  ngOnInit(): void {
    // Any initialization logic
  }

  toggleQuestion(questionId: number): void {
    this.expandedQuestion.set(
      this.expandedQuestion() === questionId ? null : questionId
    );
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  setDifficulty(difficulty: string): void {
    this.selectedDifficulty.set(difficulty);
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#757575';
    }
  }

  trackByQuestionId(index: number, question: InterviewQuestion): number {
    return question.id;
  }

  formatAnswer(answer: string): string {
    // Convert markdown-like formatting to HTML
    return answer
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
}
