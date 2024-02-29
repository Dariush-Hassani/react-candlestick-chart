export type ConfigDataContextType = {
  width: number;
  height: number;
  diagramWidth?: number;
  diagramHeight?: number;
  decimal: number;
  characterFontWidth: number;
};

export type ConfigDataActionType =
  | {
      type: 'changeDiagramDimension';
      diagramWidth: number;
      diagramHeight: number;
    }
  | {
      type: 'changeContainerDimension';
      containerWidth: number;
      containerHeight: number;
    }
  | {
      type: 'changeDecimal';
      decimal: number;
    };
