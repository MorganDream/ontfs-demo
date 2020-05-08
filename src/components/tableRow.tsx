import React from 'react';
import { TableRow, TableCell } from "@material-ui/core"

export const KeyValueInfoItem = (prop: string, value: any) => {
    return (
        <TableRow>
          <TableCell component="th" scope="row" style={{background: 'grey', maxWidth: '50px'}}>{prop}</TableCell>
          <TableCell align="right">{value}</TableCell>
        </TableRow>
    )
}