import { forwardRef, ReactNode, useEffect } from "react";
import { ToolTipPosition } from "./ToolTip.tsx";

interface Props {
  children: ReactNode;
  color?: string;
  top: number;
  left: number;
  arrowTop: number;
  arrowLeft: number;
  arrowRotate: number;
  onUnmount: () => void;
  arrowSize: number;
  position?: ToolTipPosition;
  visibility?: "visible" | "hidden";
}

export const TooltipContainer = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const {
      children,
      color,
      top,
      left,
      arrowTop,
      arrowLeft,
      arrowRotate,
      arrowSize,
      onUnmount,
      position,
      visibility,
    } = props;

    useEffect(() => {
      return () => {
        onUnmount();
      };
    }, []);

    return (
      <div
        ref={ref}
        className="tooltip-container"
        style={{
          position: "fixed",
          top: `${top + (position?.top || 0)}px`,
          left: `${left + (position?.left || 0)}px`,
          zIndex: 999,
          display: "inline-block",
          background: color,
          visibility,
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "fixed",
            zIndex: 998,
            top: `${arrowTop + (position?.top || 0)}px`,
            left: `${arrowLeft + (position?.left || 0)}px`,
            transform: `rotate(${arrowRotate}deg)`,
            transformOrigin: "center center",
            marginLeft: `${-arrowSize}px`,
            borderWidth: `${arrowSize}px`,
            borderStyle: "solid",
            borderColor: `${color} transparent transparent transparent`,
          }}
        />
        {children}
      </div>
    );
  },
);

TooltipContainer.displayName = "TooltipContainer";
