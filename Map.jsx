import React, { useState, useEffect, useRef } from 'react';

// Basic data for initial village locations (can be extended or loaded dynamically)
const initialLocations = [
  { id: 'leaf',   name: 'Leaf Village',   x: 300, y: 400, status: 'peace' },
  { id: 'sand',   name: 'Sand Village',   x: 600, y: 500, status: 'war' },
  { id: 'mist',   name: 'Mist Village',   x: 900, y: 300, status: 'hidden' }
];

/**
 * React version of the Shinobi world map.
 * - Supports panning with the mouse and zooming with the wheel.
 * - Renders example location markers with different statuses.
 *
 * This component intentionally keeps the logic lightweight to demonstrate
 * how the original index.html map can be ported to JSX. More features from
 * the HTML version (chat, player markers, etc.) can be migrated in a similar
 * manner using React hooks.
 */
export default function ShinobiMap() {
  const mapRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Register simple mouse drag + wheel zoom handlers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let isPanning = false;
    let start = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isPanning = true;
      start = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    };

    const handleMouseMove = (e) => {
      if (!isPanning) return;
      setOffset({ x: e.clientX - start.x, y: e.clientY - start.y });
    };

    const handleMouseUp = () => {
      isPanning = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      setZoom((z) => Math.min(Math.max(z - e.deltaY * 0.001, 0.5), 3));
    };

    map.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    map.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      map.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      map.removeEventListener('wheel', handleWheel);
    };
  }, [offset]);

  return (
    <div
      id="map-container"
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {/* Water texture background */}
      <div
        id="water-layer"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/images/Tex_0044_результат.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '5%',
          zIndex: 0
        }}
      />

      {/* Actual map with panning/zooming */}
      <div
        id="map"
        ref={mapRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 2000,
          height: 1200,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          background: 'transparent',
          zIndex: 2,
          cursor: 'grab'
        }}
      >
        {/* Placeholder SVG map. Replace paths with actual SVG data from index.html */}
        <svg id="svg-map" viewBox="0 0 2000 1200" style={{ overflow: 'visible' }}>
          <path
            d="M0 0h2000v1200H0z"
            fill="none"
            stroke="gold"
            strokeWidth={4}
          />
        </svg>

        {/* Example location markers */}
        {initialLocations.map((loc) => (
          <div
            key={loc.id}
            className={`location status-${loc.status}`}
            style={{
              position: 'absolute',
              left: loc.x,
              top: loc.y,
              width: 32,
              height: 32,
              backgroundImage: `url(/images/${loc.id}.png)`,
              backgroundSize: 'cover',
              borderRadius: '50%'
            }}
            title={loc.name}
          />
        ))}
      </div>
    </div>
  );
}

