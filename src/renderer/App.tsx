import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { create } from "mutative";
import React, { FC, useEffect, useState } from "react";
import { AppInfo, HotKeyMap } from "../common/interface";
import { Box } from "./components/Box";
import { Card } from "./components/Card";
import { CardList } from "./components/CardList";

const { getHotKeyMap, setHotKeyMap } = window.electron!;

export const App: FC = () => {
  const [hotKeyData, setHotKeyData] = useState<HotKeyMap>({});

  const updateHotKeyMap = (boxKey: string) => (newApp: AppInfo) => {
    const data = create(hotKeyData, (draft) => {
      draft[boxKey].push(newApp);
    });
    setHotKeyData(data);
    setHotKeyMap(data);
  };

  const removeHotKeyMap = (boxKey: string, cardIndex: number) => {
    const data = create(hotKeyData, (draft) => {
      draft[boxKey].splice(cardIndex, 1);
    });
    setHotKeyData(data);
    setHotKeyMap(data);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    getHotKeyMap().then((res) => {
      if (res) {
        setHotKeyData(res);
      }
    });
  }, []);

  const [draggingItem, setDraggingItem] = useState<{
    cardId: UniqueIdentifier;
    boxId: string;
  } | null>(null);

  if (!hotKeyData) {
    return <div>Loading...</div>;
  }

  // View
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => {
        console.log(event);
        setDraggingItem({
          cardId: event.active.id,
          boxId: event.active.data.current?.sortable.containerId,
        });
      }}
    >
      <div className="launcher-section">
        {Object.entries(hotKeyData).map(([boxId, appList]) => {
          const cardIds = appList.map(({ path }) => path);
          return (
            <Box
              key={boxId}
              header={`Ctrl + ${boxId}`}
              updateHotKeyMap={updateHotKeyMap(boxId)}
            >
              <CardList boxId={boxId} cardIds={cardIds}>
                {appList.map((app, cardIndex) => (
                  <Card
                    key={app.path}
                    cardId={app.path}
                    icon={app.icon ?? ""}
                    name={app.name}
                    removeHotKeyMap={() => removeHotKeyMap(boxId, cardIndex)}
                  />
                ))}
              </CardList>
            </Box>
          );
        })}
        <DragOverlay>
          {draggingItem
            ? (() => {
                const { boxId, cardId } = draggingItem;
                const app = hotKeyData[boxId].find(
                  (app) => app.path === cardId
                );
                return (
                  <Card
                    cardId={draggingItem.cardId}
                    icon={app?.icon ?? ""}
                    name={app?.name ?? ""}
                    removeHotKeyMap={() => {}}
                  />
                );
              })()
            : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
