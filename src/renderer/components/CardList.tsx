import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { FC, PropsWithChildren } from "react";

export const CardList: FC<
  PropsWithChildren<{ boxId: string; cardIds: string[] }>
> = ({ boxId, cardIds, children }) => {
  const { setNodeRef } = useDroppable({
    id: boxId,
  });

  return (
    <SortableContext
      id={boxId}
      items={cardIds}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="card-list">
        {children}
      </div>
    </SortableContext>
  );
};
