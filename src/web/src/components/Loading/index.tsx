import { memo } from "react";
import "./index.less";
import React from "react";

const LoadingComponent = () => {
    return (
        <div className="component-loading">
            <div className="bar">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default memo(LoadingComponent);
