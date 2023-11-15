export function getClientArea(element: HTMLElement) {
	const elDocument = element.ownerDocument;
	const elWindow = elDocument.defaultView?.window;

	// Try with DOM clientWidth / clientHeight
	if (element !== elDocument.body) {
		// return new Dimension(element.clientWidth, element.clientHeight);
		return {
			width: element.clientWidth,
			height: element.clientHeight,
		};
	}

	// If visual view port exits and it's on mobile, it should be used instead of window innerWidth / innerHeight, or document.body.clientWidth / document.body.clientHeight
	//   if (platform.isIOS && elWindow?.visualViewport) {
	//     return new Dimension(
	//       elWindow.visualViewport.width,
	//       elWindow.visualViewport.height
	//     );
	//   }

	// Try innerWidth / innerHeight
	if (elWindow?.innerWidth && elWindow.innerHeight) {
		// return new Dimension(elWindow.innerWidth, elWindow.innerHeight);
		return {
			width: elWindow.innerWidth,
			height: elWindow.innerHeight,
		};
	}

	// Try with document.body.clientWidth / document.body.clientHeight
	if (
		elDocument.body &&
		elDocument.body.clientWidth &&
		elDocument.body.clientHeight
	) {
		// return new Dimension(
		//   elDocument.body.clientWidth,
		//   elDocument.body.clientHeight
		// );

		return {
			width: elDocument.body.clientWidth,
			height: elDocument.body.clientHeight,
		};
	}

	// Try with document.documentElement.clientWidth / document.documentElement.clientHeight
	if (
		elDocument.documentElement &&
		elDocument.documentElement.clientWidth &&
		elDocument.documentElement.clientHeight
	) {
		// return new Dimension(
		//   elDocument.documentElement.clientWidth,
		//   elDocument.documentElement.clientHeight
		// );

		return {
			width: elDocument.documentElement.clientWidth,
			height: elDocument.documentElement.clientHeight,
		};
	}

	throw new Error("Unable to figure out browser width and height");
}

export function size(
	element: HTMLElement,
	width: number | null,
	height: number | null
): void {
	if (typeof width === "number") {
		element.style.width = `${width}px`;
	}

	if (typeof height === "number") {
		element.style.height = `${height}px`;
	}
}
