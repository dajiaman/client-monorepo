import { FC, useEffect } from "react";
import { isUndefined } from "lib/common/type";
import { useStore } from "zustand";
import {
  AppNameEnum,
  getSpeedTestUrlByAppName,
  getUrlByAppName,
} from "../../config/app.config";
import { CommonService } from "../../api/common";
import { createSelectors } from "../../stores";
import useAppStore, { IAvailableApp } from "../../stores/app";
import useGlobalStore from "../../stores/global";
import LoadingComponent from "../Loading";
import { useNavigate } from "react-router";
import { Message } from "@arco-design/web-react";

interface StateProps {
  complete: () => void;
}

/**
 * 初始化数据
 * 获取可用的平台， 可用翻译类型等数据
 * @returns
 */
const Initialization: FC<StateProps> = ({ complete }) => {
  const navigate = useNavigate();

  // 旧的持久化的可用app
  const oldAvailableApps = useStore(
    useAppStore,
    (state) => state.availableApps
  );

  const setAvailableApps = createSelectors(useAppStore).use.setAvailableApps();
  const setTranslateTypes =
    createSelectors(useGlobalStore).use.setTranslateTypes();

  useEffect(() => {
    Promise.all([
      CommonService.getUserInfoChannelList(),
      CommonService.getApiTranslateType(),
    ])
      .then((res) => {
        let isNewLogin = false;
        console.log("oldAvailableApps:", oldAvailableApps);

        // 平台
        const userInfoChannelListData: {
          id: number;
          name: string;
        }[] = res[0].data;

        // 翻译类型
        const apiTranslateTypeData = res[1].data;

        // 所有可用app 名称
        const validAppNames: string[] = [];

        // name -> object
        const map = new Map<string, any>();
        userInfoChannelListData.forEach((item) => {
          map.set(item.name, {
            user_info_channel_id: item.id,
            available: true,
            name: item.name,
            url: getUrlByAppName(item.name as AppNameEnum),
          });
          validAppNames.push(item.name);
        });

        // 构建显示的可用平台
        const availableApps: IAvailableApp[] = [];

        if (oldAvailableApps.length === 0) {
          isNewLogin = true;
        }

        console.log("isNewLogin:", isNewLogin);
        oldAvailableApps.forEach((appItem: any) => {
          // 通过appName获取旧的数据
          if (validAppNames.includes(appItem.name)) {
            availableApps.push(appItem);
          } else {
            appItem.available = false;
          }

          if (isUndefined(appItem.customize)) {
            appItem.customize = undefined;
          }
        });

        validAppNames.forEach((name) => {
          const contained = availableApps.find((item) => item.name === name);
          // 已经有了
          if (contained) {
            contained.available = true;
            return;
          } else {
            // 缺少的
            const temp = map.get(name);
            console.log("temp:", temp);
            const newApp: IAvailableApp = {
              id: temp.name,
              name: temp.name,
              checked: false,
              hasChildren: false,
              available: true,
              user_info_channel_id: temp.user_info_channel_id,
              customize: undefined,
              url: getUrlByAppName(name as AppNameEnum),
              speedTestUrl: getSpeedTestUrlByAppName(name as AppNameEnum),
            };
            availableApps.push(newApp);
          }
        });

        setAvailableApps(availableApps);
        setTranslateTypes(apiTranslateTypeData);
      })
      .catch((err) => {
        console.log("init error:", err);
        // 发生错误的话，需要重新登录
        Message.error("接口异常，请重新登录");
        setTimeout(() => {
          navigate("/login?from=logout");
        });
      })
      .finally(() => {
        setTimeout(() => {
          complete();
        }, 500);
      });
  }, []);

  return (
    <div className="global-init">
      <LoadingComponent />
    </div>
  );
};

export default Initialization;
