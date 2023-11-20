import { Button, Message } from "@arco-design/web-react";
import classNames from "classnames";
import { FC, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { createSelectors } from "../../stores";
import useSessionStore from "../../stores/session";
import SessionCard from "../SessionCard";
import "./index.less";
import { SessionAppParam } from "../../types/session";
import { useUpdate } from "ahooks";

interface StateProps {
  appName: string;
  selectedSessionId: string;
  // 是否收起
  collapsed: boolean;
  // 收起/展开 切换事件
  onCollapse: () => void;
  // 更新选中的id
  updateSelectedSessionId: (sessionId: string) => void;
}

const SessionListBar: FC<StateProps> = ({
  appName,
  updateSelectedSessionId,
  selectedSessionId,
  collapsed,
  onCollapse,
}) => {
  const { t } = useTranslation();

  const sessionList = createSelectors(useSessionStore).use.sessionList();
  // 新增
  const addSesssion = createSelectors(useSessionStore).use.addSession();
  // 删除
  const removeSession = createSelectors(useSessionStore).use.removeSession();
  // 启动
  const startSession = createSelectors(useSessionStore).use.startSession();
  const showSessionView =
    createSelectors(useSessionStore).use.showSessionView();
  // 关闭
  const closeSession = createSelectors(useSessionStore).use.closeSession();
  // 更新备注
  const updateSessionRemark =
    createSelectors(useSessionStore).use.updateSessionRemark();

  const forceUpdate = useUpdate();

  const appSessionList = useMemo(() => {
    if (!appName || !sessionList) {
      return [];
    }

    const list = sessionList?.[appName] || [];

    // 降序
    return list?.sort((a, b) => {
      return b.createTime - a.createTime;
    });
  }, [sessionList, appName]);

  // 新增按钮点击
  const createNewSession = async () => {
    await addSesssion(appName);
  };

  // 重置选中sessionId为空
  const resetSelectedSessionId = () => {
    updateSelectedSessionId("");
  };

  // 启动session
  const startSessionHandler = async (session: SessionAppParam) => {
    Message.clear();
    Message.info("模拟启动");
    const sessionId = session.sessionId;
    if (!sessionId) {
      return;
    }
    try {
      await startSession(appName, sessionId);
      updateSelectedSessionId(sessionId);
      showSessionView(appName, sessionId);
    } catch (error) {
      console.log("启动失败", error);
    }
  };

  /**
   * 关闭session
   * @param session
   */
  const closeSessionHandler = async (session: SessionAppParam) => {
    Message.clear();
    Message.info("模拟关闭");
    console.log("closeSessionHandler", session);
    await closeSession(appName, session.sessionId);
    resetSelectedSessionId();
  };

  /**
   * 删除session
   * @param session
   * @returns
   */
  const removeSessionHandler = async (session: SessionAppParam) => {
    console.log("removeSessionHandler", session);
    await removeSession(appName, session.sessionId);
    resetSelectedSessionId();
  };

  /**
   * 更新备注
   * @param session
   * @param remark
   */
  const updateRemarkHandler = (session: SessionAppParam, remark: string) => {
    console.log("updateRemarkHandler", session, remark);
    updateSessionRemark(appName, session.sessionId, remark);
  };

  /**
   * 会话点击
   * @param session
   * @returns
   */
  const sessionCardClick = (session: SessionAppParam) => {
    if (session.sessionId === selectedSessionId) {
      return;
    }

    if (!session.active) {
      return;
    }

    updateSelectedSessionId(session.sessionId);
  };

  return (
    <div
      className={classNames("sessionlist-bar", {
        "is-collapsed": collapsed,
      })}
      role="none"
    >
      <div className="title">
        <div className="title-label">{appName}</div>
        <div className="title-actions">
          {/* <Button
            onClick={(e) => {
              onCollapse();
            }}
          >
            切换尺寸
          </Button> */}
        </div>
      </div>
      <div className="add-btn-wrapper">
        <Button type="primary" long onClick={createNewSession}>
          {t("new-session")}
        </Button>
      </div>
      <div className="sessionlist-bar-content">
        <PerfectScrollbar>
          <div className="panel-view">
            {appSessionList?.map((session) => {
              return (
                <SessionCard
                  key={session.sessionId}
                  session={session}
                  active={session.active}
                  selected={session.sessionId === selectedSessionId}
                  startSession={startSessionHandler}
                  closeSession={closeSessionHandler}
                  removeSession={removeSessionHandler}
                  updateRemark={updateRemarkHandler}
                  click={sessionCardClick}
                ></SessionCard>
              );
            })}
          </div>
        </PerfectScrollbar>
      </div>
    </div>
  );
};

export default SessionListBar;
