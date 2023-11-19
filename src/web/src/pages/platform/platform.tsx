import { useSearchParams } from "react-router-dom";
import RightSessionPanel from "../../components/RightSessionPanel";
import SessionListBar from "../../components/SessionListBar";
import { createSelectors } from "../../stores";
import useSizeStore from "../../stores/size";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { TITLEBAR_HEIGHT } from "../../config";
import "./platform.less";
import { useMount, useToggle, useUpdateEffect } from "ahooks";
import useSessionStore from "../../stores/session";
import { IpcRenderer } from "../../../typings/electronTypes";

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

  useMount(() => {
    if (appName && selectedSessionId) {
      (window as any)?.vscode?.ipcRenderer?.invoke("show-browser-view", {
        sessionId: selectedSessionId,
      });
    }
  });

  const selectedSessionId =
    createSelectors(useSessionStore).use.selectedSessionId();
  const setSelectedSessionId =
    createSelectors(useSessionStore).use.setSelectedSessionId();

  // 更新选中的会话id
  const updateSelectedSessionId = (sessionId: string) => {
    if (selectedSessionId !== sessionId) {
      selectedSessionIdChange(selectedSessionId, sessionId);
    }

    setSelectedSessionId(sessionId);
  };

  // 选中的会话id变化
  const selectedSessionIdChange = (oldValue: string, newValue: string) => {
    if (oldValue === newValue) {
      // no change
      return;
    }

    console.log("selectedSessionIdChange:", oldValue, newValue);

    if (!newValue) {
      return;
    }
  };

  // 会话列表宽度
  const sessionListBarWidth =
    createSelectors(useSizeStore).use.sessionListBarWidth();
  // 右侧面板宽度
  const rightSessionPanelWidth =
    createSelectors(useSizeStore).use.rightSessionPanelWidth();

  useEffect(() => {
    console.log("searchParams changed:", searchParams.get("platformName"));
    setAppName(searchParams.get("platformName")!);
  }, [searchParams]);

  const sessionContentRef = useRef<HTMLDivElement>(null);
  const sessionListBarRef = useRef<HTMLDivElement>(null);

  // 会话列表折叠状态
  const [sessionListBarCollapsed, { toggle: sessionListBarToggleCollapsed }] =
    useToggle<boolean>(false);

  // 右侧面板折叠
  const [rightPanelCollapsed, { toggle: rightPanelToggleCollapsed }] =
    useToggle<boolean>(false);

  useUpdateEffect(() => {
    if (appName) {
      console.log("appName", appName, "selectedSessionId", selectedSessionId);
      // 是否需要隐藏所有的browser-view
      const notAllHidden =
        selectedSessionId && selectedSessionId.indexOf(appName) > -1;

      console.log("notAllHidden: ", notAllHidden);

      if (notAllHidden) {
        // 显示指定的browser-view
        ((window as any)?.vscode?.ipcRenderer as IpcRenderer)?.invoke(
          "show-browser-view",
          {
            sessionId: selectedSessionId,
          }
        );
      } else {
        // 先隐藏所有的browser-view
        ((window as any)?.vscode?.ipcRenderer as IpcRenderer)?.invoke(
          "hide-all-browser-view"
        );
      }
    }
  }, [appName]);

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
