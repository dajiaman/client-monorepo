import { Input } from "@arco-design/web-react";

import { FC } from "react";
import { useTranslation } from "react-i18next";

interface StateProps {
  value?: string;
}

const ShortcutSection: FC<StateProps> = ({ value }) => {
  const { t } = useTranslation();

  return (
    <div className="setting-section" data-value={value}>
      <div className="title">{t("shortcut")}</div>
      <div className="content">
        <div className="form-item">
          <div className="title">{t("show-or-hide")}</div>
          <Input></Input>
        </div>
      </div>
    </div>
  );
};

export default ShortcutSection;
