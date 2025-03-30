/**
 * FORMAT FOR JSON OBJECT
 * 
 * 
 * The data for a full path will be stored as a dict of 4 main dicts:
 * {
 *  "Path ids dict" : {1:
 *                    {point_ids: [val1, val2, ...],
 *                     segment_data_ids: [val1, val2, ...],
 *                     pre_comment_id: val,
 *                     post_comment_id: val,
 *                     },
 *                   2: ...
 *                 },
 *  "Points" : {point_id: {x: val, y: val, theta: val}, ...},
 *  "Path data" : {segment_data_id: [path_type, ...], ...},
 *  "Pre comments" : {pre_comment_id: str, ...},
 *  "Post comments" : {post_comment_id: str, ...}
 * }
 * 
 * The path_data is intentionally vague because the following args depend on the path_type
 * if path_type is "PilonsSegment", remaining args are [speed (0-1 or string like "fast_motion"), timeout (in sec), drop_early (in inches)]
 *                 "TurnSegment", remaining are [speed (0-1), timeout (in sec)]
 * Points are stored in feet and degrees
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
 * {
 *  "Path ids dict": {1:
 *                      {point_ids: [1, 2, 3],
 *                       segment_data_ids: [1, 2, 3],
 *                       pre_comment_ids: 1,
 *                       post_comment_ids: 1
 *                      },
 *                    2:
 *                      {point_ids : [4],
 *                       segment_data_ids: [4],
 *                       pre_comment_ids: 2,
 *                       post_comment_ids: 2
 *                      }
 *                     },
 *  "Points": {1: {x: 7.8, y: 1.92, theta: null},
 *             2: {x: null, y: null, theta: 45},
 *             3: {x: 9.8, y: 4, theta: null},
 *             4: {x: 7.7, y: 4, theta: null}
 *            },
 *  "Path data": {1: {type: "PilonsSegment", "speed": "fast_motion", "timeout": 0, "drop_early": 0},
 *                2: {type: "TurnSegment", "speed": 0.65, "timeout": 0.25},
 *                3: {type: "PilonsSegment", "speed": "fast_motion", "timeout": 1, "drop_early": 1},
 *                4: {type: "PilonsSegment", "speed": "fast_motion", "timeout": 0, "drop_early": 0}
 *               },
 *  "Pre comments": {1: "//ring #4",
 *                   2: "conveyor::cycle();
                        //ring #5 (one before corner)"
 *                   },
 *  "Post comments": {1: "
                        pros::delay(700);
                        intake::motor.move_velocity(12000);
                        timeout = 0;
                        while(sensors::beam_break.get_value() == 0 && timeout < 3000) {
                        pros::delay(20);
                        timeout += 20;
                        }
                        intake::motor.brake();
                        reckless->await();",
                      2: "
                        pros::delay(700);
                        intake::motor.move_velocity(12000);    
                        reckless->await();"
 *                  } 
 *          }
 *
 * If you do not want to read / do not understand the documentation, first end it all and then inevitably
 * just ask Dimitris or Justin because who is reading allat yapping frfr ong
 */


