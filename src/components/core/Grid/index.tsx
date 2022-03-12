import React from "react";
import { Table, Header, Body, HeaderCell, Row, Cell } from "./Grid.styled";

interface IColumn {
  key: string;
  title: string;
  renderer?: (value: string | number) => string | number;
}
export interface IRow {
  [key: string]: string | number;
}
interface IGridProps {
  columns: IColumn[];
  rows?: IRow[];
}

export const Grid: React.FC<IGridProps> = (props) => {
  const { columns = [], rows = [] } = props;

  return (
    <Table>
      <Header>
        <Row>
          {columns.map((column: IColumn) => {
            return <HeaderCell key={column.key}>{column.title}</HeaderCell>;
          })}
        </Row>
      </Header>
      <Body>
        {props.children ??
          rows.map((row: IRow, index) => {
            return (
              <Row key={index}>
                {columns.map((column) => (
                  <Cell key={column.key}>{column.renderer ? column.renderer(row[column.key]) : row[column.key]}</Cell>
                ))}
              </Row>
            );
          })}
        {}
      </Body>
    </Table>
  );
};
