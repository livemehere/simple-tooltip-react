import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { TooltipContainer } from "./TooltipContainer";

export type ToolTipPosition = {
  top: number;
  left: number;
};

interface Props {
  content: ReactNode;
  dir?: "top" | "bottom" | "left" | "right";
  children: JSX.Element;
  margin?: number;
  trigger?: "hover" | "click";
  forceShow?: boolean;
  arrowSize?: number;
  color?: string;
  position?: ToolTipPosition;
  disabled?: boolean;
  onChangeFinalShow?: (show: boolean) => void;
}
export const ToolTip: FC<Props> = ({
  children,
  dir = "top",
  content,
  trigger = "hover",
  margin = 10,
  arrowSize = 5,
  color = "black",
  forceShow = false,
  position,
  disabled = false,
  onChangeFinalShow,
}) => {
  const [mount, setMount] = useState(false);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    arrowTop: 0,
    arrowLeft: 0,
    arrowRotate: 0,
  });

  const [rootElRef, setRootElRef] = useState<HTMLElement | null>(null);
  const [contentElRef, setContentElRef] = useState<HTMLDivElement | null>(null);
  const finalShow = !disabled && (show || forceShow);

  useEffect(() => {
    setMount(true);
  }, []);

  useEffect(() => {
    onChangeFinalShow?.(finalShow);
  }, [finalShow]);

  const rootElement = useMemo(
    () =>
      React.cloneElement(children, {
        ...children.props,
        ref: (el: any) => {
          setRootElRef(el);
        },
        onPointerEnter: (e: React.PointerEvent) => {
          if (trigger === "hover" && e.pointerType === "touch") return;
          if (trigger === "hover") setShow(true);
          if (children.props.onMouseEnter) children.props.onMouseEnter(e);
        },
        onPointerLeave: () => {
          if (trigger === "hover") setShow(false);
          if (children.props.onMouseLeave) children.props.onMouseLeave();
        },
        onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
          if (trigger === "click") setShow((prev) => !prev);
          if (children.props.onClick) children.props.onClick(e);
        },
      }),
    [children, trigger],
  );
  const calcPos = useCallback(() => {
    if (!rootElRef || !contentElRef) return;
    const rect = rootElRef.getBoundingClientRect();
    const contentRect = contentElRef.getBoundingClientRect();
    const isOverWindowInnerWidth = window.innerWidth <= contentRect.width;
    let adjustedDir = dir;
    if (
      dir === "bottom" &&
      rect.bottom + contentRect.height > window.innerHeight
    ) {
      adjustedDir = "top";
    }

    if (dir === "top" && rect.top - contentRect.height < 0) {
      adjustedDir = "bottom";
    }

    switch (adjustedDir) {
      case "top":
        setPos({
          top: rect.top - contentRect.height - margin,
          left: isOverWindowInnerWidth
            ? 0.01
            : Math.max(
                rect.left + rect.width / 2 - contentRect.width / 2,
                0.01,
              ),
          arrowLeft: rect.left + rect.width / 2,
          arrowTop: rect.top - margin,
          arrowRotate: 0,
        });
        break;
      case "bottom":
        setPos({
          top: rect.bottom + margin,
          left: isOverWindowInnerWidth
            ? 0.01
            : Math.min(
                rect.left + rect.width / 2 - contentRect.width / 2,
                window.innerWidth - contentRect.width - 0.01,
              ),
          arrowLeft: rect.left + rect.width / 2,
          arrowTop: rect.top + rect.height + margin - arrowSize * 2,
          arrowRotate: 180,
        });
        break;
      case "left":
        setPos({
          top: rect.top + rect.height / 2 - contentRect.height / 2,
          left: rect.left - contentRect.width - margin,
          arrowLeft: rect.left - margin + arrowSize,
          arrowTop: rect.top + rect.height / 2 - arrowSize,
          arrowRotate: -90,
        });
        break;
      case "right":
        setPos({
          top: rect.top + rect.height / 2 - contentRect.height / 2,
          left: rect.right + margin,
          arrowLeft: rect.left + rect.width + margin - arrowSize,
          arrowTop: rect.top + rect.height / 2 - arrowSize,
          arrowRotate: 90,
        });
        break;
    }
  }, [rootElRef, contentElRef, dir, margin, arrowSize]);

  useEffect(() => {
    calcPos();
  }, [calcPos]);

  useEffect(() => {
    if (trigger !== "click") return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        rootElRef?.contains(e.target as Node) ||
        contentElRef?.contains(e.target as Node)
      ) {
        return;
      }
      setShow(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contentElRef, rootElRef, trigger]);

  useEffect(() => {
    const handler = () => {
      setShow(false);
    };

    window.addEventListener("scroll", handler);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [calcPos]);

  if (!mount) return null;
  const isPosAvailable = pos.top !== 0 && pos.left !== 0;

  return (
    <>
      {rootElement}
      {finalShow &&
        createPortal(
          <TooltipContainer
            ref={(el) => {
              setContentElRef(el);
            }}
            color={color}
            top={pos.top}
            left={pos.left}
            arrowTop={pos.arrowTop}
            arrowLeft={pos.arrowLeft}
            arrowRotate={pos.arrowRotate}
            arrowSize={arrowSize}
            onUnmount={() => setContentElRef(null)}
            position={position}
            visibility={isPosAvailable ? "visible" : "hidden"}
          >
            {content}
          </TooltipContainer>,
          document.body,
        )}
    </>
  );
};
