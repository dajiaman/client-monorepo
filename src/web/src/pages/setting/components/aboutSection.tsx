import { FC } from "react";
import { useTranslation } from "react-i18next";

interface StateProps {
  value?: string;
}

const AboutSection: FC<StateProps> = ({ value }) => {
  const { t } = useTranslation();

  return (
    <div className="setting-section about-section" data-value={value}>
      <div className="title">{t("about")}</div>
      <div className="content">
        <div className="about-link">
          <a>{t("change-log")}</a>
        </div>
        <div className="about-link">
          <a>{t("help-doc")}</a>
        </div>
        <div className="about-link">
          <a>{t("get-latest-version")}</a>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
