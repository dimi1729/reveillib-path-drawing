export function convertPixelsToFeet(x_px, y_px, origin) {
    // CORNERS:
    // Top left: 25, 25
    // Bottom left: 25, 775
    // Top right: 775, 25
    // Bottom right: 775, 775
    // Field length is 12ft x 12ft
    const round3 = (value) => Math.round(value * 1000) / 1000;

    if (origin === "top_left"){
        const x_pos = round3((x_px - 25) / 750 * 12);
        const y_pos = round3((y_px - 25) / 750 * 12);
        return {x_pos, y_pos};
    }
    else if (origin === "bottom_left"){
        const x_pos = round3((x_px - 25) / 750 * 12);
        const y_pos = round3((775 - y_px) / 750 * 12);
        return {x_pos, y_pos};
    }
    else if (origin === "top_right"){
        const x_pos = round3((775 - x_px) / 750 * 12);
        const y_pos = round3((y_px - 25) / 750 * 12);
        return {x_pos, y_pos};
    }
    else if (origin === "bottom_right"){
        const x_pos = round3((775 - x_px) / 750 * 12);
        const y_pos = round3((775 - y_px) / 750 * 12);
        return {x_pos, y_pos};
    }

    throw new Error(`'${origin}' is not one of the options`);
}