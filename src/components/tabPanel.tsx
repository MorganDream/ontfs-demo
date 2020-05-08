import React from "react";
import { Typography, Box } from "@material-ui/core";

interface Props {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export const TabPanel = React.memo((props: Props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
})