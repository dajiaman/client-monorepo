import { FC, memo, useCallback, useEffect, useState } from "react";
import AppItem from "../AppItem";
import { DragableCard } from "../components/DragableCard";
import "./index.less";
import { cloneDeep } from "lodash-es";
import { createSelectors } from "../../../stores";
import useAppStore, { IAvailableApp } from "../../../stores/app";
import useSessionStore from "../../../stores/session";
import React from "react";
import { isUndefined } from "lib/common/type";
import { deepClone } from "lib/common/objects";

interface StateProps {
  availableApps: any[];
}

const AppList: FC<StateProps> = ({ availableApps }) => {
  const defaultCheckedNames = ["WhatsApp", "Telegram", "Line"];
  const setAvailableApps = createSelectors(useAppStore).use.setAvailableApps();
  const sessionList = createSelectors(useSessionStore).use.sessionList();

  const [cards, setCards] = useState<IAvailableApp[]>(() => {
    const cloneAvailableApps = deepClone(availableApps as IAvailableApp[]);
    cloneAvailableApps.forEach((item) => {
      if (defaultCheckedNames.includes(item.name)) {
        if (isUndefined(item.customize)) {
          item.checked = true;
        }
      }

      // 是否有开启运行中的会话
      const hasChildren = sessionList[item.name]?.some((session: any) => {
        return session.active;
      });
      item.hasChildren = !!hasChildren;
    });
    return cloneAvailableApps;
  });

  const findCard = useCallback(
    (id: string) => {
      const card = cards.filter((c: { id: string }) => `${c.id}` === id)[0];
      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards]
  );

  //移动当前模块
  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard(id);
      const newCards = cards.slice();
      newCards.splice(index, 1);
      newCards.splice(atIndex, 0, card);
      setCards(newCards);
    },
    [findCard, cards, setCards]
  );

  // app checked 事件
  const onItemSelect = (checked: boolean, selectedAppId: string) => {
    console.log("onItemSelect:", checked, selectedAppId);
    const newCards = cloneDeep(cards);
    newCards.map((item) => {
      if (item.id === selectedAppId) {
        item.checked = checked;
        //用户是否自定义了自己的支持平台
        item.customize = checked;
      }
    });
    setCards(newCards);
  };

  // cards 变化
  useEffect(() => {
    const newCards = deepClone(cards);
    console.log("cards:", newCards);
    setAvailableApps(newCards);
  }, [cards]);

  const clickFn = (e: React.MouseEvent<HTMLSpanElement>) => {
    console.log("clickFn:", e);
  };

  return (
    <div className="cards-wrapper">
      {cards &&
        cards?.map((app: any, index: number) => {
          return (
            <DragableCard
              moveCard={moveCard}
              findCard={findCard}
              id={app.id}
              index={index}
              key={app.id}
            >
              <AppItem
                clickFn={clickFn}
                app={app}
                ifDefaultChecked={!!app.checked}
                ifChildrenLength={app.hasChildren ? 1 : 0}
                onSelect={onItemSelect}
              ></AppItem>
            </DragableCard>
          );
        })}
    </div>
  );
};

export default memo(AppList);
