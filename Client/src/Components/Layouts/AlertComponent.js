import React from "react";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { Container, Grid } from "@material-ui/core";
import { useStyles } from "../../Assets/Styles/jsStyles";
const AlertComponent = (props) => {
  const data = props.data;
  const classes = useStyles();
  return (
    <Container>
      <Grid>
        <Grid item>
          {data[0] ? (
            <Snackbar
              open={data[0]}
              autoHideDuration={6000}
              onClose={props.handleAlertClose}
            >
              <Alert
                severity={data[1]}
                variant="filled"
                onClose={props.handleAlertClose}
              >
                {data[2]}
              </Alert>
            </Snackbar>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AlertComponent;
