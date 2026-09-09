import { useWorldStore } from '../../state/worldStore';
import { worldContent } from '../../content/worldContent';

export function Hub() {
  const enterDistrict = useWorldStore((state) => state.enterDistrict);
  const discover = useWorldStore((state) => state.discover);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {worldContent.map((entry, index) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => {
            discover(entry.id);
            if (entry.destination) enterDistrict(entry.destination);
          }}
          style={{
            pointerEvents: 'auto',
            position: 'absolute',
            left: `${22 + index * 25}%`,
            top: '48%',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,.25)',
            background: 'rgba(8,12,24,.78)',
            color: 'white',
            backdropFilter: 'blur(12px)',
          }}
        >
          {entry.title}
        </button>
      ))}
    </div>
  );
}
