import type { ErrorInfo, ReactNode } from "react";
import React, { Component } from "react";
import styled from "styled-components";

interface IProps {
  children?: ReactNode;
}

interface IState {
  error: Error | null;
  info: ErrorInfo | null;
}
class ErrorBoundary extends Component<IProps, IState> {
  state = {
    error: null,
    info: null,
  };

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ error, info });
  }

  render() {
    const { error } = this.state;
    if (error) {
      console.log(this.state);
      return <ErrorBoundaryFallbackComponent />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Message = styled.div`
  padding: 40px;
  border: 2px #78909c solid;
  border-radius: 5px;
  font-size: 24px;
  color: #78909c;
`;

const ErrorBoundaryFallbackComponent = () => (
  <Layout>
    <Message>
      Что-то пошло не так!
      <span role="img" aria-label="face-emoji">
        😞
      </span>
    </Message>
  </Layout>
);
