
/**
 * Pending resolution of:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/14790#issuecomment-297113715
 */

declare module 'reduce-reducers' {
    import {Reducer} from 'redux';
    function reduceReducer<S>(...reducers: Array<Reducer<S>>): Reducer<S>;
    export = reduceReducer;
}
