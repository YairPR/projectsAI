import React, { useState } from 'react';
import { calculateCombinedOdds } from '../utils/simulatorEngine';
import { ShoppingCart, Trash2, DollarSign, X, CheckCircle, AlertTriangle } from 'lucide-react';

export interface BetSelection {
  id: string; // matchName + selectionId
  matchName: string; // e.g., "Ecuador vs Alemania"
  selectionName: string; // e.g., "Ecuador gana"
  odds: string;
  prob: number;
  marketType: string;
  selectionId: string;
}

interface BettingSlipProps {
  selections: BetSelection[];
  onRemoveSelection: (id: string) => void;
  onClearSelections: () => void;
  isSlipOpen: boolean;
  onToggleSlip: () => void;
}

export const BettingSlip: React.FC<BettingSlipProps> = ({
  selections,
  onRemoveSelection,
  onClearSelections,
  isSlipOpen,
  onToggleSlip
}) => {
  const [stake, setStake] = useState<string>('10');
  const [betResult, setBetResult] = useState<{ show: boolean; won: boolean; winAmount: number; details: string } | null>(null);

  const combinedOdds = calculateCombinedOdds(selections);
  const potentialPayout = (parseFloat(stake) || 0) * parseFloat(combinedOdds);

  const handlePlaceBet = () => {
    const stakeNum = parseFloat(stake);
    if (isNaN(stakeNum) || stakeNum <= 0) {
      alert('Por favor introduce un importe de apuesta válido.');
      return;
    }

    // Simulate the bet outcomes based on their probabilities
    // We'll calculate a joint winning probability (roughly multiplication of probabilities)
    let jointProb = 1.0;
    selections.forEach(sel => {
      jointProb *= (sel.prob / 100);
    });

    // Correlation correction
    if (selections.length > 1) {
      jointProb = Math.min(0.95, jointProb * Math.pow(1.15, selections.length - 1));
    }

    const roll = Math.random();
    const won = roll < jointProb;
    const winAmount = won ? stakeNum * parseFloat(combinedOdds) : 0;

    let details = '';
    if (won) {
      details = `¡Felicidades! Todas tus selecciones se cumplieron en la simulación rápida. Recibes un pago de $${winAmount.toFixed(2)}.`;
    } else {
      // Find which selection "failed"
      const failedIndex = Math.floor(Math.random() * selections.length);
      const failedBet = selections[failedIndex];
      details = `Tu apuesta falló en la simulación. La selección "${failedBet.selectionName}" (${failedBet.matchName}) no resultó ganadora.`;
    }

    setBetResult({
      show: true,
      won,
      winAmount,
      details
    });
  };

  const closeResultModal = () => {
    setBetResult(null);
    onClearSelections();
  };

  if (!isSlipOpen && selections.length === 0) return null;

  return (
    <>
      {/* Floating Toggle Button (visible when slip has items but is closed) */}
      {!isSlipOpen && selections.length > 0 && (
        <button
          onClick={onToggleSlip}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--accent-gold)',
            color: '#020617',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            boxShadow: '0 8px 30px var(--accent-gold-glow)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 900,
            animation: 'pulse 2s infinite'
          }}
        >
          <ShoppingCart size={24} />
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'var(--accent-red)',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {selections.length}
          </span>
        </button>
      )}

      {/* Slide-out Betting Slip Panel */}
      {isSlipOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: 0,
          width: '380px',
          height: 'calc(100vh - 60px)',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-glass)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          zIndex: 850,
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.01)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={18} className="text-gold" />
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
                Boleto de Apuestas
              </h3>
            </div>
            <button
              onClick={onToggleSlip}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Selections List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {selections.length > 0 ? (
              selections.map(sel => (
                <div key={sel.id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => onRemoveSelection(sel.id)}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    {sel.matchName}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, paddingRight: '1.5rem', color: 'var(--text-primary)' }}>
                    {sel.selectionName}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                      Prob: {sel.prob}%
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.1rem',
                      color: 'var(--accent-gold)',
                      fontWeight: 700
                    }}>
                      {sel.odds}x
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                color: 'var(--text-muted)',
                marginTop: '4rem',
                fontSize: '0.9rem'
              }}>
                Tu boleto está vacío. Haz clic en las cuotas doradas del predictor para añadir apuestas.
              </div>
            )}
          </div>

          {/* Footer Calculations */}
          {selections.length > 0 && (
            <div style={{
              padding: '1.25rem',
              borderTop: '1px solid var(--border-glass)',
              background: 'rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div className="flex-space">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cuotas Combinadas:</span>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  color: 'var(--accent-gold)',
                  fontWeight: 800
                }}>
                  {combinedOdds}x
                </span>
              </div>

              {/* Stake input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flexShrink: 0 }}>Importe ($):</span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="number"
                    min="1"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      padding: '0.5rem 0.5rem 0.5rem 1.8rem',
                      borderRadius: '6px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}
                  />
                  <DollarSign size={14} style={{
                    position: 'absolute',
                    left: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }} />
                </div>
              </div>

              <div className="flex-space" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Retorno Potencial:</span>
                <span style={{
                  fontSize: '1.25rem',
                  color: 'var(--accent-green)',
                  fontWeight: 800
                }}>
                  ${potentialPayout.toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                <button
                  className="btn-primary"
                  onClick={handlePlaceBet}
                  style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                >
                  Confirmar Apuesta
                </button>
                <button
                  onClick={onClearSelections}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'var(--accent-red)',
                    cursor: 'pointer'
                  }}
                  title="Vaciar boleto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Result Simulation Modal */}
      {betResult && (
        <div className="sim-overlay" style={{ zIndex: 1100 }}>
          <div className="sim-loader-card" style={{ maxWidth: '400px', border: betResult.won ? '1px solid var(--accent-green)' : '1px solid var(--accent-red)' }}>
            {betResult.won ? (
              <CheckCircle size={56} style={{ color: 'var(--accent-green)', margin: '0 auto 1.5rem' }} />
            ) : (
              <AlertTriangle size={56} style={{ color: 'var(--accent-red)', margin: '0 auto 1.5rem' }} />
            )}

            <h3 style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              color: betResult.won ? 'var(--accent-green)' : 'var(--accent-red)',
              marginBottom: '0.5rem'
            }}>
              {betResult.won ? '¡APUESTA GANADA!' : 'Apuesta Perdida'}
            </h3>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              marginBottom: '1.5rem'
            }}>
              {betResult.details}
            </p>

            {betResult.won && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ganancia Neta:</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                  +${(betResult.winAmount - parseFloat(stake)).toFixed(2)}
                </div>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={closeResultModal}
              style={{
                width: '100%',
                background: betResult.won ? 'var(--accent-green)' : 'var(--accent-red)',
                boxShadow: betResult.won ? '0 4px 15px rgba(16, 185, 129, 0.2)' : '0 4px 15px rgba(239, 68, 68, 0.2)'
              }}
            >
              Cerrar y Limpiar Boleto
            </button>
          </div>
        </div>
      )}
    </>
  );
};
