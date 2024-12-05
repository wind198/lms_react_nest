type IUserActivationProps = {
  userName: string;
  activationUrl: string;
};

export default function UserActivation(props: IUserActivationProps) {
  const { userName, activationUrl } = props;

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', color: '#007bff' }}>
            Welcome to Our Service!
          </h1>
        </header>
        <section>
          <p style={{ fontSize: '18px' }}>
            Hi <strong>{userName}</strong>,
          </p>
          <p style={{ fontSize: '16px' }}>
            Thank you for signing up! Please click the button below to activate
            your account.
          </p>
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a
              href={activationUrl}
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                fontSize: '16px',
                color: '#fff',
                backgroundColor: '#007bff',
                borderRadius: '5px',
                textDecoration: 'none',
              }}
            >
              Activate Account
            </a>
          </div>
          <p style={{ fontSize: '16px' }}>
            If you did not sign up for this account, please ignore this email.
          </p>
        </section>
        <footer
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
        </footer>
      </div>
    </div>
  );
}
