import useSizeStore from "../stores/size";

export function setRootSize() {
    const height = window.innerHeight;
    useSizeStore.getState().setWindowHeight(height);
}
