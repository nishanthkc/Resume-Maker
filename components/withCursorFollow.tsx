import type { ComponentType } from "react";
import { useRef, useState, useEffect } from "react";

export function withCursorFollow(Component: ComponentType): ComponentType {
  return (props: any) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [position, setPosition] = useState({ left: 0, top: 0 });

    useEffect(() => {
      if (typeof window === 'undefined') return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return;

        const parentElement = ref.current.parentElement;
        if (!parentElement) return;

        const parentRect = parentElement.getBoundingClientRect();
        if (!parentRect || parentRect.width === 0 || parentRect.height === 0) return;

        const elementRect = ref.current.getBoundingClientRect();
        if (!elementRect || elementRect.width === 0 || elementRect.height === 0) return;

        const left = e.clientX - parentRect.left - elementRect.width / 2;
        const top = e.clientY - parentRect.top - elementRect.height / 2;

        // Ensure the element stays within the viewport
        const maxX = Math.max(0, parentRect.width - elementRect.width);
        const maxY = Math.max(0, parentRect.height - elementRect.height);

        const clampedLeft = Math.min(Math.max(left, 0), maxX);
        const clampedTop = Math.min(Math.max(top, 0), maxY);

        setPosition({
          left: clampedLeft,
          top: clampedTop,
        });

        const isHovered =
          clampedLeft >= 0 && clampedTop >= 0 && clampedLeft <= maxX && clampedTop <= maxY;

        setIsHovering(isHovered);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          left: `${position.left}px`,
          top: `${position.top}px`,
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
        }}
      >
        {isHovering && <Component {...props} />}
      </div>
    );
  };
}

