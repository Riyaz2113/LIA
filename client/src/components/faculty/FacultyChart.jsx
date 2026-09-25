/**
 * FacultyChart
 * Pure SVG/CSS Grouped Bar Chart component for Class Analytics.
 * Renders Total Students, Present, and Absent across subjects without external heavy chart libraries.
 */
const FacultyChart = ({
  title = 'Class Analytics',
  data = [
    { subject: 'CS301', total: 60, present: 55, absent: 5 },
    { subject: 'CS304', subjectName: 'OS', total: 30, present: 28, absent: 2 },
    { subject: 'CS306', subjectName: 'AI', total: 30, present: 27, absent: 3 },
    { subject: 'CS308', subjectName: 'ML', total: 30, present: 29, absent: 1 },
  ],
}) => {
  const maxVal = 70; // chart ceiling for scaling
  const chartHeight = 180;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      className="faculty-chart-card"
    >
      {/* Chart Title & Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.0625rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: 0,
          }}
        >
          {title}
        </h3>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
            <span style={{ color: '#475569' }}>Total Students</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0ea5e9' }} />
            <span style={{ color: '#475569' }}>Present</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span style={{ color: '#475569' }}>Absent</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ position: 'relative', flex: 1, minHeight: `${chartHeight + 40}px` }}>
        {/* Background Grid Lines */}
        <div
          style={{
            position: 'absolute',
            inset: `0 0 35px 0`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          {[60, 45, 30, 15, 0].map((val) => (
            <div
              key={val}
              style={{
                borderBottom: val === 0 ? '1.5px solid #cbd5e1' : '1px dashed #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: '1px',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  transform: 'translateY(-50%)',
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div
          style={{
            position: 'absolute',
            inset: `0 0 35px 30px`,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            paddingInline: '1rem',
          }}
        >
          {data.map((item, idx) => {
            const hTotal = (item.total / maxVal) * chartHeight;
            const hPresent = (item.present / maxVal) * chartHeight;
            const hAbsent = Math.max((item.absent / maxVal) * chartHeight, 6);

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  width: '70px',
                }}
              >
                {/* 3 Grouped Bars */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '4px',
                    height: `${chartHeight}px`,
                  }}
                >
                  {/* Total Bar */}
                  <div
                    title={`Total: ${item.total}`}
                    style={{
                      width: '14px',
                      height: `${hTotal}px`,
                      backgroundColor: '#2563eb',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 300ms ease',
                    }}
                  />
                  {/* Present Bar */}
                  <div
                    title={`Present: ${item.present}`}
                    style={{
                      width: '14px',
                      height: `${hPresent}px`,
                      backgroundColor: '#0ea5e9',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 300ms ease',
                    }}
                  />
                  {/* Absent Bar */}
                  <div
                    title={`Absent: ${item.absent}`}
                    style={{
                      width: '14px',
                      height: `${hAbsent}px`,
                      backgroundColor: '#ef4444',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 300ms ease',
                    }}
                  />
                </div>

                {/* X-axis Label */}
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginTop: '0.5rem',
                  }}
                >
                  {item.subject}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FacultyChart;
