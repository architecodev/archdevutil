'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const chainComposer = require('../chain.composer').chainComposer;

describe('#composechain()', () => {
  it('expect to get a function', () => {
    // arranges

    // acts
    const result = chainComposer();

    // asserts
    expect(result).to.not.be.undefined;
    expect(result).to.not.be.null;
    expect(typeof result).to.equal("function");
  });

  it('expect a supplied next function to be called as callback', () => {
    // arranges
    const next = sinon.spy();
    const context = {};
    const act = chainComposer();

    // acts
    act(context, next);

    // asserts
    expect(next.called).to.be.true;
  });

  it('expect to throw an error if compose with non-function arguments', () => {
    // arranges

    // acts
    const act = () => chainComposer(1, 2, 3);

    // asserts
    expect(act).to.throw(Error);
  });

  it('expect a composed function to be called', () => {
    // arranges
    const spyFn = sinon.spy();
    const act = chainComposer(spyFn);

    // acts
    act();

    // asserts
    expect(spyFn.called).to.be.true;
  });

  it('expect a composed function to be called with provided argument', () => {
    // arranges
    const spyFn = sinon.spy();
    const context = {};
    const act = chainComposer(spyFn);

    // acts
    act(context);

    // asserts
    expect(spyFn.calledWith(context)).to.be.true;
  });

  it('expect functions to be repectively called', () => {
    // arranges
    const fn = {
      fn1: (req, res, next) => { next(); },
      fn2: (req, res, next) => { next(); }
    };
    const spyFn1 = sinon.spy(fn, "fn1");
    const spyFn2 = sinon.spy(fn, "fn2");
    const req = {};
    const res = {};
    const act = chainComposer(fn.fn1, fn.fn2);

    // acts
    act(req, res);

    // asserts
    expect(spyFn1.calledWith(req, res)).to.be.true;
    expect(spyFn2.calledWith(req, res)).to.be.true;
    expect(spyFn1.calledBefore(spyFn2)).to.be.true;
  });

  it('expect functions to be repectively called and next() is called last', () => {
    // arranges
    const fn = {
      fn1: (ctx, next) => { next(); },
      fn2: (ctx, next) => { next(); }
    };
    const spyFn1 = sinon.spy(fn, "fn1");
    const spyFn2 = sinon.spy(fn, "fn2");
    const context = {};
    const next = sinon.spy();
    const act = chainComposer(fn.fn1, fn.fn2);

    // acts
    act(context, next);

    // asserts
    expect(next.called).to.be.true;
    expect(spyFn1.calledWith(context)).to.be.true;
    expect(spyFn2.calledWith(context)).to.be.true;
    expect(spyFn1.calledBefore(spyFn2)).to.be.true;
    expect(spyFn2.calledBefore(next)).to.be.true;
  });

  it('expect to call a fn1 and a error without calling fn2', () => {
    // arranges
    const expected = "Error in fn1"
    const spyFn1 = sinon.stub().throws(new Error(expected));
    const spyFn2 = sinon.spy();
    const context = {};
    const act = chainComposer(spyFn1, spyFn2);

    // acts
    const result = act(context);

    // asserts
    result.catch(error => expect(error.message).to.equal(expected));
    expect(spyFn1.calledWith(context)).to.be.true;
    expect(spyFn2.called).to.be.false;
  });

  it('expect to call fn1 and fn2 and return rejected promise', () => {
    // arranges
    const fn = {
      fn1: (ctx, next) => { next(); next(); },
      fn2: (ctx, next) => { next(); },
    };
    const spyFn1 = sinon.spy(fn, "fn1");
    const spyFn2 = sinon.spy(fn, "fn2");
    const context = {};
    const act = chainComposer(fn.fn1, fn.fn2);

    // acts
    const result = act(context);

    // asserts
    result.catch(error => expect(error.message).to.equal("Function Error: next() called multiple times"));
    expect(spyFn1.calledWith(context)).to.be.true;
    expect(spyFn2.calledWith(context)).to.be.true;
    expect(spyFn1.calledBefore(spyFn2)).to.be.true;
  });
});
