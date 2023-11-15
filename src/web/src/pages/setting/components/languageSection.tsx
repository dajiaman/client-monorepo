import { Select } from "@arco-design/web-react";

import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../../../context";

interface StateProps {
  value?: string;
}

const LanguageSection: FC<StateProps> = ({ value }) => {
  const { t } = useTranslation();
  const { setLang, lang } = useContext(GlobalContext);

  return (
    <div className="setting-section" data-value={value}>
      <div className="title">{t("language")}</div>
      <div className="content">
        <Select
          options={[
            {
              label: "中文",
              value: "zh-CN",
            },
            {
              label: "繁体",
              value: "zh-TW",
            },
            {
              label: "English",
              value: "en-US",
            },
          ]}
          value={lang}
          triggerProps={{
            autoAlignPopupWidth: false,
            autoAlignPopupMinWidth: true,
            position: "br",
          }}
          onChange={(value) => {
            setLang && setLang(value);
          }}
        />
      </div>
    </div>
  );
};

export default LanguageSection;
