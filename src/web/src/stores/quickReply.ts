import { IQuickReplyGroup } from "../types/quickReply";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import indexdbStorage from "./indexdbStorage";

type State = {
    quickReply: Record<
        string,
        {
            group: IQuickReplyGroup[];
        }
    >;
};

type Actions = {
    setQuickReply: (quickReply: Record<string, any>) => void;
};

// 个人快捷回复
const useQuickReplyStore = create<State & Actions>()(
    devtools(
        persist(
            (set) => ({
                // 快捷回复
                quickReply: {},

                // 设置快捷回复
                setQuickReply: (quickReply: Record<string, any>) => {
                    set(
                        {
                            quickReply,
                        },
                        true
                    );
                },
            }),
            {
                name: "quickReply-storage",
                version: 1,
                storage: indexdbStorage,
            }
        )
    )
);

export default useQuickReplyStore;
