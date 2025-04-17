export function convertPixelsToFeet(x_px, y_px, origin, rect) {
    const round3 = (value) => Math.round(value * 1000) / 1000;
    const fieldSize = 12; // Field dimensions in feet

    // x_px and y_px are already relative to the element; compute normalized values
    const relativeX = x_px / rect.width;
    const relativeY = y_px / rect.height;

    if (origin === "top_left"){
        const x_pos = round3(relativeX * fieldSize);
        const y_pos = round3(relativeY * fieldSize);
        return { x_pos, y_pos };
    }
    else if (origin === "bottom_left"){
        const x_pos = round3(relativeX * fieldSize);
        const y_pos = round3((1 - relativeY) * fieldSize);
        return { x_pos, y_pos };
    }
    else if (origin === "top_right"){
        const x_pos = round3((1 - relativeX) * fieldSize);
        const y_pos = round3(relativeY * fieldSize);
        return { x_pos, y_pos };
    }
    else if (origin === "bottom_right"){
        const x_pos = round3((1 - relativeX) * fieldSize);
        const y_pos = round3((1 - relativeY) * fieldSize);
        return { x_pos, y_pos };
    }

    throw new Error(`'${origin}' is not one of the options`);
}