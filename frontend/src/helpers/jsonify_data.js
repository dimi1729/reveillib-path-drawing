/**
 * FORMAT FOR JSON OBJECT
 * 
 * The json will be a dict, where the keys are natural numbers, and the values represent RecklessPaths
 * The RecklessPaths will be ordered by order of the keys. The first key is 1, and there should be no 
 * gaps in the numbers
 * 
 * The values will include before_path_code (str), after_path_code (str) and RecklessPath_code (list of dicts), where each subdict
 * in the RecklessPath corresponds to a path segment. Each path segment will contain the following:
 * key (segment_type, str):
 *      if the key is "PilonsSegment", the value is [speed (str or float), timeout (float, in secs), x (float, in ft), y (float, in ft), drop_early (float, in inches)]
 *      if the key is "TurnSegment", the value is [speed (float), coast_power (float), angle (float, in degrees), brake_time (float, in secs)]
 * 
 * To make it more clear here is an example. The following Reveillib code:
 *
        //ring #4
        reckless->go( 
                    .with_segment(PilonsSegment(
                        fast_motion,
                        pilons_correction,
                        &SimpleStop(0.1_s, 0.2_s, 0.25, 0_s),
                        {7.8_ft, 1.92_ft}, 0_in))
                    .with_segment(TurnSegment(
                        0.65,
                        0.25,
                        45_deg,
                        harsh_coeff,
                        coast_coeff,
                        0.25_s
                    ))  
                    .with_segment(PilonsSegment(
                        fast_motion,
                        pilons_correction,
                        &SimpleStop(0.1_s, 0.2_s, 0.25, 1_s),
                        {9.8_ft, 4_ft}, 1_in))
            );
            pros::delay(700);
            intake::motor.move_velocity(12000);
            timeout = 0;
            while(sensors::beam_break.get_value() == 0 && timeout < 3000) {
                pros::delay(20);
                timeout += 20;
            }
            intake::motor.brake();
            reckless->await();

            conveyor::cycle();
            //ring #5 (one before corner)
            reckless->go(
                RecklessPath()
                    .with_segment(PilonsSegment(
                        fast_motion,
                        pilons_correction,
                        &SimpleStop(0_s, 0_s, 0.25, 0_s),
                        {7.7_ft, 4_ft}, 0_in))
            );

            pros::delay(700);
            intake::motor.move_velocity(12000);    
            reckless->await(); 
 * 
 * 
 * Would be encoded as the following:
    {
    1: [
        "
            //ring #4
        ",
        "
            pros::delay(700);
            intake::motor.move_velocity(12000);
            timeout = 0;
            while(sensors::beam_break.get_value() == 0 && timeout < 3000) {
                pros::delay(20);
                timeout += 20;
            }
            intake::motor.brake();
            reckless->await();
        ",
        {
            "PilonsSegment": ["fast_motion", 0, 7.8, 1.92, 0],
            "TurnSegment": [0.65, 0.25, 45, 0.25],
            "PilonsSegment": ["fast_motion", 1, 9.8, 4, 1]
        }
        ],
    2: [
        "
            conveyor::cycle();
            //ring #5 (one before corner)
        ",
        "
            pros::delay(700);
            intake::motor.move_velocity(12000);    
            reckless->await(); 
        ",
        {
            "PilonsSegment": ["fast_motion", 0, 7.7, 4, 1]
        }
    ]

    }

 *
 *
 * If you do not want to read / do not understand the documentation, first end it all and then inevitably
 * just ask Dimitris or Akhil because who is reading allat yapping frfr ong
 */


function jsonify(){
    
}

function parse(){

}