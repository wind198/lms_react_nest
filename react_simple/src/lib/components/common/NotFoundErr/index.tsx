import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page or another appropriate route
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleGoHome}>
          Back to Home
        </Button>
      }
    />
  );
};

export default NotFound;
