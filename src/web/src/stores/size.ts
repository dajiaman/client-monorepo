import {
    ACTIVITYBAR_WIDTH,
    RIGHTPANEL_WIDTH,
    SESSIONLISTBAR_WIDTH,
} from "../config";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
    activityBarWidth: number;
    sessionListBarWidth: number;
    rightSessionPanelWidth: number;
    windowHeight: number;
};

type Actions = {
    setWindowHeight: (height: number) => void;
    setActivityBarWidth: (width: number) => void;
    setSessionListBarWidth: (width: number) => void;
    setRightSessionPanelWidth: (width: number) => void;
};

const useSizeStore = create<State & Actions>()(
    devtools((set) => ({
        activityBarWidth: ACTIVITYBAR_WIDTH,
        sessionListBarWidth: SESSIONLISTBAR_WIDTH,
        rightSessionPanelWidth: RIGHTPANEL_WIDTH,
        windowHeight: window.innerHeight,

        setWindowHeight: (height: number) => {
            set({
                windowHeight: height,
            });
        },
        setActivityBarWidth: (width: number) => {
            set({
                activityBarWidth: width,
            });
        },
        setSessionListBarWidth: (width: number) => {
            set({
                sessionListBarWidth: width,
            });
        },
        setRightSessionPanelWidth: (width: number) => {
            set({
                rightSessionPanelWidth: width,
            });
        },
    }))
);

export default useSizeStore;
