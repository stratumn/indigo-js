import sha256 from 'js-sha256';
import { Buffer } from 'buffer';

export default function computeMerkleParent(left, right) {
  if (right) {
    return sha256(
      Buffer.concat([new Buffer(left, 'hex'), new Buffer(right, 'hex')])
    );
  }
  return left;
}
