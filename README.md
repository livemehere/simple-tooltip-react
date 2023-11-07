# simple-tooltip-react

[npm](https://www.npmjs.com/package/simple-tooltip-react?activeTab=readme)

This library is a simple ToolTip Component without any dependencies except React.   
Follow simple guide to use it.

## Features

- Support `hover` and `click` trigger.
- Support `top`, `bottom`, `left`, `right` direction.
- Support custom `margin` and `arrowSize`.
- Support custom `color` and `position`.
- Support `forceShow` to show tooltip without trigger.

### Advanced Usage

- Set Arrow size to 0 to hide arrow.
- Set color to `transparent` to hide background. Only depends on your content.

## Installation

```bash
npm install simple-tooltip-react

yarn add simple-tooltip-react
```

## Usage

```jsx
// That's it. You can use it anywhere.
<ToolTip content={<div style={{ color: "white" }}>tool</div>}>
    <div style={{ display: "inline-block", margin: "100px 100px" }}>A</div>
</ToolTip>
```

## Props

```tsx
interface Props {
    content: ReactNode;
    dir?: 'top' | 'bottom' | 'left' | 'right';
    children: JSX.Element;
    margin?: number;
    trigger?: 'hover' | 'click';
    forceShow?: boolean;
    arrowSize?: number;
    color?: string;
    position?: ToolTipPosition;
}
```