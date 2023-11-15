import { useSearchParams } from "react-router-dom";
import RightSessionPanel from "../../components/RightSessionPanel";
import SessionListBar from "../../components/SessionListBar";
import { createSelectors } from "../../stores";
import useSizeStore from "../../stores/size";
import { useEffect, useRef, useState } from "react";

import classNames from "classnames";
import { TITLEBAR_HEIGHT } from "../../config";
import "./platform.less";
import { useToggle } from "ahooks";

/**
 * 平台会话列表页面
 * @returns
 */
const Platform = () => {
  const [searchParams, _] = useSearchParams();
  // 平台名称
  const [appName, setAppName] = useState<string>(
    searchParams.get("platformName") || ""
  );

  //  选中会话id, 用于右侧面板展示
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");

  const updateSelectedSessionId = (sessionId: string) => {
    if (selectedSessionId !== sessionId) {
      selectedSessionIdChange(selectedSessionId, sessionId);
    }

    setSelectedSessionId(sessionId);
  };

  const selectedSessionIdChange = (oldValue: string, newValue: string) => {
    console.log("selectedSessionIdChange:", oldValue, newValue);
    if(oldValue === newValue) {
      return;
    }
    (window as any)?.vscode?.ipcRenderer?.invoke("show-browser-view", {
      sessionId: newValue,
    });
  };

  // 会话列表宽度
  const sessionListBarWidth =
    createSelectors(useSizeStore).use.sessionListBarWidth();
  // 右侧面板宽度
  const rightSessionPanelWidth =
    createSelectors(useSizeStore).use.rightSessionPanelWidth();

  useEffect(() => {
    console.log("searchParams changed:", searchParams.get("platformName"));
    setAppName(searchParams.get("platformName") || "");
  }, [searchParams]);

  const sessionContentRef = useRef<HTMLDivElement>(null);
  const sessionListBarRef = useRef<HTMLDivElement>(null);

  // 会话列表折叠状态
  const [sessionListBarCollapsed, { toggle: sessionListBarToggleCollapsed }] =
    useToggle<boolean>(false);

  // 右侧面板折叠
  const [rightPanelCollapsed, { toggle: rightPanelToggleCollapsed }] =
    useToggle<boolean>(false);

  return (
    <div className="platform-page">
      <div
        ref={sessionListBarRef}
        className={classNames("session-list-bar-wrapper", {
          "is-collapsed": sessionListBarCollapsed,
        })}
        style={{
          left: TITLEBAR_HEIGHT + "px",
          width: `${sessionListBarCollapsed ? 100 : sessionListBarWidth}px`,
        }}
      >
        <SessionListBar
          appName={appName}
          selectedSessionId={selectedSessionId}
          collapsed={sessionListBarCollapsed}
          onCollapse={sessionListBarToggleCollapsed}
          updateSelectedSessionId={updateSelectedSessionId}
        />
      </div>

      <div
        ref={sessionContentRef}
        style={{
          border: "2px solid red",
          display: "flex",
          flex: 1,
        }}
      >
        <div>中间</div>
      </div>

      <div
        className={classNames("right-session-panel-wrapper", {
          "is-hidden": !selectedSessionId,
        })}
        style={{
          width: `${rightPanelCollapsed ? "48" : rightSessionPanelWidth}px`,
        }}
      >
        <RightSessionPanel
          appName={appName}
          selectedSessionId={selectedSessionId}
          onCollapse={rightPanelToggleCollapsed}
        ></RightSessionPanel>
      </div>
    </div>
  );
};

export default Platform;
