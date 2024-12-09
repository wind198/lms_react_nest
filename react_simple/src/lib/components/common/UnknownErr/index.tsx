import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router";

const UnknownErr: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page or another appropriate route
  };

  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, an unexpected error has occured."
      extra={
        <Button type="primary" onClick={handleGoHome}>
          Back to Home
        </Button>
      }
    />
  );
};

export default UnknownErr;
