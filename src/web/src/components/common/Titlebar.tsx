import classNames from "classnames";
import { memo } from "react";
import "./Titlebar.less";
import { TITLEBAR_HEIGHT } from "../../config";

function Titlebar() {
    return (
        <div
            className={classNames("titlebar-part")}
            style={{
                height: TITLEBAR_HEIGHT + "px",
            }}
        >
            <div className="titlebar-container">
                <div className="titlebar-drag-region"></div>
            </div>
        </div>
    );
}

export default memo(Titlebar);
