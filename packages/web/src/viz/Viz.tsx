import React, { useEffect, useState, useRef } from 'react';
import { makeViz } from './makeViz';
import { LogClient } from './GitLogClient';
import { Breadcrumb } from './Breadcrumb';
import { GitStats, calculate, filter } from './GitStats';
import { withStyles } from '@material-ui/core/styles';
import './viz.css';
import { Button, Dialog, TextField, InputAdornment } from '@material-ui/core';

export interface VizProps {
    gitLogClient: LogClient;
}

export enum VizState {
    'BRAND_NEW',
    'LOADED',
    'FAILED',
}

interface DialogAndButtonProps {
    classes: { [key: string]: string | {} };
}

const styles = (theme: any) => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});

const DialogAndButton = (props: any) => {
    const { classes } = props;
    const [dialogIsDisplayed, setDialogIsDisplayed] = useState(false);
    const inp = { startAdornment: <InputAdornment position="start">Kg</InputAdornment> }
    return (
        <React.Fragment>
        <Dialog open={dialogIsDisplayed}>
            <TextField
                id="outlined-simple-start-adornment"
                variant="outlined"
                label="With outlined TextField"
                InputProps={inp}
                />
        </Dialog>
        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => setDialogIsDisplayed(!dialogIsDisplayed)}
        >
            Primary
        </Button>
        </React.Fragment>
    );
};

const StyledDialogAndButton = withStyles(styles)(DialogAndButton);

export const Viz: React.FunctionComponent<VizProps> = (props) => {
    const [vizState, setVizState] = useState(VizState.BRAND_NEW);
    const [gitLogData, setGitLogData] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState([] as string[]);
    const [gitStats, setGitStats] = useState({});
    const chart = useRef(null);

    const onDirectoryChange = (breadcrumb: any) => {
        const path = breadcrumb.join('/').replace(/^root\//, '');
        setBreadcrumb(breadcrumb);
        setGitStats(calculate(filter({ ...(gitLogData as any), ...{} }, path)));
    };

    useEffect(() => {
        switch (vizState) {
            case VizState.BRAND_NEW:
                props.gitLogClient.getLog().then((gl: any) => {
                    setGitLogData(gl);
                    setVizState(VizState.LOADED);
                });
                break;
            case VizState.LOADED:
                makeViz(chart.current, gitLogData, onDirectoryChange);
                break;
            default:
                throw new Error('An error occurred loading git log data');
                return;
        }
    }, [gitLogData]);

    return (
        <div>
            <StyledDialogAndButton />
            <div id="chartContainer" ref={chart}>
                <div
                    className="spinner-border"
                    role="status"
                    style={{ width: '7rem', height: '7rem' }}
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            <GitStats gitDirectoryStats={gitStats} />
            <Breadcrumb path={breadcrumb} />
        </div>
    );
};
