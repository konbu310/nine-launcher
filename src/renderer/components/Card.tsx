import React, { FC } from "react";
import { Icon } from "./Icon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UniqueIdentifier } from "@dnd-kit/core";

export const Card: FC<{
  cardId: UniqueIdentifier;
  icon: string;
  name: string;
  removeHotKeyMap: VoidFunction;
}> = ({ cardId, icon, name, removeHotKeyMap }) => {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: cardId,
  });

  const iconSrc = icon.startsWith("data:")
    ? icon
    : `data:image/png;base64,${icon}`;

  return (
    <div
      ref={setNodeRef}
      className="card__container"
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        visibility: isDragging ? "hidden" : "visible",
      }}
      {...attributes}
      {...listeners}
    >
      <div className="card">
        <img className="card__icon" src={iconSrc} alt="application icon" />
        <span className="card__text">{name}</span>
        <Icon
          type="cross"
          className="remove-button"
          onClick={removeHotKeyMap}
        />
      </div>
    </div>
  );
};
