import * as React from "react";

import CONFIG from "../../../../shared/config";

export const style = {
    width: "100%",
    textAlign: "center",
    fontSize: "11px",
    lineHeight: 1.5,
    letterSpacing: "1.6px",
};

export const copyright = (
<span style={style}>
    &copy; 2016 {CONFIG.COMPANY_NAME}
</span>);
