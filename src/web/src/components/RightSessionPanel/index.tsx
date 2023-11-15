import { FC } from "react";
import "./index.less";
import PerfectScrollBar from "react-perfect-scrollbar";

interface StateProps {
  appName: string;
  selectedSessionId: string;
  // 收起/打开切换 事件
  onCollapse: () => void;
}

const RightSessionPanel: FC<StateProps> = ({
  appName,
  selectedSessionId,
  onCollapse,
}) => {
  return (
    <div className="right-session-panel" role="none" data-appname={appName}>
      <div>
        <button onClick={onCollapse}>切换尺寸</button>
      </div>
      <div className="content">
        <PerfectScrollBar>
          <div>{selectedSessionId}</div>
        </PerfectScrollBar>
      </div>
    </div>
  );
};

export default RightSessionPanel;
