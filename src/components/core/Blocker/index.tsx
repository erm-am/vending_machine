import styled, { css } from "styled-components";

export const Blocker = () => {
  return <BlockerContainer />;
};

const BlockerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #8080800f;
`;
