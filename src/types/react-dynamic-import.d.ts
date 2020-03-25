declare module "react-dynamic-import" {
  function foo(props: any): FunctionComponent<any>; 
  namespace foo { } // This is a hack to allow ES6 wildcard imports
  export = foo;
}