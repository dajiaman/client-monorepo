import { Avatar, Button, Input, Message } from "@arco-design/web-react";
import { debounce } from "lodash-es";
import { useState } from "react";
import "./index.less";
import { SessionAppParam } from "../../types/session";
import classNames from "classnames";

interface StateProps {
  // session 信息
  session: SessionAppParam;
  // 是否选中
  selected: boolean;

  active: boolean;

  // 事件
  startSession: any;
  closeSession: any;
  removeSession: any;
  updateRemark: any;

  click: any;
}

const SessionCard: React.FC<StateProps> = ({
  session,
  active,
  selected = false,
  startSession,
  closeSession,
  removeSession,
  updateRemark,
  click,
}) => {
  // 启动/关闭 加载中状态
  const [loading, setLoading] = useState<boolean>(false);

  const onRemarkBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    // 输入的文字
    const inputText = e.target.value;
    updateRemark(session, inputText.trim());
  };

  const onRemarkInputChange = debounce((value: string, e: Event) => {
    // 输入的文字
    const inputText = value;
    updateRemark(session, inputText.trim());
  }, 100);

  // 关闭会话
  const onCloseSession = (e: Event) => {
    e.preventDefault();
    setLoading(true);
    closeSession(session).then(() => {
      setLoading(false);
    });
  };

  // 打开会话
  const onStartSession = (e: Event) => {
    e.preventDefault();
    setLoading(true);
    startSession(session).then(() => {
      setLoading(false);
    });
  };

  return (
    <div
      className={classNames("session-card", {
        "is-selected": selected,
      })}
      data-session-id={session.sessionId}
      onClick={(e) => {
        e.preventDefault();
        click(session);
      }}
    >
      <div className="session-card-header">
        <div className="avatar-wrapper">
          <Avatar>A</Avatar>
        </div>
        <div className="session-card-header-meta">
          <div className="nickname">{session.sessionId}</div>
          <div className="username">{session.createTime}</div>
        </div>
      </div>
      <div>
        {active ? (
          <Button type="primary" loading={loading} onClick={onCloseSession}>
            关闭
          </Button>
        ) : (
          <Button type="primary" onClick={onStartSession} loading={loading}>
            打开
          </Button>
        )}

        <Button
          type="text"
          onClick={(e) => {
            e.preventDefault();
            if (session.active) {
              Message.error("请先关闭会话");
              return;
            }
            removeSession(session);
          }}
        >
          删除
        </Button>
      </div>
      <div className="session-card-body">
        <div className="remark-wrapper">
          <Input
            className="remark-input"
            placeholder="输入备注"
            defaultValue={session.remark}
            onChange={onRemarkInputChange}
            onBlur={onRemarkBlur}
            size="mini"
            allowClear
          />
        </div>
        <div className="proxy-info-wrapper">
          <span>-</span>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
