declare module '*.svg' {
    const content: any;
    export const ReactComponent: any;
    export default content;
}

declare module '*.less' {
    const classes: { readonly [key: string]: string };
    export default classes;
}
