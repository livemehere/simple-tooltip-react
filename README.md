# simple-tooltip-react

[npm](https://www.npmjs.com/package/simple-tooltip-react?activeTab=readme)

This library is a simple ToolTip Component without any dependencies except React.   
Follow simple guide to use it.

[Documentation - livemehere-dev-packs](https://livemehere.github.io/livemehere-dev-packs/docs/category/simple-tooltip-react)

## Features

- Support `hover` and `click` trigger.
- Support `top`, `bottom`, `left`, `right` direction.
- Customize `margin` and `position` to adjust tooltip position.
- Support custom `color` and `arrowSize`.
- Support `forceShow` to show tooltip without trigger.
- `disabled` props to disable tooltip.
- `onChangeFinalShow` to listen final show state change.

### Tips

- Set Arrow size to 0 to hide arrow.
- Set color to `transparent` to hide background. Only depends on your content.

## Installation

```bash
npm install simple-tooltip-react

yarn add simple-tooltip-react
```

## Example

```jsx
// That's it. You can use it anywhere.
<ToolTip content={<div>tool</div>}>
    <div style={{ display: "inline-block", margin: "100px 100px" }}>A</div>
</ToolTip>
```

## API

```tsx
export type ToolTipPosition = {
    top: number;
    left: number;
};

interface Props {
    content: ReactNode;
    dir?: "top" | "bottom" | "left" | "right"; // default: top
    children: JSX.Element;
    margin?: number;
    trigger?: "hover" | "click"; // default: hover
    forceShow?: boolean;
    arrowSize?: number;
    color?: string; // default: black
    position?: ToolTipPosition;
    disabled?: boolean;
    onChangeFinalShow?: (show: boolean) => void;
}
```