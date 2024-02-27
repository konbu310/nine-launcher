import React, { PropsWithChildren } from "react";
import { AppInfo } from "../../common/interface";
import { pathToName } from "../../common/util";
import { DragEventHandler, useCallback, FC, ReactNode } from "react";
import { Icon } from "./Icon";

const { getAppIcon, openFileDialog } = window.electron!;

export const Box: FC<
  PropsWithChildren<{
    header: ReactNode;
    updateHotKeyMap: Function;
  }>
> = ({ header, updateHotKeyMap, children }) => {
  const handleAppDrop: DragEventHandler = useCallback(
    async (ev) => {
      ev.preventDefault();
      if (ev.dataTransfer.effectAllowed === "move") return;
      const file = ev.dataTransfer.files[0];
      const appName = file.name.slice(0, -4);
      const appIcon = await getAppIcon(file.path);
      const appData: AppInfo = {
        name: appName,
        path: file.path,
        icon: appIcon,
      };
      updateHotKeyMap(appData);
    },
    [getAppIcon]
  );

  const handleOpenFileDialog = useCallback(async () => {
    const fileNames = await openFileDialog();
    const appPath = fileNames.filePaths[0];
    if (typeof appPath !== "string") {
      return;
    }
    const appName = pathToName(appPath);
    const appIcon = await getAppIcon(appPath);
    if (appName) {
      const appData: AppInfo = {
        name: appName,
        path: appPath,
        icon: appIcon,
      };
      updateHotKeyMap(appData);
    } else {
      return;
    }
  }, [openFileDialog, pathToName, getAppIcon, updateHotKeyMap]);

  return (
    <div className="box" onDrop={handleAppDrop}>
      <header className="box__header">
        {header}
        <Icon
          type="plus"
          className="add-button"
          onClick={handleOpenFileDialog}
        />
      </header>

      {children}
    </div>
  );
};
