import React from 'react';

interface CertificationBoxesProps {
  certifications: string[] | undefined;
}

export default function CertificationBoxes({ certifications }: CertificationBoxesProps) {
  if (!certifications || certifications.length === 0) {
    return <span style={{ color: '#9aa3b2' }}>—</span>;
  }

  return (
    <div className="certification-boxes">
      {certifications.map((cert, index) => (
        <button
          key={index}
          className="certification-box"
          onClick={() => {
            // For now, just log - will be connected to search later
            console.log('Clicked certification:', cert);
          }}
          type="button"
          title={`View other brands with ${cert} certification`}
        >
          {cert}
        </button>
      ))}
      
      <style>{`
        .certification-boxes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 0;
        }
        
        .certification-box {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #495057;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
        }
        
        .certification-box:hover {
          background: #e9ecef;
          border-color: #dee2e6;
          color: #212529;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .certification-box:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .certification-box:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}