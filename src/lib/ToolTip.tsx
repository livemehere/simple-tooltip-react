import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
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
}) => {
  const [mount, setMount] = useState(false);
  const [show, setShow] = useState(false);
  const [contentRendered, setContentRendered] = useState(false);
  const [rootRendered, setRootRendered] = useState(false);
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    arrowTop: 0,
    arrowLeft: 0,
    arrowRotate: 0,
  });

  const rootRef = React.useRef<HTMLDivElement>();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const rootElement = React.cloneElement(children, {
    ...children.props,
    ref: (el: any) => {
      if (!el || !rootRef) return;
      rootRef.current = el;
      setRootRendered(true);
    },
    onMouseEnter: () => trigger === "hover" && setShow(true),
    onMouseLeave: () => trigger === "hover" && setShow(false),
    onClick: () => trigger === "click" && setShow(true),
  });

  const calcPos = useCallback(() => {
    if (!contentRendered || !rootRendered) return;
    const rect = rootRef.current?.getBoundingClientRect();
    const contentRect = contentRef.current?.getBoundingClientRect()!;

    if (rect && contentRect) {
      const maxLeft = window.innerWidth - contentRect.width;

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
            left: Math.min(
              rect.left + rect.width / 2 - contentRect.width / 2,
              maxLeft,
            ),
            arrowLeft: rect.left + rect.width / 2,
            arrowTop: rect.top - margin,
            arrowRotate: 0,
          });
          break;
        case "bottom":
          setPos({
            top: rect.bottom + margin,
            left: Math.min(
              rect.left + rect.width / 2 - contentRect.width / 2,
              maxLeft,
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
    }
  }, [contentRendered, rootRendered, dir, margin, arrowSize]);

  useEffect(() => {
    calcPos();
  }, [calcPos]);

  useEffect(() => {
    if (trigger !== "click") return;

    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setShow(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [trigger]);

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

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;
  return (
    <>
      {rootElement}
      {(show || forceShow) &&
        createPortal(
          <TooltipContainer
            ref={contentRef}
            color={color}
            top={pos.top}
            left={pos.left}
            arrowTop={pos.arrowTop}
            arrowLeft={pos.arrowLeft}
            arrowRotate={pos.arrowRotate}
            arrowSize={arrowSize}
            onRendered={() => setContentRendered(true)}
            onUnmount={() => setContentRendered(false)}
            position={position}
          >
            {content}
          </TooltipContainer>,
          document.body,
        )}
    </>
  );
};
