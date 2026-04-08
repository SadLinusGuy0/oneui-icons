# One UI Icons

A comprehensive collection of 973 One UI style icons as customizable React + TypeScript components.

[![npm version](https://img.shields.io/npm/v/@thatjoshguy/oneui-icons.svg)](https://www.npmjs.com/package/@thatjoshguy/oneui-icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✨ **973 Icons** - Complete One UI icon set  
⚛️ **React Components** - First-class React + TypeScript support  
🎨 **Customizable** - Easily change size and color via props  
🌲 **Tree-shakeable** - Only bundle the icons you use  
📦 **Zero Dependencies** - Only requires React as a peer dependency  
💪 **TypeScript** - Full type definitions included  

## Installation

```bash
npm install @thatjoshguy/oneui-icons
```

```bash
yarn add @thatjoshguy/oneui-icons
```

```bash
pnpm add @thatjoshguy/oneui-icons
```

## Usage

### Basic Usage

Import and use icons as React components:

```tsx
import { Warning, Wifi, Watch } from '@thatjoshguy/oneui-icons';

function App() {
  return (
    <div>
      <Warning />
      <Wifi />
      <Watch />
    </div>
  );
}
```

### Customizing Size

Control the icon size using the `size` prop (accepts numbers or strings):

```tsx
import { Warning } from '@thatjoshguy/oneui-icons';

function App() {
  return (
    <div>
      {/* Number (pixels) */}
      <Warning size={32} />
      
      {/* String with unit */}
      <Warning size="2rem" />
      
      {/* Default is 24 */}
      <Warning />
    </div>
  );
}
```

### Customizing Color

Change the icon color using the `color` prop:

```tsx
import { Warning } from '@thatjoshguy/oneui-icons';

function App() {
  return (
    <div>
      <Warning color="red" />
      <Warning color="#3b82f6" />
      <Warning color="currentColor" />
      
      {/* Default is 'white' */}
      <Warning />
    </div>
  );
}
```

### Adding CSS Classes

Use the `className` prop for additional styling:

```tsx
import { Warning } from '@thatjoshguy/oneui-icons';

function App() {
  return (
    <Warning className="my-custom-class" />
  );
}
```

### Advanced Usage

All standard SVG props are supported via spread:

```tsx
import { Warning } from '@thatjoshguy/oneui-icons';

function App() {
  return (
    <Warning
      size={48}
      color="red"
      className="icon"
      onClick={() => console.log('clicked')}
      style={{ cursor: 'pointer' }}
      aria-label="Warning icon"
    />
  );
}
```

## TypeScript

The package includes full TypeScript support. Import the `IconProps` type if needed:

```tsx
import { Warning, IconProps } from '@thatjoshguy/oneui-icons';
import { FC } from 'react';

const CustomComponent: FC<{ iconProps: IconProps }> = ({ iconProps }) => {
  return <Warning {...iconProps} />;
};
```

### IconProps Interface

```typescript
interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  size?: number | string;  // Default: 24
  color?: string;          // Default: 'white'
  className?: string;
}
```

## Available Icons

This package includes 973 icons from the OneUI design system. Here are some examples:

- `Warning`
- `Wifi`
- `Watch`
- `Video`
- `Upload`
- `Tablet`
- `Settings`
- `Search`
- `Notification`
- `Home`
- `Calendar`
- `Battery`
- `Accessibility`
- ...and 960 more!

For a complete list of all icons, see the [src/index.ts](src/index.ts) file or explore the [SVG directory](SVG/).

## Tree Shaking

This package is optimized for tree shaking. When using modern bundlers (Webpack 5+, Vite, Rollup, etc.), only the icons you import will be included in your final bundle:

```tsx
// ✅ Only Warning and Wifi will be bundled
import { Warning, Wifi } from '@thatjoshguy/oneui-icons';

// ❌ Avoid this - imports everything
import * as Icons from '@thatjoshguy/oneui-icons';
```

## Icon Naming Convention

Icon component names are converted from the original SVG filenames using PascalCase:

- `warning.svg` → `Warning`
- `wifi_video_call.svg` → `WifiVideoCall`
- `XR alt.svg` → `XrAlt`
- `360.svg` → `360`

## Browser Support

This package supports all modern browsers that support ES2020 and React 18+:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Generate React components from SVG files
npm run generate

# Build the package
npm run build

# Clean generated files
npm run clean
```

### Project Structure

```
oneui-icons/
├── SVG/              # Original SVG files (973 icons)
├── scripts/          # Build scripts
│   └── generate.js   # SVG to React converter
├── src/
│   ├── icons/        # Generated React components (gitignored)
│   ├── types.ts      # TypeScript type definitions
│   └── index.ts      # Main export file (auto-generated)
└── dist/             # Built package (gitignored)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © 2026

## Related Projects

- [React Icons](https://react-icons.github.io/react-icons/)
- [Heroicons](https://heroicons.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Note**: This package contains icons from the One UI design system. Please ensure you comply with any applicable licensing terms for the original icons.

This project is not affiliated with or endorsed by Samsung.