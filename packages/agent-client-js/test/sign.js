/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { sign as nacl } from 'tweetnacl';
import { stringify } from 'canonicaljson';
import { runTestsWithDataAndAgent } from './utils/testSetUp';

import { sign, signedProperties } from '../src/sign';
import withKey from '../src/withKey';

describe('#signedProperties', () => {
  runTestsWithDataAndAgent(processCb => {
    it('assigns the passed properties to a process', () =>
      processCb()
        .sign({ inputs: true })
        .signed.should.deepEqual({ inputs: true }));

    it('assigns the passed properties to a segment', () =>
      processCb()
        .createMap('test')
        .then(s1 =>
          s1.sign({ inputs: true }).signed.should.deepEqual({ inputs: true })
        ));

    it('assigns default properties to sign when called without argument on a segment', () =>
      signedProperties({ meta: { linkHash: 'test' } }).signed.should.deepEqual({
        inputs: true,
        prevLinkHash: true,
        refs: true
      }));

    it('does not enable signing prevLinkHash by default when called on a process', () =>
      signedProperties({}).signed.should.deepEqual({
        inputs: true,
        prevLinkHash: false,
        refs: true
      }));

    it('fails if trying to add a invalid propery to be signed', () =>
      (() => signedProperties({}, { unknown: true })).should.throw(
        'Cannot sign property unknown, it has to be one of inputs,prevLinkHash,refs'
      ));
  });
});

describe('#sign', () => {
  const pair = nacl.keyPair();
  const testKey = withKey(
    {},
    {
      type: 'ed25519',
      secret: Buffer.from(pair.secretKey).toString('base64')
    }
  ).key;

  const testData = {
    refs: [{ test: 'test' }],
    prevLinkHash: 'test',
    inputs: ['1', '2']
  };

  it('outputs a signature given a key and data to sign', () =>
    sign(testKey, testData).then(sig => {
      sig.payload.should.be.exactly(
        '[meta.refs,meta.prevLinkHash,meta.inputs]'
      );
      sig.publicKey.should.be.exactly(
        Buffer.from(
          nacl.keyPair.fromSecretKey(pair.secretKey).publicKey
        ).toString('base64')
      );
    }));

  it('build the payload accordingly to the provided data', () =>
    sign(testKey, { ...testData, inputs: false }).then(sig =>
      sig.payload.should.be.exactly('[meta.refs,meta.prevLinkHash]')
    ));

  it('outputs a valid signature', () =>
    sign(testKey, { ...testData, inputs: false }).then(sig => {
      const { signature, publicKey } = sig;
      const payloadBytes = Buffer.from(
        stringify([testData.refs, testData.prevLinkHash])
      );
      const verif = nacl.detached.verify(
        payloadBytes,
        Buffer.from(signature, 'base64'),
        Buffer.from(publicKey, 'base64')
      );
      verif.should.be.true();
    }));

  it('outputs a valid signature with an externally generated key', () => {
    const externalKey = withKey(
      {},
      {
        type: 'ed25519',
        secret:
          'yFQwrc9r3afEjXJgPCWmrsDFIu74kpzeO45JlvT0DR/DMi29TsL0kD4ljTNHo65MntarqAYF4iprgkGTRkVuCw=='
      }
    ).key;

    return sign(externalKey, { ...testData, inputs: false }).then(sig => {
      const { signature, publicKey } = sig;
      const payloadBytes = Buffer.from(
        stringify([testData.refs, testData.prevLinkHash])
      );
      publicKey.should.be.exactly(
        'wzItvU7C9JA+JY0zR6OuTJ7Wq6gGBeIqa4JBk0ZFbgs='
      );
      const verif = nacl.detached.verify(
        payloadBytes,
        Buffer.from(signature, 'base64'),
        Buffer.from(publicKey, 'base64')
      );
      verif.should.be.true();
    });
  });

  it('fails if the provided data does not match [inputs, refs, prevLinkHash]', () =>
    sign(testKey, { ...testData, unknown: 'test' })
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err =>
        err.message.should.be.exactly(
          'Cannot sign property unknown, it has to be one of inputs,prevLinkHash,refs'
        )
      ));

  it('fails the provided data to sign is null', () =>
    sign(testKey, null)
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err =>
        err.message.should.be.exactly('trying to sign an emtpy payload')
      ));

  it('fails the provided data to sign is empty', () =>
    sign(testKey, {})
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err =>
        err.message.should.be.exactly(
          'jmespath query [] did not match any data'
        )
      ));

  it('fails when the key is ill-formatted ', () =>
    sign({ type: 'ed25519' }, testData)
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err =>
        err.message.should.be.exactly(
          'key is not defined (use: segment.withKey(key)'
        )
      ));
});
