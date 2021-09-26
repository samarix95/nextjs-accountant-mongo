import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
    },
    mediumAva: {
        width: theme.spacing(8) + "px !Important",
        height: theme.spacing(8) + "px !Important",
    },
    componentsImage: {
        width: "50%",
        margin: "0 auto"
    },
    margin_1: {
        margin: theme.spacing(1)
    },
    margin_lr_1: {
        marginLeft: theme.spacing(1) + "px !Important",
        marginRight: theme.spacing(1) + "px !Important"
    },
    margin_lr_2: {
        marginLeft: theme.spacing(2) + "px !Important",
        marginRight: theme.spacing(2) + "px !Important"
    },
    padding_1: {
        padding: theme.spacing(1) + "px !Important"
    },
    padding_2: {
        padding: theme.spacing(2) + "px !Important"
    },
    maxWidth_120: {
        maxWidth: 120
    },
    maxWidth_200: {
        maxWidth: 150
    },
    labelRoot: {
        right: 0
    },
    shrink: {
        transformOrigin: "top right"
    }
}));

export default useStyles;
