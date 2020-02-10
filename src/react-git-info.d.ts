declare module "react-git-info/macro" {
  function foo(); 
  namespace foo { } // This is a hack to allow ES6 wildcard imports
  export = foo;
}