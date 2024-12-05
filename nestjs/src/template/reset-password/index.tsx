import React from 'react';

type IUserActivationProps = {
  userName: string;
  resetPasswordUrl: string;
};

const ResetPassword: React.FC<IUserActivationProps> = ({
  userName,
  resetPasswordUrl,
}) => {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        padding: '20px',
      }}
    >
      <h2 style={{ color: '#007bff' }}>Password Reset Request</h2>
      <p>Hi {userName},</p>
      <p>
        We received a request to reset your password. Click the link below to
        choose a new password:
      </p>
      <p>
        <a
          href={resetPasswordUrl}
          style={{ color: '#007bff', textDecoration: 'none' }}
        >
          Reset Password
        </a>
      </p>
      <p>
        If you did not request a password reset, please ignore this email or
        contact support if you have questions.
      </p>
      <p>Thank you,</p>
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '14px',
          color: '#777',
        }}
      >
        <p>
          &copy; 2024 Niteco Niteco Uptime Monitoring System. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
