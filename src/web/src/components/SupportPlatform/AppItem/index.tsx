import { Checkbox } from "@arco-design/web-react";
import classNames from "classnames";
import { FC, useState } from "react";
import "./index.less";

interface StateProps {
  app: any;
  ifDefaultChecked: boolean;
  ifChildrenLength: number;
  onSelect: (e: boolean, id: string) => void;
  clickFn: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

const AppItem: FC<StateProps> = ({
  app,
  ifDefaultChecked,
  ifChildrenLength,
  onSelect,
  clickFn,
}) => {
  const disabled = !app.available || !!ifChildrenLength;
  // 默认是否选中
  const [selected, setSelected] = useState(ifDefaultChecked);

  const setSelectFn = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!disabled) {
      setSelected(!selected);
      onSelect(!selected, app.id);
    }
  };

  return (
    <div
      onClick={setSelectFn}
      className={classNames("app-item", "app-item--dragable", {
        "app-item--selected": selected,
        "app-item--disabled": disabled,
      })}
    >
      <div className="checkbox-wrapper">
        <Checkbox defaultChecked={selected} checked={selected}></Checkbox>
      </div>
      <div className="body">
        <img
          className="icon"
          src={ifDefaultChecked ? "" : ""}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        />
        <span className="name">{app.name}</span>
      </div>
    </div>
  );
};

export default AppItem;
