import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';

interface DialogAndButtonProps {
    classes: { [key: string]: string | {} };
}

const styles = (theme: any) => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const UnstyledDialogAndButton = (props: any) => {
    const { classes } = props;
    const [dialogIsDisplayed, setDialogIsDisplayed] = useState(false);
    return (
        <React.Fragment>
            <Dialog open={dialogIsDisplayed} fullWidth={true} maxWidth={'lg'}
                    onClose={() => setDialogIsDisplayed(!dialogIsDisplayed)}
            >
                <DialogTitle id="form-dialog-title">Exclude paths</DialogTitle>
                <DialogContent>
                    { props.children }
                </DialogContent>
            </Dialog>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => setDialogIsDisplayed(!dialogIsDisplayed)}
            >Filter</Button>
        </React.Fragment>
    );
};

export const DialogAndButton = withStyles(styles)(UnstyledDialogAndButton);
