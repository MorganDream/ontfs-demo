import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    flexColumn: {
      height: '450px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      WebkitJustifyContent: 'space-around'
    }
  }),
);