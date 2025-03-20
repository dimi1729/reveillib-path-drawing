export function codeGenerator(x_ft, y_ft, speed){


    const code_block = `
    reckless->go(
        RecklessPath()
            .with_segment(PilonsSegment(
                ${speed},
                pilons_correction,
                &SimpleStop(0.1_s, 0.2_s, 0.25, 0_s),
                {${x_ft}_ft, ${y_ft}_ft}, 0_in))
    );
    `;

    return code_block;
}