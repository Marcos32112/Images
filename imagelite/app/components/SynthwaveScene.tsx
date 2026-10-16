'use client';

import { useEffect, useRef } from 'react';

export function SynthwaveScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const targetCanvas = canvas;
    const targetContext = context;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let isVisible = true;

    function resize() {
      const bounds = targetCanvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      targetCanvas.width = Math.round(width * pixelRatio);
      targetCanvas.height = Math.round(height * pixelRatio);
      targetContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function draw(timestamp: number) {
      if (!width || !height) resize();
      if (!width || !height) return;

      const time = motionPreference.matches ? 0 : timestamp;
      const horizon = height * 0.69;
      const isDark = document.documentElement.dataset.theme === 'dark';
      const palette = isDark
        ? {
            sky: ['#030303', '#111111', '#282828', '#080808'],
            stars: '#ffffff',
            starsAccent: '#dddddd',
            sun: ['#ffffff', '#cfcfcf', '#ffffff'],
            sunGlow: '#ffffff',
            sunStripe: '#080808',
            mountain: ['#080808', '#030303'],
            mountainEdge: '#ffffff',
            mountainGlow: '#ffffff',
            horizonGlow: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.92)', 'rgba(255, 255, 255, 0)'],
            floor: ['#161616', '#030303'],
            grid: '#ffffff',
            gridGlow: '#ffffff',
          }
        : {
            sky: ['#ffffff', '#e8e8e8', '#c8c8c8', '#f8f8f8'],
            stars: '#111111',
            starsAccent: '#444444',
            sun: ['#111111', '#3a3a3a', '#050505'],
            sunGlow: '#111111',
            sunStripe: '#ffffff',
            mountain: ['#111111', '#050505'],
            mountainEdge: '#090909',
            mountainGlow: '#111111',
            horizonGlow: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.72)', 'rgba(0, 0, 0, 0)'],
            floor: ['#f5f5f5', '#dedede'],
            grid: '#080808',
            gridGlow: '#111111',
          };
      const vanishingPoint = { x: width * 0.5, y: horizon };
      const gridTop = vanishingPoint.y;
      const sky = targetContext.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, palette.sky[0]);
      sky.addColorStop(0.48, palette.sky[1]);
      sky.addColorStop(0.83, palette.sky[2]);
      sky.addColorStop(1, palette.sky[3]);

      targetContext.clearRect(0, 0, width, height);
      targetContext.fillStyle = sky;
      targetContext.fillRect(0, 0, width, height);

      const stars = Math.max(45, Math.round((width * height) / 3900));
      for (let star = 0; star < stars; star += 1) {
        const seed = star * 127.1 + 311.7;
        const x = ((Math.sin(seed) * 43758.5453) % 1 + 1) % 1 * width;
        const y = ((Math.sin(seed * 1.73) * 24634.6345) % 1 + 1) % 1 * horizon * 0.72;
        const twinkle = 0.35 + (Math.sin(time * 0.0015 + seed) + 1) * 0.3;
        const radius = star % 13 === 0 ? 1.25 : 0.65;
        targetContext.globalAlpha = twinkle;
        targetContext.fillStyle = star % 7 === 0 ? palette.starsAccent : palette.stars;
        targetContext.beginPath();
        targetContext.arc(x, y, radius, 0, Math.PI * 2);
        targetContext.fill();
      }
      targetContext.globalAlpha = 1;

      const sunRadius = Math.min(width * 0.28, height * 0.3);
      const sunX = width * 0.5;
      const sunY = height * 0.36;
      const sunGradient = targetContext.createLinearGradient(0, sunY - sunRadius, 0, sunY + sunRadius);
      sunGradient.addColorStop(0, palette.sun[0]);
      sunGradient.addColorStop(0.55, palette.sun[1]);
      sunGradient.addColorStop(1, palette.sun[2]);

      targetContext.save();
      targetContext.shadowColor = palette.sunGlow;
      targetContext.shadowBlur = Math.min(34, width * 0.055);
      targetContext.fillStyle = sunGradient;
      targetContext.beginPath();
      targetContext.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      targetContext.fill();
      targetContext.restore();

      targetContext.save();
      targetContext.beginPath();
      targetContext.arc(sunX, sunY, sunRadius - 1, 0, Math.PI * 2);
      targetContext.clip();
      targetContext.fillStyle = palette.sunStripe;
      const stripeStart = sunY + sunRadius * 0.27;
      const stripeStep = Math.max(7, sunRadius * 0.095);
      for (let stripeY = stripeStart; stripeY < sunY + sunRadius; stripeY += stripeStep) {
        const stripeHeight = Math.max(2.5, stripeStep * (stripeY < sunY + sunRadius * 0.64 ? 0.24 : 0.34));
        targetContext.fillRect(sunX - sunRadius, stripeY, sunRadius * 2, stripeHeight);
      }
      targetContext.restore();

      const mountainPoints = [
        [0, 0.94], [0.05, 0.78], [0.12, 0.91], [0.18, 0.82],
        [0.27, 0.98], [0.37, 0.8], [0.46, 0.95], [0.54, 0.75],
        [0.65, 0.98], [0.75, 0.83], [0.84, 0.97], [0.91, 0.8], [1, 0.93],
      ];
      const mountainBase = horizon + height * 0.045;
      const mountainFill = targetContext.createLinearGradient(0, horizon - height * 0.08, 0, mountainBase);
      mountainFill.addColorStop(0, palette.mountain[0]);
      mountainFill.addColorStop(1, palette.mountain[1]);

      targetContext.beginPath();
      mountainPoints.forEach(([xRatio, yRatio], index) => {
        const x = xRatio * width;
        const y = horizon - (1 - yRatio) * height * 0.33;
        if (index === 0) targetContext.moveTo(x, y);
        else targetContext.lineTo(x, y);
      });
      targetContext.lineTo(width, mountainBase);
      targetContext.lineTo(0, mountainBase);
      targetContext.closePath();
      targetContext.fillStyle = mountainFill;
      targetContext.fill();

      targetContext.beginPath();
      mountainPoints.forEach(([xRatio, yRatio], index) => {
        const x = xRatio * width;
        const y = horizon - (1 - yRatio) * height * 0.33;
        if (index === 0) targetContext.moveTo(x, y);
        else targetContext.lineTo(x, y);
      });
      targetContext.strokeStyle = palette.mountainEdge;
      targetContext.lineWidth = Math.max(1, width * 0.002);
      targetContext.shadowColor = palette.mountainGlow;
      targetContext.shadowBlur = 9;
      targetContext.stroke();
      targetContext.shadowBlur = 0;

      const horizonGlow = targetContext.createLinearGradient(0, horizon - 5, 0, horizon + 14);
      horizonGlow.addColorStop(0, palette.horizonGlow[0]);
      horizonGlow.addColorStop(0.55, palette.horizonGlow[1]);
      horizonGlow.addColorStop(1, palette.horizonGlow[2]);
      targetContext.fillStyle = horizonGlow;
      targetContext.fillRect(0, horizon - 5, width, 20);

      const floorGradient = targetContext.createLinearGradient(0, horizon, 0, height);
      floorGradient.addColorStop(0, palette.floor[0]);
      floorGradient.addColorStop(1, palette.floor[1]);
      targetContext.fillStyle = floorGradient;
      targetContext.fillRect(0, gridTop, width, height - gridTop);

      const phase = motionPreference.matches ? 0 : (time * 0.00022) % 1;
      targetContext.strokeStyle = palette.grid;
      targetContext.lineWidth = Math.max(0.7, width * 0.0014);
      targetContext.shadowColor = palette.gridGlow;
      targetContext.shadowBlur = 5;

      const rowCount = 19;
      for (let row = 0; row <= rowCount; row += 1) {
        const progress = ((row / rowCount + phase) % 1);
        const y = gridTop + Math.pow(progress, 2.05) * (height - gridTop);
        targetContext.globalAlpha = 0.48 + progress * 0.52;
        targetContext.beginPath();
        targetContext.moveTo(0, y);
        targetContext.lineTo(width, y);
        targetContext.stroke();
      }

      const columnCount = Math.max(14, Math.round(width / 32));
      const horizonSpread = width * 0.035;
      targetContext.globalAlpha = 0.84;
      targetContext.save();
      targetContext.beginPath();
      targetContext.rect(0, gridTop, width, height - gridTop);
      targetContext.clip();
      for (let column = -columnCount; column <= columnCount; column += 1) {
        const perspective = column / columnCount;
        const horizonX = vanishingPoint.x + perspective * horizonSpread;
        const bottomX = vanishingPoint.x + perspective * width * 0.76;
        targetContext.beginPath();
        targetContext.moveTo(horizonX, vanishingPoint.y);
        targetContext.lineTo(bottomX, height + 1);
        targetContext.stroke();
      }
      targetContext.restore();
      targetContext.globalAlpha = 1;
      targetContext.shadowBlur = 0;

      if (isVisible && !motionPreference.matches) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    }

    function startAnimation() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(draw);
    }

    function handleVisibility() {
      isVisible = !document.hidden;
      if (isVisible) startAnimation();
      else window.cancelAnimationFrame(animationFrame);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      startAnimation();
    });
    const themeObserver = new MutationObserver(() => {
      draw(performance.now());
    });
    resizeObserver.observe(targetCanvas);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    motionPreference.addEventListener('change', startAnimation);
    document.addEventListener('visibilitychange', handleVisibility);
    resize();
    startAnimation();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      motionPreference.removeEventListener('change', startAnimation);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="synthwave-canvas"
      role="img"
      aria-label="Paisagem synthwave animada com sol listrado, montanhas neon, estrelas e grade em perspectiva"
    />
  );
}