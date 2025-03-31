import React from 'react';
import './code_blocks.css';
import { convert_to_reveillib_code } from '../helpers/jsonify_data';

function CodeBlocks({ x_ft, y_ft, speed }) {

  console.log(`x feet is ${x_ft}`)
  console.log(`y feet is ${y_ft}`)
  console.log(`speed is ${speed}`)

  const path_dict = {
    "Path ids dict": {
      1: {
        point_ids: [1],
        segment_data_ids: [1],
        pre_comment_ids: 1,
        post_comment_ids: 1
      }
    },
    "Points": {
      1: {x: x_ft, y: y_ft, theta: null}
    },
    "Path data": {
      1: {type: "PilonsSegment", speed: speed, timeout: 0, drop_early: 0}
    },
    "Pre comments": {
      1: "// Auto-generated path"
    },
    "Post comments": {
      1: "reckless->await();"
    }
  };

  /*
  call needs to be made from firebase to get the current segment info

  function update_path (I have already made) puts the path_dict for this point into the stored path dict

  code needs to be sent back to firebase
  */

  return (
    <div className="code-blocks-container">
      {/* <pre className="code-block code-block-content">
        {"// ADD COMMENTS HERE"}
      </pre> */}
      <pre className="code-block code-block-content">
        {convert_to_reveillib_code(path_dict)}
      </pre>
      {/* <pre className="code-block code-block-content">
        {"reckless->await();"}
      </pre> */}
    </div>
  );
}

export default CodeBlocks;