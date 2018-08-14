export function throwIfAlreadyLoaded(parentModule: any, moduleName: string): void {
  if (parentModule) {
    const errorMsg: string = `${moduleName} has already been loaded. Import Core modules in the AppModule only.`;
    throw new Error(errorMsg);
  }
}
