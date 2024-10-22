import * as packageJSON from "../package.json"

export const config = {
    displayedAppTitle: "Runnie 🚀",
    floatingComponent: {
        defaultVisibility: false,
        containerId: `${packageJSON.name}-floating`,
        draggableZoneId: `${packageJSON.name}-drag-zone`
    }
}