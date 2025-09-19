# Development Guide

## Getting Started

### Prerequisites

1. **Node.js**: Install the latest LTS version from [nodejs.org](https://nodejs.org/)
2. **Rust**: Install using [rustup](https://www.rust-lang.org/tools/install)
3. **Tauri CLI**: Install globally with `npm install -g @tauri-apps/cli`

### Initial Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jsonic
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Verify Tauri prerequisites:
   ```bash
   npx tauri info
   ```

### Running the Application

#### Development Mode

```bash
npm run tauri dev
```

This command will:
1. Start the frontend development server
2. Launch the Tauri application in development mode
3. Enable hot reloading for frontend changes

#### Production Build

```bash
npm run tauri build
```

This will create optimized binaries for your platform in `src-tauri/target/release`.

## Project Structure Explanation

### Backend (Rust/Tauri)

The `src-tauri` directory contains the Tauri backend:

- `src/main.rs`: Entry point and command registration
- `src/commands.rs`: Tauri commands exposed to frontend
- `src/file_handler.rs`: File system operations
- `src/json_comments.rs`: JSON comment handling
- `Cargo.toml`: Rust dependencies
- `tauri.conf.json`: Tauri configuration

### Frontend (React/TypeScript)

The `src` directory contains the frontend:

- `main.tsx`: Application entry point
- `App.tsx`: Main application component
- `components/`: React components
- `utils/`: Utility functions
- `types/`: TypeScript type definitions
- `styles/`: CSS stylesheets

## Development Workflow

### Adding New Features

1. **Define the feature requirements**
2. **Create necessary types** in `src/types/`
3. **Implement utility functions** in `src/utils/`
4. **Create or modify components** in `src/components/`
5. **Add Tauri commands** if backend integration is needed
6. **Test the feature**
7. **Update documentation**

### Component Development

1. Create a new component file in `src/components/`
2. Define the component's props interface
3. Implement the component logic
4. Add appropriate styling
5. Export the component

Example component structure:
```typescript
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  // Define props here
}

const MyComponent: React.FC<MyComponentProps> = ({ /* props */ }) => {
  return (
    <div className="my-component">
      {/* Component implementation */}
    </div>
  );
};

export default MyComponent;
```

### State Management

The application uses React's built-in state management:

- `useState` for local component state
- `useContext` for global state (if needed)
- Custom hooks for complex state logic

For complex state management, consider using Zustand or Redux.

### Styling

CSS classes follow BEM methodology:
- Block: `.component-name`
- Element: `.component-name__element`
- Modifier: `.component-name--modifier`

Example:
```css
.button { /* Block */ }
.button__icon { /* Element */ }
.button--primary { /* Modifier */ }
```

## Tauri Integration

### Adding New Commands

1. Add the command function in `src-tauri/src/commands.rs`
2. Register it in `src-tauri/src/main.rs`
3. Import and use it in the frontend:

```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Usage
const result = await invoke('my_command', { argument: value });
```

### File System Access

Use Tauri's file system APIs:
```typescript
import { readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { open, save } from '@tauri-apps/api/dialog';
```

## Testing

### Unit Testing

Use Jest for unit tests:
```bash
npm test
```

Create test files with `.test.ts` extension:
```typescript
// src/utils/myUtil.test.ts
import { myFunction } from './myUtil';

describe('myFunction', () => {
  test('should return expected result', () => {
    expect(myFunction(input)).toEqual(expected);
  });
});
```

### Integration Testing

Test the interaction between components and backend:
1. Mock Tauri commands
2. Test component behavior with mocked data
3. Verify state changes and side effects

## Debugging

### Frontend Debugging

1. Use browser developer tools when running in dev mode
2. Add `console.log` statements for debugging
3. Use React DevTools for component inspection
4. Check the Network tab for API calls

### Backend Debugging

1. Check Tauri logs in the terminal
2. Add `println!` statements in Rust code
3. Use `dbg!` macro for debugging values
4. Check for panic messages

### Common Issues

1. **Build errors**: Ensure all dependencies are installed
2. **Runtime errors**: Check browser console and Tauri logs
3. **Performance issues**: Use React Profiler and performance marks
4. **Type errors**: Ensure TypeScript types match expected data

## Code Quality

### Linting

The project uses ESLint and Prettier:
```bash
npm run lint
npm run lint:fix
```

### Code Style

Follow these guidelines:
1. Use TypeScript for type safety
2. Write descriptive variable and function names
3. Keep functions small and focused
4. Use comments for complex logic
5. Follow existing code patterns

### Git Workflow

1. Create feature branches from `main`
2. Write descriptive commit messages
3. Squash related commits before merging
4. Create pull requests for code review
5. Delete branches after merging

## Performance Optimization

### React Performance

1. Use `React.memo` for expensive components
2. Implement `useCallback` and `useMemo` appropriately
3. Avoid unnecessary re-renders
4. Use virtualization for large lists

### Memory Management

1. Clean up event listeners
2. Cancel ongoing requests on component unmount
3. Use weak references where appropriate
4. Monitor memory usage during development

## Security Considerations

1. **File Access**: Only access user-selected files
2. **Input Validation**: Validate all user inputs
3. **Dependency Updates**: Regularly update dependencies
4. **CSP**: Configure Content Security Policy appropriately

## Deployment

### Versioning

Follow semantic versioning:
- MAJOR version for incompatible changes
- MINOR version for backward-compatible features
- PATCH version for backward-compatible bug fixes

### Release Process

1. Update version in `package.json` and `src-tauri/Cargo.toml`
2. Update `CHANGELOG.md`
3. Create a git tag
4. Build for all platforms
5. Create GitHub release
6. Publish binaries

## Troubleshooting

### Common Build Issues

1. **Missing dependencies**: Run `npm install` and ensure Rust toolchain is up to date
2. **Permission errors**: Ensure proper file permissions
3. **Platform-specific issues**: Check platform requirements in Tauri docs

### Runtime Issues

1. **Blank screen**: Check browser console for errors
2. **Missing features**: Verify Tauri allowlist configuration
3. **Performance problems**: Profile and optimize hot paths

### Development Environment

1. **Slow hot reload**: Check for unnecessary re-renders
2. **Memory leaks**: Monitor memory usage over time
3. **IDE issues**: Ensure proper TypeScript and ESLint configuration

## Contributing Guidelines

1. Follow the code style and conventions
2. Write tests for new functionality
3. Update documentation when making changes
4. Create issues for bugs and feature requests
5. Follow the Git workflow
6. Be respectful in code reviews

This guide should help you get started with development. For specific questions about implementation details, refer to the component and utility files, or create an issue for discussion.