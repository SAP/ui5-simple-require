type LoadedFactory<T> = {
  fn: () => T;
  sap: Record<string, object>;
};

type ExtendFn = (name: string, prototype: T) => InstanceType<T>;

declare module "ui5-simple-require" {
  const loaded_factories: Record<string, LoadedFactory>;
  const loaded_factories: Record<string, LoadedFactory>;
  const importLib: <T>(
    libRootPath: string,
    libFilePath: string,
    ui5LibNamespace: string
  ) => InstanceType<T>;
  const createExtendableFromPrototype: (
    prototype: T
  ) => T & { extend: ExtendFn };
  const createExtendableFromObj: (prototype: T) => T & { extend: ExtendFn };
  const getExtendableStub: ExtendFn;
  const globalContext: (context: Record<string, object>) => void;
  const clearGlobalContext: () => void;
  const inject: (path: string, dep: object) => void;
  const clearInjection: () => void;
  const ui5require: <T>(
    module_path,
    position_dependencies,
    context
  ) => InstanceType<T>;
  export = {
    loaded_factories,
    importLib,
    createExtendableFromPrototype,
    createExtendableFromObj,
    getExtendableStub,
    globalContext,
    clearGlobalContext,
    inject,
    clearInjection,
    ui5require,
    import: <T>() => InstanceType<T>,
  };
}
