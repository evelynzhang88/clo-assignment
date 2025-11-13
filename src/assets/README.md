# Assets Folder

This folder contains static assets for the application.

## Structure

- `images/` - Image files (PNG, JPG, SVG, etc.)

## Usage

### Importing Images in React Components

```typescript
// Example: Import an image
import logo from './assets/images/logo.png'

// Use in JSX
<img src={logo} alt="Logo" />
```

### Importing Images in CSS/SCSS

```scss
// Example: Use image as background
.background {
  background-image: url('./assets/images/background.jpg');
}
```

### Using Images with Vite

Vite automatically handles image imports and optimizes them. You can:

1. Import images directly in components
2. Use dynamic imports for code splitting
3. Reference images in CSS files

## File Types Supported

- PNG (.png)
- JPG/JPEG (.jpg, .jpeg)
- SVG (.svg)
- GIF (.gif)
- WebP (.webp)