function update_path(old_path_json, new_data) {
    // Handle the case where old_path_json is null
    if (!old_path_json) {
        old_path_json = {
            "Path ids dict": {},
            "Points": {},
            "Path data": {},
            "Pre comments": {},
            "Post comments": {}
        };
    }
    
    // Clone the old path to avoid modifying the original
    const path_json = JSON.parse(JSON.stringify(old_path_json));
    
    // Extract the parts of the new segment data
    const { pathId, point, segmentData, preComment, postComment } = new_data;
    
    // Generate new IDs for the new elements
    const pointKeys = Object.keys(path_json["Points"]);
    const segmentKeys = Object.keys(path_json["Path data"]);
    const preCommentKeys = Object.keys(path_json["Pre comments"]);
    const postCommentKeys = Object.keys(path_json["Post comments"]);
    
    const newPointId = pointKeys.length > 0 ? Math.max(...pointKeys.map(Number)) + 1 : 1;
    const newSegmentId = segmentKeys.length > 0 ? Math.max(...segmentKeys.map(Number)) + 1 : 1;
    
    // Add the new point to the Points dictionary
    path_json["Points"][newPointId] = point;
    
    // Add the new segment data to the Path data dictionary
    path_json["Path data"][newSegmentId] = segmentData;
    
    // Add pre-comment if provided
    let preCommentId = null;
    if (preComment) {
        preCommentId = preCommentKeys.length > 0 ? Math.max(...preCommentKeys.map(Number)) + 1 : 1;
        path_json["Pre comments"][preCommentId] = preComment;
    }
    
    // Add post-comment if provided
    let postCommentId = null;
    if (postComment) {
        postCommentId = postCommentKeys.length > 0 ? Math.max(...postCommentKeys.map(Number)) + 1 : 1;
        path_json["Post comments"][postCommentId] = postComment;
    }
    
    // If this is a new path, create it
    if (!path_json["Path ids dict"][pathId]) {
        path_json["Path ids dict"][pathId] = {
            point_ids: [],
            segment_data_ids: [],
            pre_comment_ids: preCommentId,
            post_comment_ids: postCommentId
        };
    }
    
    // Add the new point and segment to the path
    path_json["Path ids dict"][pathId].point_ids.push(newPointId);
    path_json["Path ids dict"][pathId].segment_data_ids.push(newSegmentId);
    
    // Update comments if provided and the path already exists
    if (preCommentId) {
        path_json["Path ids dict"][pathId].pre_comment_ids = preCommentId;
    }
    
    if (postCommentId) {
        path_json["Path ids dict"][pathId].post_comment_ids = postCommentId;
    }
    
    return path_json;
}

function convert_to_reveillib_code(path_json) {
    let code = "";
    const pathIds = path_json["Path ids dict"];
    
    // Loop through each path
    for (const pathId in pathIds) {
        const path = pathIds[pathId];
        const pointIds = path.point_ids;
        const segmentIds = path.segment_data_ids;
        const preCommentId = path.pre_comment_ids;
        const postCommentId = path.post_comment_ids;
        
        // Add pre-comment
        if (preCommentId) {
            code += path_json["Pre comments"][preCommentId] + "\n";
        }
        
        // Start path
        code += "reckless->go(\n";
        
        // Add segments
        let pointIndex = 0;
        for (let i = 0; i < segmentIds.length; i++) {
            const segmentData = path_json["Path data"][segmentIds[i]];
            const segmentType = segmentData.type;
            
            code += "    ";
            
            // First segment doesn't need the dot
            if (i === 0) {
                code += "RecklessPath()";
            }
            
            // Format segment based on type
            if (segmentType === "PilonsSegment") {
                const point = path_json["Points"][pointIds[pointIndex]];
                pointIndex++;
                
                code += `.with_segment(PilonsSegment(\n`;
                code += `        ${segmentData.speed},\n`;
                code += `        pilons_correction,\n`;
                code += `        &SimpleStop(0.1_s, 0.2_s, 0.25, ${segmentData.timeout}_s),\n`;
                code += `        {${point.x}_ft, ${point.y}_ft}, ${segmentData.drop_early}_in))\n`;
            } 
            else if (segmentType === "TurnSegment") {
                const point = path_json["Points"][pointIds[pointIndex]];
                pointIndex++;
                
                code += `.with_segment(TurnSegment(\n`;
                code += `        ${segmentData.speed},\n`;
                code += `        ${segmentData.timeout},\n`;
                code += `        ${point.theta}_deg,\n`;
                code += `        harsh_coeff,\n`;
                code += `        coast_coeff,\n`;
                code += `        0.25_s\n`;
                code += `        ))\n`;
            }
        }
        
        // Close path
        code += ");\n";
        
        // Add post-comment
        if (postCommentId) {
            code += path_json["Post comments"][postCommentId] + "\n\n";
        }
    }
    
    return code;
}