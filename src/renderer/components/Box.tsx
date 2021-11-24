import React, { useCallback, FC, ReactNode } from "react";
import { AppInfo } from "../../common/interface";
import { invokeGetAppIcon, invokeOpenFileDialog } from "../ipcRenderer";
import { pathToName } from "../../common/util";
import { DroppableProvided } from "react-beautiful-dnd";
import { addButton, cardContainer, header } from "../styles/AppCard.css";

export const Box: FC<{
  boxId: string;
  header: ReactNode;
  droppableProvided: DroppableProvided;
  updateHotKeyMap: (appInfo: AppInfo) => void;
}> = (props) => {
  const { droppableProvided } = props;

  const handleOpenFileDialog = useCallback(async () => {
    const fileNames = await invokeOpenFileDialog();
    const appPath = fileNames.filePaths[0];
    const appName = pathToName(appPath);
    const appIcon = await invokeGetAppIcon(appPath);
    if (appName) {
      const appData: AppInfo = {
        name: appName,
        path: appPath,
        icon: appIcon,
      };
      props.updateHotKeyMap(appData);
    } else {
      return;
    }
  }, [
    invokeOpenFileDialog,
    pathToName,
    invokeGetAppIcon,
    props.updateHotKeyMap,
  ]);

  return (
    <div className={cardContainer} {...droppableProvided.droppableProps}>
      <header className={header}>
        {props.header}
        <button className={addButton} onClick={handleOpenFileDialog}>
          +
        </button>
      </header>
      {props.children}
    </div>
  );
};
