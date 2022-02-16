import styled, { css } from "styled-components";
export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: 1px solid black;
`;
export const Header = styled.thead``;
export const Body = styled.tbody``;
export const Row = styled.tr`
  border-bottom: 1px solid black;
`;
export const HeaderCell = styled.th`
  white-space: nowrap;
  font-weight: normal;
  text-align: left;
  padding: 10px;
  color: white;
  font-size: 13px;
  /* box-shadow: inset 0px -1px 0 0px black; */
`;
export const Cell = styled.td`
  font-size: 16px;
  padding: 4px 10px;
  border-left: 1px solid black;
  border-right: 1px solid black;
  color: white;
  text-align: center;
  &:last-child {
    padding-right: 0;
  }
`;
