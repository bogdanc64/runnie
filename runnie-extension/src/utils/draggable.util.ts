export const addDragFunctionality = (
  payload: {
      container: HTMLElement
      floatingContainerId: string
      draggableZoneId: string
  }
) => {
  const popup = payload.container.querySelector(`#${payload.floatingContainerId}`) as HTMLElement;
  const dragZone = payload.container.querySelector(`#${payload.draggableZoneId}`) as HTMLElement;

  if (!popup || !dragZone) {
    console.error('Required elements not found');
    return;
  }

  let isDragging = false;
  let startX = 0, startY = 0;

  const startDragging = (e: MouseEvent) => {
    isDragging = true;
    startX = e.clientX - popup.offsetLeft;
    startY = e.clientY - popup.offsetTop;
  };

  const drag = (e: MouseEvent) => {
    if (!isDragging) return;
    popup.style.left = `${e.clientX - startX}px`;
    popup.style.top = `${e.clientY - startY}px`;
  };

  const stopDragging = () => isDragging = false;

  dragZone.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);
};