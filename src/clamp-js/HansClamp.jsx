import { useEffect, useRef } from 'react';
import { clamp } from 'clamp-js-main';

export default function HansClamp({ text, lines, className = '' }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      clamp(textRef.current, { clamp: lines });
    }
  }, [text, lines]);

  return (
    <div ref={textRef} className={className}>
      {text}
    </div>
  );
}
