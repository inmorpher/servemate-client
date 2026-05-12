import { HoverCardAlign, HoverCardSide } from '../types';

export const calculatePositionForHoverCard = (
    triggerRect: DOMRect,
    contentSize: { width: number; height: number } | null,
    side: HoverCardSide = 'bottom',
    align: HoverCardAlign = 'center',
    sideOffset: number = 4,
): { top: number; left: number } => {
    if (!contentSize) {
        return { top: 0, left: 0 };
    }

    const { width: contentWidth, height: contentHeight } = contentSize;
    let top = 0;
    let left = 0;

    // Primary positioning by side
    switch (side) {
        case 'bottom':
            top = triggerRect.bottom + sideOffset;
            break;
        case 'top':
            top = triggerRect.top - contentHeight - sideOffset;
            break;
        case 'left':
            left = triggerRect.left - contentWidth - sideOffset;
            break;
        case 'right':
            left = triggerRect.right + sideOffset;
            break;
    }

    // Alignment (perpendicular to side)
    if (side === 'top' || side === 'bottom') {
        switch (align) {
            case 'start':
                left = triggerRect.left;
                break;
            case 'center':
                left = triggerRect.left + triggerRect.width / 2 - contentWidth / 2;
                break;
            case 'end':
                left = triggerRect.right - contentWidth;
                break;
        }
    } else {
        switch (align) {
            case 'start':
                top = triggerRect.top;
                break;
            case 'center':
                top = triggerRect.top + triggerRect.height / 2 - contentHeight / 2;
                break;
            case 'end':
                top = triggerRect.bottom - contentHeight;
                break;
        }
    }

    return { top, left };
};