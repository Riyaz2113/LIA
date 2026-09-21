import { GraduationCap, Users, Shield } from 'lucide-react';

/**
 * RoleSelector
 * 3-Tab selector for Student, Faculty, and Admin portals matching the reference design.
 */
const RoleSelector = ({ selectedRole, onSelectRole, disabled = false }) => {
  const roles = [
    { id: 'STUDENT', label: 'Student', icon: GraduationCap },
    { id: 'FACULTY', label: 'Faculty', icon: Users },
    { id: 'ADMIN', label: 'Admin', icon: Shield },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem',
        marginBottom: '1.75rem',
      }}
    >
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.id;

        return (
          <button
            key={role.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectRole(role.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              padding: '0.75rem 0.5rem',
              borderRadius: '10px',
              border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
              color: isSelected ? '#2563eb' : '#64748b',
              fontWeight: isSelected ? 700 : 500,
              fontSize: '0.875rem',
              transition: 'all 150ms ease',
              cursor: disabled ? 'not-allowed' : 'pointer',
              boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none',
            }}
          >
            <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
            <span>{role.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSelector;
