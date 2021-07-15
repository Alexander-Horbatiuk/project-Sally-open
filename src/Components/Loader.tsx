import LinearProgress from "@material-ui/core/LinearProgress";
import React from "react";

const Loader: React.FC = props => {
    return <LinearProgress style={{position: 'fixed', top: '0', left: 0, right: 0}}/>
}

export default Loader;