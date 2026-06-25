import React, { useState, useRef, useEffect } from 'react';
import { Crosshair, Activity, Sparkles } from 'lucide-react';

interface PlayerProfileProps {
  messiImpact: number;
  onMessiImpactChange: (newVal: number) => void;
}

interface ShotData {
  x: number; // percentage width (0-100) on half-pitch
  y: number; // percentage height (0-100) on half-pitch
  xG: number;
  outcome: 'Gol' | 'Parado' | 'Desviado';
  opponent: string;
  minute: number;
  type: string;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ messiImpact, onMessiImpactChange }) => {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tooltip, setTooltip] = useState<{ show: boolean; x: number; y: number; content: string }>({ show: false, x: 0, y: 0, content: '' });

  // Radar metrics definition (scale 0 to 100)
  const radarMetrics = [
    { key: 'xG', name: 'Expected Goals (xG)', val2022: 92, val2026: 78, desc: 'Calidad de oportunidades de tiro generadas por partido.' },
    { key: 'xA', name: 'Expected Assists (xA)', val2022: 95, val2026: 88, desc: 'Probabilidad de que sus pases clave resulten en asistencia de gol.' },
    { key: 'regates', name: 'Éxito en Regates', val2022: 89, val2026: 70, desc: 'Porcentaje de regates exitosos en el último tercio del campo.' },
    { key: 'pases', name: 'Pases Clave /90', val2022: 96, val2026: 94, desc: 'Pases que conducen directamente a un remate a puerta de un compañero.' },
    { key: 'tiros', name: 'Tiros a Puerta /90', val2022: 85, val2026: 72, desc: 'Frecuencia de disparos directos al arco rival cada 90 minutos.' },
    { key: 'creacion', name: 'Acciones de Tiro', val2022: 98, val2026: 92, desc: 'Contribución total en la posesión para que acabe en tiro.' },
  ];

  // Static shots data for canvas shot map (Half-pitch layout)
  const shots: ShotData[] = [
    { x: 78, y: 50, xG: 0.72, outcome: 'Gol', opponent: 'Francia (Final 2022)', minute: 23, type: 'Penalti' },
    { x: 82, y: 35, xG: 0.12, outcome: 'Gol', opponent: 'México', minute: 64, type: 'Tiro fuera del área' }, // famous goal against Mexico!
    { x: 74, y: 62, xG: 0.45, outcome: 'Gol', opponent: 'Australia', minute: 35, type: 'Tiro raso cruzado' },
    { x: 88, y: 48, xG: 0.65, outcome: 'Gol', opponent: 'Francia (Final 2022)', minute: 108, type: 'Rebote de cerca' },
    { x: 62, y: 45, xG: 0.08, outcome: 'Desviado', opponent: 'Países Bajos', minute: 73, type: 'Falta directa desviada' },
    { x: 79, y: 52, xG: 0.32, outcome: 'Gol', opponent: 'Croacia', minute: 69, type: 'Asistencia convertida (remate)' },
    { x: 76, y: 30, xG: 0.18, outcome: 'Parado', opponent: 'Ecuador (2025)', minute: 78, type: 'Falta directa parada' },
    { x: 84, y: 58, xG: 0.55, outcome: 'Gol', opponent: 'Canadá (Copa América)', minute: 51, type: 'Definición cruzada' },
  ];

  // Draw Soccer Half-pitch and shot points on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw field background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw field lines (Half-pitch layout on width)
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2.5;

    // Boundary Line
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Midfield line
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(10, canvas.height - 10);
    ctx.stroke();

    // Goal box (right side is the opponent goal)
    const goalBoxHeight = canvas.height * 0.5;
    const goalBoxWidth = canvas.width * 0.22;
    const goalBoxY = (canvas.height - goalBoxHeight) / 2;
    const goalBoxX = canvas.width - goalBoxWidth - 10;
    ctx.strokeRect(goalBoxX, goalBoxY, goalBoxWidth, goalBoxHeight);

    // Inner small box
    const smallBoxHeight = canvas.height * 0.22;
    const smallBoxWidth = canvas.width * 0.08;
    const smallBoxY = (canvas.height - smallBoxHeight) / 2;
    const smallBoxX = canvas.width - smallBoxWidth - 10;
    ctx.strokeRect(smallBoxX, smallBoxY, smallBoxWidth, smallBoxHeight);

    // Penalty spot
    ctx.beginPath();
    ctx.arc(canvas.width - canvas.width * 0.15, canvas.height / 2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fill();

    // Penalty arc
    ctx.beginPath();
    ctx.arc(canvas.width - canvas.width * 0.15, canvas.height / 2, canvas.width * 0.11, Math.PI * 0.72, Math.PI * 1.28, true);
    ctx.stroke();

    // Opponent Goal post (outside the boundary line on right)
    ctx.strokeStyle = 'var(--accent-gold)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 10, canvas.height / 2 - 30);
    ctx.lineTo(canvas.width - 10, canvas.height / 2 + 30);
    ctx.stroke();

    // Draw all shot points
    shots.forEach(shot => {
      const px = (shot.x / 100) * canvas.width;
      const py = (shot.y / 100) * canvas.height;

      ctx.beginPath();
      ctx.arc(px, py, 7.5 + shot.xG * 6, 0, Math.PI * 2);
      
      if (shot.outcome === 'Gol') {
        ctx.fillStyle = 'var(--accent-gold)';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      } else if (shot.outcome === 'Parado') {
        ctx.fillStyle = 'var(--accent-cyan)';
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fill();
      }
    });

  }, []);

  // Handle canvas mouse move to show tooltips for shots
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Map mouse coordinates back to canvas dimensions
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = mx * scaleX;
    const cy = my * scaleY;

    // Check if hovered over any shot
    let foundShot: ShotData | null = null;
    shots.forEach(shot => {
      const px = (shot.x / 100) * canvas.width;
      const py = (shot.y / 100) * canvas.height;
      const dist = Math.hypot(cx - px, cy - py);
      
      if (dist < 10 + shot.xG * 6) {
        foundShot = shot;
      }
    });

    if (foundShot) {
      const s = foundShot as ShotData;
      setTooltip({
        show: true,
        x: mx + 15,
        y: my - 25,
        content: `${s.opponent} - Min ${s.minute} | xG: ${s.xG} | ${s.outcome}`
      });
    } else {
      setTooltip(t => ({ ...t, show: false }));
    }
  };

  // SVG Radar center and points layout calculations
  const cx = 150;
  const cy = 150;
  const r = 100;
  const totalAngles = radarMetrics.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalAngles) * index - Math.PI / 2;
    const radius = (value / 100) * r;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  };

  // Generate SVG polygon points path
  const points2022 = radarMetrics.map((m, idx) => {
    const { x, y } = getCoordinates(idx, m.val2022);
    return `${x},${y}`;
  }).join(' ');

  const points2026 = radarMetrics.map((m, idx) => {
    const { x, y } = getCoordinates(idx, m.val2026);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Player Header Banner */}
      <div className="glass-card">
        <div className="player-profile-header">
          <div className="player-photo-container">
            <div className="player-photo-inner">
              <span className="player-avatar">🐐</span>
            </div>
          </div>
          
          <div className="player-info-meta">
            <span className="player-title">The Analyst Player Profile</span>
            <h1 className="player-name">Lionel Messi</h1>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>🇦🇷 Argentina</span>
              <span>•</span>
              <span>Inter Miami CF</span>
              <span>•</span>
              <span>Edad: 39 años (Proyectado 2026)</span>
            </div>
          </div>
        </div>

        <div className="player-stats-mini-grid">
          <div className="mini-stat-card">
            <div className="mini-stat-val">180</div>
            <div className="mini-stat-label">Internacionalidades</div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-val">13</div>
            <div className="mini-stat-label">Goles Mundiales</div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-val">8</div>
            <div className="mini-stat-label">Balones de Oro</div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-val">1</div>
            <div className="mini-stat-label">Copas del Mundo</div>
          </div>
        </div>
      </div>

      {/* Simulator Impact Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(13, 21, 39, 0.7) 100%)',
        borderColor: 'var(--accent-purple-glow)'
      }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={18} className="text-gold" />
          <span>Messi Impact Factor (Simulador de Selección)</span>
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Desliza este control para simular el nivel de forma e influencia de Lionel Messi. 
          Aumentar este factor incrementa la fortaleza general (rating) de Argentina en las simulaciones Monte Carlo hasta un +15%.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={messiImpact}
            onChange={(e) => onMessiImpactChange(parseFloat(e.target.value))}
            style={{
              flex: 1,
              height: '8px',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer',
              accentColor: 'var(--accent-purple)',
              background: 'rgba(255,255,255,0.05)'
            }}
          />
          <div style={{
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid var(--accent-purple)',
            color: 'var(--accent-purple)',
            fontWeight: 800,
            padding: '0.4rem 1rem',
            borderRadius: '6px',
            fontSize: '1rem',
            minWidth: '70px',
            textAlign: 'center'
          }}>
            {Math.round(messiImpact * 100)}%
          </div>
        </div>
      </div>

      {/* Grid of Interactive Charts */}
      <div className="charts-grid">
        
        {/* Radar Chart Card */}
        <div className="glass-card">
          <div className="panel-title">
            <Activity size={20} className="text-gold" />
            <span>Opta Stats Radar: 2022 vs 2026 (Proy.)</span>
          </div>

          <div className="radar-container">
            <svg viewBox="0 0 300 300" className="radar-svg">
              {/* Draw concentric pentagons */}
              {[20, 40, 60, 80, 100].map((level) => {
                const pentPoints = radarMetrics.map((_, idx) => {
                  const { x, y } = getCoordinates(idx, level);
                  return `${x},${y}`;
                }).join(' ');

                return (
                  <polygon
                    key={level}
                    points={pentPoints}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Draw radial axis lines */}
              {radarMetrics.map((_, idx) => {
                const outer = getCoordinates(idx, 100);
                return (
                  <line
                    key={idx}
                    x1={cx}
                    y1={cy}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Draw 2022 Profile Polygon (Gold) */}
              <polygon
                points={points2022}
                fill="rgba(251, 191, 36, 0.15)"
                stroke="var(--accent-gold)"
                strokeWidth="2.5"
                style={{
                  filter: 'drop-shadow(0 0 4px var(--accent-gold-glow))',
                  transition: 'var(--transition-smooth)'
                }}
              />

              {/* Draw 2026 Profile Polygon (Purple) */}
              <polygon
                points={points2026}
                fill="rgba(168, 85, 247, 0.15)"
                stroke="var(--accent-purple)"
                strokeWidth="2.5"
                style={{
                  filter: 'drop-shadow(0 0 4px var(--accent-purple-glow))',
                  transition: 'var(--transition-smooth)'
                }}
              />

              {/* Interactive nodes / text labels */}
              {radarMetrics.map((m, idx) => {
                const labelPos = getCoordinates(idx, 115);
                const isHovered = activeMetric === m.key;

                return (
                  <g 
                    key={m.key}
                    onMouseEnter={() => setActiveMetric(m.key)}
                    onMouseLeave={() => setActiveMetric(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Node Dot for 2026 */}
                    <circle
                      cx={getCoordinates(idx, m.val2026).x}
                      cy={getCoordinates(idx, m.val2026).y}
                      r={isHovered ? 5 : 3.5}
                      fill="var(--accent-purple)"
                    />
                    
                    {/* Metric name labels */}
                    <text
                      x={labelPos.x}
                      y={labelPos.y + 4}
                      fill={isHovered ? 'var(--accent-cyan)' : 'var(--text-secondary)'}
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="var(--font-heading)"
                    >
                      {m.key.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Radar Legend & Active Description */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '12px', height: '12px', background: 'var(--accent-gold)', borderRadius: '3px' }}></div>
                <span>Mundial Qatar 2022</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '12px', height: '12px', background: 'var(--accent-purple)', borderRadius: '3px' }}></div>
                <span>Mundial 2026 (Proyectado)</span>
              </div>
            </div>

            {activeMetric ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.8rem'
              }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>
                  {radarMetrics.find(m => m.key === activeMetric)?.name}:
                </strong>{' '}
                {radarMetrics.find(m => m.key === activeMetric)?.desc}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                  <span style={{ color: 'var(--accent-gold)' }}>2022: {radarMetrics.find(m => m.key === activeMetric)?.val2022}%</span>
                  <span style={{ color: 'var(--accent-purple)' }}>2026: {radarMetrics.find(m => m.key === activeMetric)?.val2026}%</span>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Pasa el cursor sobre los nombres de las métricas para ver detalles.
              </p>
            )}
          </div>
        </div>

        {/* Canvas Shot Map Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-title">
            <Crosshair size={20} className="text-gold" />
            <span>Interactive Shot Map (Mundiales & Copa América)</span>
          </div>

          <div className="shotmap-canvas-container" style={{ flex: 1 }}>
            <canvas
              ref={canvasRef}
              width={480}
              height={320}
              className="shotmap-canvas"
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setTooltip(t => ({ ...t, show: false }))}
            />

            {/* Float Canvas tooltip */}
            {tooltip.show && (
              <div 
                className="shot-tooltip" 
                style={{ 
                  left: `${tooltip.x}px`, 
                  top: `${tooltip.y}px` 
                }}
              >
                {tooltip.content}
              </div>
            )}
          </div>

          {/* Shot Map Legend */}
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', fontSize: '0.8rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--accent-gold)', borderRadius: '50%', border: '1px solid #fff' }}></div>
              <span>Gol</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--accent-cyan)', borderRadius: '50%' }}></div>
              <span>Remate Parado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '10px', height: '10px', background: 'rgba(148,163,184,0.4)', borderRadius: '50%' }}></div>
              <span>Remate Desviado</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
