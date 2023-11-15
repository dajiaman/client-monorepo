import { FC, ReactNode } from "react";
import { useDrag, useDrop } from "react-dnd";

interface CardProps {
	id: string;
	index: number;
	moveCard: (dragIndex: string, hoverIndex: number) => void;
	findCard: (id: string) => { index: number };
	children: ReactNode;
}

export const ItemTypes = {
	CARD: "card",
};

interface Item {
	id: string;
	originalIndex: number;
}

export const DragableCard: FC<CardProps> = ({
	id,
	index,
	findCard,
	moveCard,
	children,
}) => {
	const originalIndex = findCard(id).index;
	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: ItemTypes.CARD,
			item: { id, originalIndex },
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
			end: (item, monitor) => {
				const { id: droppedId, originalIndex } = item;
				const didDrop = monitor.didDrop();
				if (!didDrop) {
					moveCard(droppedId, originalIndex);
				}
			},
		}),
		[id, originalIndex, moveCard]
	);

	const [, drop] = useDrop(
		() => ({
			accept: ItemTypes.CARD,
			hover({ id: draggedId }: Item) {
				if (draggedId !== id) {
					const { index: overIndex } = findCard(id);
					moveCard(draggedId, overIndex);
				}
			},
		}),
		[findCard, moveCard]
	);

	const opacity = isDragging ? 0 : 1;

	return (
		<div
			ref={(node) => drag(drop(node))}
			className="dragable-card"
			style={{ opacity }}
		>
			{children}
		</div>
	);
};
