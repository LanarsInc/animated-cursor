import { useState, useEffect, useRef } from 'react';
import './AnimatedCursor.css';

const AnimatedCursor = () => {
  const cursorDot = useRef<null | HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  const cursorVisible = useRef(false);
  const cursorEnlarged = useRef(false);

  const onMouseMove = (event: MouseEvent) => {
    const { pageX: x, pageY: y } = event;
    setMousePosition({ x, y });
    positionDot(event);
  };

  const onMouseLeave = () => {
    cursorVisible.current = false;
    toggleCursorVisibility();
  };

  const onResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);
    requestRef.current = requestAnimationFrame(animateDot);

    handleLinkHovers();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  let { x, y } = mousePosition;
  const winDimensions = { width, height };
  let endX = winDimensions.width / 2;
  let endY = winDimensions.height / 2;

  const positionDot = (e: MouseEvent) => {
    if (!cursorEnlarged.current) {
      cursorVisible.current = true;
      toggleCursorVisibility();
      endX = e.pageX;
      endY = e.pageY;

      cursorDot.current!.style.top = endY + 'px';
      cursorDot.current!.style.left = endX + 'px';
    }
  };

  const animateDot = (time: number) => {
    if (previousTimeRef.current !== undefined && !cursorEnlarged.current) {
      x += (endX - x) / 2;
      y += (endY - y) / 2;
      cursorDot.current!.style.top = y + 6 + 'px';
      cursorDot.current!.style.left = x + 6 + 'px';
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateDot);
  };

  const toggleCursorVisibility = () => {
    if (cursorVisible.current) {
      cursorDot.current!.style.opacity = '1';
    } else {
      cursorDot.current!.style.opacity = '0';
      cursorDot.current!.classList.remove('active');
    }
  };

  const toggleCursorSize = (el: HTMLButtonElement | Element) => {
    if (cursorEnlarged.current && el) {
      const { width, height, top, left } = el!.getBoundingClientRect();
      cursorDot.current!.className = 'active';
      cursorDot.current!.style.top = top + height / 2 + 'px';
      cursorDot.current!.style.left = left + width / 2 + 'px';
    } else {
      cursorDot.current!.classList.remove('active');
      cursorDot.current!.style.top = '0px';
      cursorDot.current!.style.left = '0px';
    }
  };

  const handleLinkHovers = () => {
    document.querySelectorAll('.btn').forEach((el) => {
      el.addEventListener('mousemove', () => {
        cursorEnlarged.current = true;
        toggleCursorSize(el);
      });
      el.addEventListener('mouseleave', () => {
        cursorEnlarged.current = false;
        toggleCursorSize(el);
      });
      el.addEventListener('click', () => {
        cursorDot.current!.classList.toggle('active-click');
        setTimeout(() => {
          cursorDot.current!.classList.toggle('active-click');
        }, 500);
      });
    });
  };

  return <div ref={cursorDot} id="cursor-dot" />;
};

export default AnimatedCursor;
