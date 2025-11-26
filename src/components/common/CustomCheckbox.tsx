// src/components/common/CustomCheckbox.tsx
import React from 'react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
  color?: string;
  checkmarkColor?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  size = 20,
  color = '#8FBF4D',
  checkmarkColor = '#FFFFFF',
}) => {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: size,
        height: size,
        borderRadius: '4px',
        border: `2px solid ${color}`,
        backgroundColor: checked ? color : '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg
          width={size * 0.8}
          height={size * 0.8}
          viewBox="0 0 24 24"
          fill="none"
          stroke={checkmarkColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  );
};

export default CustomCheckbox;
