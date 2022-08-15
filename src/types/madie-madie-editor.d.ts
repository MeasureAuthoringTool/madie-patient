declare module "@madie/madie-editor" {
  import { FC } from "react";
  import { LifeCycleFn } from "single-spa";

  export const MadieEditor: FC<{
    value: string;
    onChange?: (value: string) => void;
    parseDebounceTime?: number;
    height?: string;
    readOnly?: boolean;
    validationsEnabled?: boolean;
  }>;
  export const bootstrap: LifeCycleFn<void>;
  export const mount: LifeCycleFn<void>;
  export const unmount: LifeCycleFn<void>;
}
