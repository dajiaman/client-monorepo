import AppList from "../../components/SupportPlatform/AppList";
import { createSelectors } from "../../stores";
import useAppStore from "../../stores/app";
import "./supportPlatform.less";

const SupportPlatformPage = () => {
    const availableApps = createSelectors(useAppStore).use.availableApps();

    return (
        <div className="supportPlatform-page">
            {availableApps.length > 0 && (
                <AppList availableApps={availableApps}></AppList>
            )}
        </div>
    );
};

export default SupportPlatformPage;
